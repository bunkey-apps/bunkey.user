import Cano from 'cano-koa';
import parser from 'koa-bodyparser';
import logger from 'koa-logger';
import passport from 'koa-passport';

const app = new Cano(__dirname);

// Set middleware to Cano app
app
    .use(async (ctx, next) => {
        try {
            console.log("me llamo primero");
            await next()
        } catch (e) {
            console.log(e);
        } finally {

        }

    })
    .use(logger())
    .use(parser())
    // .use(passport.initialize());

// Start the Cano app
//
process
    .on('SIGINT', () => {
        console.log("SIGINT aasdas");
        process.exit(0)
    })
    .on('SIGQUIT', () => {
        // console.log("aasdas");
        process.exit(0)
    })
    .on('SIGTERM', () => {
        // console.log("aasdas");
        process.exit(0)
    });
// app
//     .up()
//     .then(() => {})
//     .catch((err) => {
//         app.log.error('Error on ', err);
//     });

// Listen for errors
app.on('error', (err, ctx) => {
    // ctx.response.status = 400;
    // ctx.response.body = {'errors':"12"};
    // // app.log.info(ctx);
    app.log.error('server error', err);
});
module.exports = app.up();
