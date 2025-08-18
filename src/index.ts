import { createServer } from 'node:http';
import express from 'express';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import { PrismaClient } from '../generated/prisma/index.js';

import { userRouter } from './routers/userRouter.js';
import { roomRouter } from './routers/roomRouter.js';
import { errorHandler } from './errorHandler.js';

dotenv.config();

export const prisma = new PrismaClient();
const app = express();
const server = createServer(app);
export const io = new Server(server);
app.use(express.json());

app.use('/users', userRouter);
app.use('/rooms', roomRouter);

app.use(errorHandler);

io.on('connection', (socket) => {
	socket.on('join', (roomId) => {
		socket.join(roomId);
	});
});

server.listen(process.env.EXPRESS_PORT, () => {
	console.log(`Express server running on port: ${process.env.EXPRESS_PORT}`);
});
