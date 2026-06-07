const Note = require('../models/Note');

exports.list = async (req, res) => {
  try {
    const notes = await Note.find({ customerId: req.params.customerId }).sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.create = async (req, res) => {
  try {
    const { customerId, content, type } = req.body;
    const note = await Note.create({ customerId, content, type, createdBy: req.user.id });
    res.status(201).json(note);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.update = async (req, res) => {
  try {
    const note = await Note.findByIdAndUpdate(req.params.id, { content: req.body.content, type: req.body.type }, { new: true });
    if (!note) return res.status(404).json({ error: 'Not found' });
    res.json(note);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.remove = async (req, res) => {
  try {
    await Note.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
};
