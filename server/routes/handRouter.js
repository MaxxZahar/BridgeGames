const Router = require('express');
const router = new Router();
const handController = require('../controllers/handController');

router.post('/', handController.create);
router.get('/', handController.getAll);
router.delete('/:id', handController.delete);


module.exports = router;