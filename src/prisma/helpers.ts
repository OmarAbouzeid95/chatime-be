import { prisma } from '../index.js';
import HttpError from '../classes/HttpError.js';
import { Prisma } from '../../generated/prisma/index.js';

export const findUser = async (userId: number) => {
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

	return user;
};

export const findRoom = async (roomId: string) => {
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

	return room;
};
