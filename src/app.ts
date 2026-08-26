import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import expressRateLimit from 'express-rate-limit';
import helmet from 'helmet';
import hpp from 'hpp'; 
import router from './app/routers/index.js';

const app : Application = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(expressRateLimit());
app.use(helmet());
app.use(hpp());

app.use('/api/v1', router);

app.get('/', (_req:Request, res:Response) => {
    res.status(200).json({success: true, message: 'Chat App Server is running', status: 'success'});
});

export default app;