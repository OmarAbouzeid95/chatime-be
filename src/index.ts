import express, { Router } from 'express';
import dotenv from 'dotenv';
import { PrismaClient } from '../generated/prisma/index.js';
import HttpError from './classes/HttpError.js';

import { errorHandler } from './errorHandler.js';

dotenv.config();

const prisma = new PrismaClient();
const app = express();
app.use(express.json());

app.post('/user/create', async (req, res, next) => {
	const { name } = req.body;
	if (!name) {
		throw new HttpError('User name is missing.', 400);
	}

	await prisma.user.create({ data: { name } });

	res.status(201).json({ message: 'User created successfully.' });
});

app.use(errorHandler);

app.listen(process.env.EXPRESS_PORT, () => {
	console.log(`Express server running on port: ${process.env.EXPRESS_PORT}`);
});
