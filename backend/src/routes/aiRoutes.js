const router = require('express').Router();
const auth = require('../middleware/authMiddleware');
const { generateBio, generateExpectations, generateIntro } = require('../controllers/aiController');
router.post('/generate-bio', auth, generateBio);
router.post('/generate-expectations', auth, generateExpectations);
router.post('/generate-intro', auth, generateIntro);
module.exports = router;
