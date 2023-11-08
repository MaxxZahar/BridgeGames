const Router = require('express');
const router = new Router();
const playerController = require('../controllers/playerController');
const checkRole = require('../middleware/checkRoleMiddleware');

router.post('/', playerController.create);

router.get('/', playerController.getAll);
router.get('/:id', playerController.getOne);

router.delete('/:id', checkRole('ADMIN'), playerController.delete);


module.exports = router;