import { Router } from 'express';
import { io } from '../index.js';
import { prisma } from '../index.js';
import { nanoid } from 'nanoid';
import { findUser } from '../prisma/helpers.js';
import HttpError from '../classes/HttpError.js';
import type { Room, User } from '../../generated/prisma/index.js';

export const messageRouter: Router = Router();

messageRouter.post('/send/:roomId', async (req, res) => {
	const { roomId } = req.params;
	const { userId, message } = req.body ?? {};

	if (!roomId || !userId) {
		throw new HttpError('Missing roomId or userId.', 400);
	}

	const room = await prisma.room.findFirst({
		where: {
			uuid: {
				equals: roomId,
			},
			users: {
				some: {
					id: userId,
				},
			},
		},
	});

	if (!room) {
		throw new HttpError(
			`User with ID: ${userId} is not part of this chat`,
			400
		);
	}
	const user = await findUser(userId);

	const createdMessage = await prisma.message.create({
		data: {
			uuid: nanoid(10),
			content: message.content,
			user: {
				connect: user as User,
			},
			room: {
				connect: room as Room,
			},
		},
		omit: {
			id: true,
			roomId: true,
			updatedAt: true,
		},
		include: {
			user: true,
		},
	});

	io.to(room.uuid).emit('NEW_MESSAGE', createdMessage);

	res.status(201).json(createdMessage);
});

messageRouter.get('/:roomId', async (req, res) => {
	const { roomId } = req.params ?? {};
	const { userId } = req.query ?? {};

	if (!roomId || !userId) {
		throw new HttpError('Missing roomId or userId.', 400);
	}

	const room = await prisma.room.findFirst({
		where: {
			uuid: {
				equals: roomId,
			},
			users: {
				some: {
					id: Number(userId),
				},
			},
		},
	});

	if (!room) {
		throw new HttpError(
			`User with ID: ${userId} is not part of this chat`,
			400
		);
	}

	const messages = await prisma.message.findMany({
		where: {
			room: {
				uuid: {
					equals: roomId,
				},
			},
		},
		omit: {
			id: true,
			updatedAt: true,
			userId: true,
			roomId: true,
		},
		include: {
			user: true,
		},
	});

	res.status(200).json(messages);
});
