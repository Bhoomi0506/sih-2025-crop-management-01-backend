import express, { Request, Response, NextFunction } from 'express';
import connectDB from './config/database';
import apiRouter from './routes';
const app = express();
const PORT = process.env.PORT || 9501;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger Documentation
//app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Routes
app.use('/api/v1', apiRouter);

// 404 Handler
app.use((_req: Request, res: Response) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint not found'
    });
});

// Global Error Handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error('Unhandled error:', err.message);
    res.status(500).json({
        success: false,
        message: 'Internal server error'
    });
});

// Start Server
const startServer = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`
╔═══════════════════════════════════════════════════════════╗
║           Crop Management API Server                      ║
╠═══════════════════════════════════════════════════════════╣
║  Status:    Running                                       ║
║  Port:      ${String(PORT).padEnd(45)}║
║  Base URL:  http://localhost:${String(PORT).padEnd(30)}║
║  Docs:      http://localhost:${String(PORT)}/api-docs     ║
║  Database:  MongoDB Connected                             ║
╚═══════════════════════════════════════════════════════════╝
            `);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();
