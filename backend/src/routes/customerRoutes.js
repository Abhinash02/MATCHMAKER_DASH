const router = require('express').Router();
const auth = require('../middleware/authMiddleware');
const { list, getOne, create, update, remove } = require('../controllers/customerController');
router.get('/', auth, list);
router.get('/:id', auth, getOne);
router.post('/', auth, create);
router.patch('/:id', auth, update);
router.delete('/:id', auth, remove);
module.exports = router;
