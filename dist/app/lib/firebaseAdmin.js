import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import config from '../config/env.js';
let firebaseApp = null;
export const getFirebaseAdmin = () => {
    if (!firebaseApp) {
        const { projectId, clientEmail, privateKey } = config.firebase;
        if (projectId && clientEmail && privateKey && !projectId.includes('your_firebase')) {
            const formattedPrivateKey = privateKey.replace(/\\n/g, '\n');
            const apps = getApps();
            if (apps.length > 0) {
                firebaseApp = apps[0] || null;
            }
            else {
                firebaseApp = initializeApp({
                    credential: cert({
                        projectId,
                        clientEmail,
                        privateKey: formattedPrivateKey,
                    }),
                });
            }
            console.log('🔥 Firebase Admin initialized successfully!');
        }
        else {
            console.log('⚠️ Firebase Admin credentials not configured in .env');
        }
    }
    return firebaseApp;
};
export const getFirebaseAuth = () => {
    const app = getFirebaseAdmin();
    if (!app)
        return null;
    return getAuth(app);
};
export default getFirebaseAdmin;
//# sourceMappingURL=firebaseAdmin.js.map