import cors from '@koa/cors';
import parser from 'koa-bodyparser';
import logger from 'koa-logger';
import error from './error';
import corsOpts from './cors';

// Exports an array of koa middleware to be loaded into the cano app
module.exports = [
    logger(),
    error(),
    cors(corsOpts),
    parser(),
];
