const Customer = require('../models/Customer');

exports.getStats = async (req, res) => {
  try {
    const [total, active, matched, pool, agg] = await Promise.all([
      Customer.countDocuments({ profileType: 'client' }),
      Customer.countDocuments({ profileType: 'client', status: 'active' }),
      Customer.countDocuments({ profileType: 'client', status: 'matched' }),
      Customer.countDocuments({ profileType: 'pool' }),
      Customer.aggregate([{ $group: { _id: null, total: { $sum: '$matchesSent' } } }]),
    ]);
    res.json({ total, active, matched, pool, totalMatchesSent: agg[0]?.total || 0 });
  } catch (err) { res.status(500).json({ error: err.message }); }
};
