import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer } from 'http';
import { Server } from 'socket.io';

import usersRoutes from "#src/routes/usersRoutes.js";
import authRoutes from "#src/routes/authRoutes.js";
import stationsRoutes from "#src/routes/stationsRoute.js";
import solutionsRoutes from "#src/routes/solutionsRoutes.js";
import reservationsRoutes from "#src/routes/reservationsRoutes.js";
import trainsRoutes from "#src/routes/trainsRoutes.js";
import { extractIdFromToken } from '#src/middleware/authMiddleware.js';
import { listenToExpirations } from '#src/util/expiredRedisListener.js';
import { getSelectedSeats, handleSeatLock } from "#src/controllers/redisController.js";

const app = express();
const httpServer = createServer(app);
const onlineUsers = new Map();

const corsOptions = {
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const io = new Server(httpServer, {
    cors: corsOptions
});

app.use((req, res, next) => {
    req.io = io;
    next();
});

io.on('connection', async (socket) => {
    const authToken = socket.handshake.query.authToken;
    const id = await extractIdFromToken(authToken);

    if (id) {
        if (!onlineUsers.has(id)) {
            onlineUsers.set(id, new Set());
        }
        onlineUsers.get(id).add(socket.id);
    }

    socket.on('disconnect', () => {
        if (!id) return;
        const userSockets = onlineUsers.get(id);
        if (userSockets) {
            userSockets.delete(socket.id);
            if (userSockets.size === 0) {
                onlineUsers.delete(id);
            }
        }
    });

    socket.on('join_room', async (roomName) => {
        socket.join(roomName);
        const seats = await getSelectedSeats(roomName.replace("train_", ""));
        seats.forEach(s => io.to(socket.id).emit('seat_selected', s));
    });

    socket.on('leave_room', (roomName) => {
        socket.leave(roomName);
    });

    socket.on('lock_seats', async (data) => {
        if (!id) return;

        try {
            await handleSeatLock(id, data.bookingGroups);
        } catch (error) {
            console.error("Socket lock error:", error);
        }
    });
});


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
global.appRoot = path.resolve(__dirname);

app.use('/api/users', usersRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/stations', stationsRoutes);
app.use('/api/solutions', solutionsRoutes);
app.use('/api/reservations', reservationsRoutes);
app.use('/api/trains', trainsRoutes);

listenToExpirations(io).catch(err => {
    console.error("Failed to start Redis listener:", err);
});

export { app, io };
export default httpServer;

export function sendNotificationToUser(targetUserId, ev='notification', message) {
  const socketIds = onlineUsers.get(targetUserId);
  if (socketIds) {
    console.log(`Sending event ${ev} with message ${message} to user ${targetUserId} on sockets:`, socketIds);
    socketIds.forEach(socketId => io.to(socketId).emit(ev, message));
  }
}