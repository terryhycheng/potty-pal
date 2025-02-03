import { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';
import express from 'express';
import path from 'path';
import logger from 'morgan';
import cors from 'cors';
import mongoose from 'mongoose';
import http from 'http';
import debug from 'debug';
import toiletRouter from './routes/toilets';
import tokenChecker from './middleware/tokenChecker';
import tokensRouter from './routes/tokens';
import usersRouter from './routes/users';

const serverDebug = debug('potty-pal:server');

/**
 * Normalize a port into a number, string, or false.
 */
const normalizePort = (val: string): number | string | boolean => {
  const portNumber = Number(val);

  if (Number.isNaN(portNumber)) {
    return val;
  }

  if (portNumber >= 0) {
    return portNumber;
  }

  return false;
};

/**
 * Event listener for HTTP server "error" event.
 */
const handleError = (
  error: NodeJS.ErrnoException,
  serverPort: string | number
): never => {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind =
    typeof serverPort === 'string'
      ? `Pipe ${serverPort}`
      : `Port ${serverPort}`;

  switch (error.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
    case 'EADDRINUSE':
      console.error(`${bind} is already in use`);
      process.exit(1);
    default:
      throw error;
  }
};

const app = express();

// setup for receiving JSON
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb' }));

app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World');
});

// route setup
app.post('/toilets', tokenChecker);
app.use('/toilets', toiletRouter);
app.use('/tokens', tokensRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use((req: Request, res: Response, next: NextFunction) => {
  next(createError(404));
});

// error handler
interface ErrorWithStatus extends Error {
  status?: number;
}

app.use(
  (err: ErrorWithStatus, req: Request, res: Response, next: NextFunction) => {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500).json({ message: 'server error' });
  }
);

/**
 * Initialize server and database connection
 */
const startServer = async (): Promise<void> => {
  try {
    // Connect to MongoDB
    const mongoDbUrl = process.env.MONGODB_URL || 'mongodb://0.0.0.0/potty-pal';
    await mongoose.connect(mongoDbUrl);
    console.log('MongoDB connected successfully');

    // Set up server
    const port = normalizePort(process.env.PORT || '8080');
    const server = http.createServer(app);

    server.listen(port);
    server.on('error', (error: NodeJS.ErrnoException) =>
      handleError(error, port.toString())
    );

    server.on('listening', () => {
      const addr = server.address();
      if (!addr) return;

      const bind =
        typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`;

      console.log(`Server listening on ${bind}`);
      serverDebug(`Listening on ${bind}`);
    });
  } catch (error) {
    console.error('Failed to initialize server:', error);
    process.exit(1);
  }
};

// Handle MongoDB connection errors
mongoose.connection.on('error', (error) => {
  console.error('MongoDB connection error:', error);
});

// Start the server
if (require.main === module) {
  startServer().catch((error) => {
    console.error('Server initialization failed:', error);
    process.exit(1);
  });
}

export default app;
