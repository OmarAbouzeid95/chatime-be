import { WebSocketServer } from 'ws';
import express from 'express';
import { PrismaClient } from './generated/prisma/client';

const app = express();
const wss = new WebSocketServer({ port: 8080 });
const prisma = new PrismaClient();

app.get('/users', async (_, res) => {
	const users = await prisma.user.findMany();
	console.log('found users: ', users);
	res.status(200);
	res.send();
});

app.post('/create', async (req, res) => {
	const user = await prisma.user.create({
		data: {
			name: 'Omar Abouzeid',
		},
	});
	console.log('user successfully added: ', user);
	res.json({ status: 200, message: 'success' });
});

app.listen(8000, () => {
	console.log('connected to express');
});

wss.on('connection', (socket) => {
	socket.on('message', (message) => {
		console.log('received message: ', message.toString());
	});
});
