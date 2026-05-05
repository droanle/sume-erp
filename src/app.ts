import 'dotenv/config';
import express from "express";
import {GroupingProvider} from "gatex-express";
import errorHandler from "@utils/errors/errorHandler";

// Routes
import auth from '@modules/auth/auth.routes';

export async function createApp() {
    const app = express();
    app.use(express.json()); // Middleware for JSON parsing

    const provider = new GroupingProvider();

    // Settings Routes
    provider.group("auth", auth);

    // Health check
    provider.get('/health', (req, res) => {
        res.json({status: 'ok'});
    });

    provider.finish(app);

    // --- GLOBAL ERROR HANDLER ---
    app.use(errorHandler);

    return app;
}
