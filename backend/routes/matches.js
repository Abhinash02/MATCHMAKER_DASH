const router = require('express').Router();
const Customer = require('../models/Customer');
const auth = require('../middleware/auth');
const { scoreMatch } = require('../lib/matching');

// Get top matches for a customer
router.get('/:customerId', auth, async (req, res) => {
  try {
    const client = await Customer.findById(req.params.customerId).lean({ virtuals: true });
    if (!client) return res.status(404).json({ error: 'Customer not found' });

    const oppositeGender = client.gender === 'male' ? 'female' : 'male';
    const pool = await Customer.find({ profileType: 'pool', gender: oppositeGender, status: { $ne: 'inactive' } }).lean({ virtuals: true });

    const scored = pool
      .map(candidate => ({ ...candidate, ...scoreMatch(client, candidate) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);

    res.json(scored);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Record a sent match
router.post('/:customerId', auth, async (req, res) => {
  try {
    const { matchedProfileId, score, label, introEmail } = req.body;
    const matched = await Customer.findById(matchedProfileId).lean({ virtuals: true });
    if (!matched) return res.status(404).json({ error: 'Match profile not found' });

    const client = await Customer.findByIdAndUpdate(
      req.params.customerId,
      {
        $push: {
          sentMatches: {
            matchedProfileId,
            matchedName: `${matched.firstName} ${matched.lastName}`,
            score,
            label,
            introEmail,
            sentAt: new Date(),
          },
        },
        $inc: { matchesSent: 1 },
        status: 'matched',
      },
      { new: true }
    ).lean({ virtuals: true });

    res.json(client);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
