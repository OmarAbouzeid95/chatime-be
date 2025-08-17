import express, { Router } from 'express';
import dotenv from 'dotenv';
import { PrismaClient } from '../generated/prisma/index.js';

import { userRouter } from './routers/userRouter.js';
import { roomRouter } from './routers/roomRouter.js';
import { errorHandler } from './errorHandler.js';

dotenv.config();

export const prisma = new PrismaClient();
const app = express();
app.use(express.json());

app.use('/users', userRouter);
app.use('/rooms', roomRouter);

app.use(errorHandler);

app.listen(process.env.EXPRESS_PORT, () => {
	console.log(`Express server running on port: ${process.env.EXPRESS_PORT}`);
});
