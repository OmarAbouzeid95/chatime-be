import { Router } from 'express';
import { io } from '../index.js';
import { prisma } from '../index.js';
import { nanoid } from 'nanoid';
import { findRoom, findUser } from '../prisma/helpers.js';
import HttpError from '../classes/HttpError.js';
import type { Room, User } from '../../generated/prisma/index.js';

export const messageRouter: Router = Router();

messageRouter.post('/send/:roomId', async (req, res) => {
	const { roomId } = req.params;
	const { userId, message } = req.body ?? {};

	if (!roomId || !userId) {
		throw new HttpError('Missing roomId or userId.', 400);
	}
	const room = await findRoom(roomId);
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
		},
	});

	io.to(room.uuid).emit('NEW_MESSAGE', createdMessage);

	res.status(201).json(createdMessage);
});
