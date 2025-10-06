import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { earthquakeRoutes } from './routes';
import { errorHandler, notFoundHandler } from './middlewares/error.middleware';

const app = express();

app.use(cors({
   origin: '*',
}));
app.use(express.json());
app.use(helmet());

// routes
app.use('/api/v1/earthquakes', earthquakeRoutes)

// error handlers
app.use(errorHandler);
app.use(notFoundHandler);

export default app;