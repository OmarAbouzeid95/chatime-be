import { Router } from 'express';
import { prisma } from '../index.js';
import HttpError from '../classes/HttpError.js';

export const userRouter: Router = Router();

userRouter.post('/create', async (req, res) => {
	const { name } = req.body ?? {};
	if (!name) {
		throw new HttpError('User name is missing.', 400);
	}

	const user = await prisma.user.create({ data: { name } });

	res.status(201).json(user);
});
