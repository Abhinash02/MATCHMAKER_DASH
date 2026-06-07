const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  content: { type: String, required: true },
  type: { type: String, enum: ['call', 'meeting', 'email', 'general'], default: 'general' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.models.Note || mongoose.model('Note', NoteSchema);
