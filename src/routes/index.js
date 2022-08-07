let gameRouter = require('./gameRouter');

let combineRouters = require('koa-combine-routers');


module.exports = combineRouters(gameRouter)