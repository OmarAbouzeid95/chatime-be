import { Router } from 'express';
import { prisma } from '../index.js';
import { nanoid } from 'nanoid';
import HttpError from '../classes/HttpError.js';
import { findRoom, findUser } from '../prisma/helpers.js';
import type { User } from '../../generated/prisma/index.js';

export const roomRouter: Router = Router();

roomRouter.post('/create', async (req, res) => {
	const { name } = req.body ?? {};
	if (!name) {
		throw new HttpError('User name is missing.', 400);
	}

	const user = await prisma.user.create({ data: { name } });
	const room = await prisma.room.create({
		data: {
			uuid: nanoid(10),
			users: {
				connect: [user as User],
			},
		},
		select: {
			uuid: true,
		},
	});

	res.status(201).json({ user, room });
});

roomRouter.post('/join', async (req, res) => {
	const { name, roomId } = req.body ?? {};
	if (!name) {
		throw new HttpError('User name is missing.', 400);
	}

	const user = await prisma.user.create({ data: { name } });
	const room = await findRoom(roomId, { users: true });

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

	res.status(200).json({ user, room });
});
