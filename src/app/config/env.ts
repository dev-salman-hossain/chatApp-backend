import dotenv from 'dotenv';

dotenv.config();

const config = {
    databaseUrl: process.env.DATABASE_URL || '',
    port: process.env.PORT || 5000,
    jwt_access_token_secret: process.env.JWT_ACCESS_SECRET || '',
    jwt_refresh_token_secret: process.env.JWT_REFRESH_SECRET || '',
    firebase: {
        projectId: process.env.FIREBASE_PROJECT_ID || '',
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL || '',
        privateKey: process.env.FIREBASE_PRIVATE_KEY || '',
    },
};

export default config;