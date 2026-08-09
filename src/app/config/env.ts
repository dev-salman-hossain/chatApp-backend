import dotenv from 'dotenv';
import { env } from 'process';

dotenv.config();

const config={
    databaseUrl: process.env.DATABASE_URL || '',
    port: process.env.PORT || 3000,
    jwt_access_token_secret: process.env.JWT_ACCESS_SECRET || '',
    jwt_refresh_token_secret: process.env.JWT_REFRESH_SECRET || '',
    
}

export default config;