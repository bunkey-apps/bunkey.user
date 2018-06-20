import Cano from 'cano-koa';

require('dotenv').config();
// Create a new instance of cano app
const app = new Cano(__dirname);

// Listen for some unknown error
app.on('error', (err) => {
    app.log.error('server error', err);
});

// Export a promise that will be resolved with the server object
module.exports = app.up();
