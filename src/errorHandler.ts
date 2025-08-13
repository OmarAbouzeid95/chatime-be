import type { Request, Response, NextFunction } from 'express';
import HttpError from './classes/HttpError.js';

export const errorHandler = (
	err: unknown,
	_req: Request,
	res: Response,
	_next: NextFunction
) => {
	console.error(err);

	let status = 500;
	let message = 'Something went wrong, please try again.';

	if (err instanceof HttpError) {
		status = err.status;
		message = err.message;
	}
	res.status(status).json({ message });
};
