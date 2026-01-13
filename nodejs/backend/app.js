import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import usersRoutes from "#src/routes/usersRoutes.js";
import authRoutes from "#src/routes/authRoutes.js";
import reservationsRoutes from "#src/routes/reservationsRoutes.js";

const app = express();

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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
global.appRoot = path.resolve(__dirname);

app.use('/api/users', usersRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/reservations', reservationsRoutes);

export default app;
