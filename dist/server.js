import http from "http";
import config from "./app/config/env.js";
import app from "./app.js";
import prisma from "./app/lib/prisma.js";
async function startServer() {
    const port = config.port || 3000;
    let server;
    try {
        // Database connect
        await prisma.$connect();
        console.log("🛢️ PostgreSQL connected successfully via centralized Prisma!");
        // Server setup
        server = http.createServer(app);
        server.listen(port, () => {
            console.log(`🚀 Server is running on port ${port}`);
        });
    }
    catch (error) {
        console.error('Error starting server or database:', error);
        await prisma.$disconnect();
        process.exit(1);
    }
}
(async () => {
    await startServer();
})();
//# sourceMappingURL=server.js.map