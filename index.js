/* eslint-disable no-undef */
import { app } from './app.js';
import { PORT } from './utils/config.js';
import { infoLog } from './utils/logger.js';

app.listen(PORT);
infoLog(`listening on ${PORT}`);