const router = require('express').Router();
const auth = require('../middleware/authMiddleware');
const { getMatches, sendMatch } = require('../controllers/matchController');
router.get('/:customerId', auth, getMatches);
router.post('/:customerId', auth, sendMatch);
module.exports = router;
