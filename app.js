import express from 'express';
import cors from 'cors';
import { errorLog, infoLog } from './utils/logger.js';
import {  MONGODB_URI } from './utils/config.js';
import mongoose from 'mongoose';
import { errorHandler, morganLog, requestLogger, unknownEndpoint } from './utils/middleware.js';
import { phoneBookRouter } from './controllers/phoneBooks.js';

const app = express();

infoLog('connecting to ', MONGODB_URI);
const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    infoLog('connected to MongoDB');
  } catch (error) {
    errorLog('error connecting to MongoDB: ', error.message);
  }
};
connectDB();

app.use(cors());
app.use(express.static('build'));
app.use(express.json());
app.use(requestLogger);
app.use(morganLog);

app.use('/api/persons', phoneBookRouter);

app.use(unknownEndpoint);
app.use(errorHandler);

export { app };