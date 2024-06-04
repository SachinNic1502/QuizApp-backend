const mongoose = require('mongoose');

const ResultSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    score: { type: Number, required: true },
    completedAt: { type: Date, default: Date.now },
    suggestions: [String]
});

module.exports = mongoose.model('Result', ResultSchema);
