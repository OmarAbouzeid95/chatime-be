import { prisma } from '../index.js';
import HttpError from '../classes/HttpError.js';
import { Prisma } from '../../generated/prisma/index.js';

export const findUser = async <
	T extends Prisma.RoomInclude | undefined = undefined
>(
	userId: number,
	userInclude?: Prisma.UserInclude
) => {
	const user = await prisma.user.findFirst({
		where: {
			id: {
				equals: userId,
			},
		},
		include: {
			...userInclude,
		},
	});

	if (!user) {
		throw new HttpError(`User with id: ${userId} doesn't exist`, 400);
	}

	return user;
};

export const findRoom = async <
	T extends Prisma.RoomInclude | undefined = undefined
>(
	roomId: string,
	prismaInclude?: Prisma.RoomInclude
) => {
	const room = await prisma.room.findFirst({
		where: {
			uuid: {
				equals: roomId,
			},
		},
		include: {
			...prismaInclude,
		},
	});

	if (!room) {
		throw new HttpError(`Room with id: ${roomId} doesn't exist`, 400);
	}

	return room;
};
