const GameController = require('../controller/GameController');

const  Router = require('koa-router');
const gameController = new GameController();

const router = new Router({prefix: '/game'})

router.post('/create',gameController.add)
router.get('/list',gameController.list)
router.get('/detail/:id',gameController.detail)

module.exports = router;
