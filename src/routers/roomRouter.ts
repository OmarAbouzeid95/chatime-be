import { Router } from 'express';
import { prisma } from '../index.js';
import { nanoid } from 'nanoid';

export const roomRouter: Router = Router();

roomRouter.post('/create', async (req, res) => {
	const room = await prisma.room.create({
		data: {
			uuid: nanoid(10),
		},
	});

	res.status(201).json(room);
});
