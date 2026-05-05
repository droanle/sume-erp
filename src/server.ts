import 'dotenv/config';
import "reflect-metadata";
import {createApp} from './app';

async function bootstrap(): Promise<void> {
    try {
        const app = await createApp();

        app.listen(parseInt(process.env.PORT ?? '3000'), () => {
            console.log("✓ Server running on http://localhost:3000");
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('SIGINT received, shutting down gracefully');
    process.exit(0);
});

bootstrap().then(() => {
});
