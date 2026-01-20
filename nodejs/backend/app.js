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
        console.log(`User ${id} connected. ${onlineUsers.get(id).size} in total`);
    }

    socket.on('disconnect', () => {
        if (id) {
            const userSockets = onlineUsers.get(id);
            if (userSockets) {
                console.log(`User ${socket.id} disconnected. ${userSockets.size - 1} remaining`);
                userSockets.delete(socket.id);
                if (userSockets.size === 0) {
                    onlineUsers.delete(id);
                }
            }
        }
    });

    socket.on('join_room', (roomName) => {
        socket.join(roomName);
        console.log(`Socket ${socket.id} joined room ${roomName}`);
    });

    socket.on('leave_room', (roomName) => {
        socket.leave(roomName);
        console.log(`Socket ${socket.id} left room ${roomName}`);
    });

    socket.on('seat_lock', (trainsSeats) => {
       console.log(trainsSeats);
       trainsSeats.forEach(t => {

       })
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

export { app, io };
export default httpServer;

export function sendNotificationToUser(targetUserId, ev='notification', message) {
  const socketIds = onlineUsers.get(targetUserId);
  if (socketIds) {
    console.log(`Sending event ${ev} with message ${message} to user ${targetUserId} on sockets:`, socketIds);
    socketIds.forEach(socketId => io.to(socketId).emit(ev, message));
  }
}