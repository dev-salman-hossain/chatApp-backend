import express, { Application } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import experssRateLimit from 'express-rate-limit';
import helmet from 'helmet';
import hpp from 'hpp'; 



const app : Application = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(experssRateLimit());
app.use(helmet());
app.use(hpp());


app.get('/', (_req, res) => {
    res.send('Hello World');
});

export default app;