import express, { Application } from 'express';
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

app.get('/', (_req, res) => {
    res.send('Server is running');
});

export default app;