import http, { Server } from "http";
import { Pool } from "pg";

import config from "./app/config/env.js";
import app from "./app.js";
// 'tls' থেকে connect ইমপোর্ট করার লাইনটি রিমুভ করা হয়েছে

// pool of database connections
const pool = new Pool({
    connectionString: config.databaseUrl, // নিশ্চিত করুন env.js ফাইলে এটি databaseUrl নামেই আছে
});

// start the server
async function startServer() {
    const port = config.port || 3000;
    let server: Server; 

    try {
        if (!config.databaseUrl) {
            throw new Error("Database URL is missing in config!");
        }
      const client = await pool.connect();
      console.log("🛢️ PostgreSQL connected successfully!");

      client.release(); // Release the client back to the pool

        // ১. সার্ভার তৈরি করে ভেরিয়েবলে অ্যাসাইন করুন
        server = http.createServer(app);

        // ২. এবার listen কল করুন (এখন আর এরর দেবে না)
        server.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });

    } catch (error) {
        console.error('Error starting server or database:', error);
    }
}

(async () => {
    await startServer();
})();