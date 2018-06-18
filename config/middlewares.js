import parser from 'koa-bodyparser';
import logger from 'koa-logger';

// Exports an array of koa middleware to be loaded into the cano app
module.exports = [
    logger(),
    parser(),
];
