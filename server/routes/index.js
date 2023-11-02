const Router = require('express');
const router = new Router();
const userRouter = require('./userRouter');
const playerRouter = require('./playerRouter');
const tournamentRouter = require('./tournamentRouter');
const gameRouter = require('./gameRouter');
const handRouter = require('./handRouter');

router.use('/user', userRouter);
router.use('/player', playerRouter);
router.use('/tournament', tournamentRouter);
router.use('/game', gameRouter);
router.use('/hand', handRouter);


module.exports = router;