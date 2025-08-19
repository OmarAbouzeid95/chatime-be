import { Router } from 'express';
import { prisma } from '../index.js';
import { nanoid } from 'nanoid';
import HttpError from '../classes/HttpError.js';
import { findRoom, findUser } from '../prisma/helpers.js';

export const roomRouter: Router = Router();

roomRouter.post('/create', async (req, res) => {
	const { userId } = req.body ?? {};
	const user = await findUser(userId);

	const room = await prisma.room.create({
		data: {
			uuid: nanoid(10),
			users: {
				connect: [user],
			},
		},
		select: {
			uuid: true,
		},
	});

	res.status(201).json(room);
});

roomRouter.post('/join', async (req, res) => {
	const { userId, roomId } = req.body ?? {};
	const user = await findUser(userId);

	const room = await findRoom(roomId);

	if (room.users.length >= 2) {
		throw new HttpError(`This room is already full.`, 401);
	}

	await prisma.room.update({
		where: {
			uuid: room.uuid,
		},
		data: {
			users: {
				set: [...room.users, user],
			},
		},
	});

	res.status(200).send();
});
