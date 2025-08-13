import express, { Router } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

app.post('/user/create', (req, res) => {});

app.listen(process.env.EXPRESS_PORT, () => {
	console.log(`Express server running on port: ${process.env.EXPRESS_PORT}`);
});
