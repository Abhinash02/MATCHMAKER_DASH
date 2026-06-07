const router = require('express').Router();
const Customer = require('../models/Customer');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    const [total, active, matched, pool] = await Promise.all([
      Customer.countDocuments({ profileType: 'client' }),
      Customer.countDocuments({ profileType: 'client', status: 'active' }),
      Customer.countDocuments({ profileType: 'client', status: 'matched' }),
      Customer.countDocuments({ profileType: 'pool' }),
    ]);
    const matchesSentAgg = await Customer.aggregate([{ $group: { _id: null, total: { $sum: '$matchesSent' } } }]);
    const totalMatchesSent = matchesSentAgg[0]?.total || 0;
    res.json({ total, active, matched, pool, totalMatchesSent });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
