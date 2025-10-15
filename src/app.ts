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

// Base route
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to the HZRD API!",
    version: "1.0.0",
    info: "api/v1/earthquakes to get recent earthquake data",
  });
});

// routes
app.use('/api/v1/earthquakes', earthquakeRoutes)

// error handlers
app.use(errorHandler);
app.use(notFoundHandler);

export default app;