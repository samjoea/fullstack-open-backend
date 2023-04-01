import morgan from 'morgan';
import { infoLog, errorLog } from './logger.js';

const errorHandler = (error, request, response, next) => {
  console.error(error.message);
  errorLog('Error: ', error.name);
  if(error.name === 'CastError') return response.status(400).send({ error: 'malFormatted id' });
  else if(error.name === 'ValidationError') return response.status(400).json({ error: error.message });

  next(error);
};

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};

const requestLogger = (request, response, next) => {
  infoLog('Method:', request.method);
  infoLog('Path:  ', request.path);
  infoLog('Body:  ', request.body);
  infoLog('---');
  next();
};
morgan.token('data',(req) => JSON.stringify(req.body));
const morganLog = morgan(':method :url :status :res[content-length] - :response-time ms :data');


export { unknownEndpoint, errorHandler, requestLogger, morganLog };