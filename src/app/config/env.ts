import dotenv from 'dotenv';
import { env } from 'process';

dotenv.config();

const config={
    databaseUrl: process.env.DATABASE_URL || '',
    port: process.env.PORT || 3000,
    
}

export default config;