import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import connectDB from './config/database';
import apiRouter from './routes';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger.json';

const app = express();
const PORT = process.env.PORT || 9501;

// Middleware
app.use(cors()); // Enable CORS for all routes
app.options('*', cors()); // Enable pre-flight across-the-board
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger Documentation
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes
app.use('/api/v1', apiRouter);

// Health Check
app.get('/api/v1/health', (req: Request, res: Response) => {
    res.status(200).json({ status: 'ok', message: 'Server is healthy' });
});

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
║           Crop Management API Server v2.0                 ║
╠═══════════════════════════════════════════════════════════╣
║  Status:    Running                                       ║
║  Port:      ${String(PORT).padEnd(45)}║
║  Base URL:  http://localhost:${String(PORT).padEnd(30)}║
║  API Base:  /api/v1                                       ║
║  API Docs:  http://localhost:${PORT}/api/docs${' '.repeat(Math.max(0, 24 - String(PORT).length))}║
║  Database:  MongoDB Connected                             ║
╠═══════════════════════════════════════════════════════════╣
║  Endpoints:                                               ║
║  • GET  /api/v1/health      - Health check                ║
║  • POST /api/v1/auth/*      - Authentication              ║
║  • CRUD /api/v1/users       - User management             ║
║  • CRUD /api/v1/crops       - Crop management             ║
║  • CRUD /api/v1/fields      - Field management            ║
║  • CRUD /api/v1/activities  - Activity management         ║
╚═══════════════════════════════════════════════════════════╝
            `);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();
