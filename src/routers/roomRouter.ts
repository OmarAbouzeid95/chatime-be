import { Router } from 'express';
import { prisma } from '../index.js';
import { nanoid } from 'nanoid';
import HttpError from '../classes/HttpError.js';

export const roomRouter: Router = Router();

roomRouter.post('/create', async (req, res) => {
	const { userId } = req.body ?? {};
	const user = await prisma.user.findFirst({
		where: {
			id: {
				equals: userId,
			},
		},
	});

	if (!user) {
		throw new HttpError(`User with id: ${userId} doesn't exist`, 400);
	}

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
	const user = await prisma.user.findFirst({
		where: {
			id: {
				equals: userId,
			},
		},
	});

	if (!user) {
		throw new HttpError(`User with id: ${userId} doesn't exist`, 400);
	}

	const room = await prisma.room.findFirst({
		where: {
			uuid: {
				equals: roomId,
			},
		},
		select: {
			uuid: true,
			users: true,
		},
	});
	if (!room) {
		throw new HttpError(`Room with id: ${roomId} doesn't exist`, 400);
	}

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
