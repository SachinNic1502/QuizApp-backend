const mongoose = require('mongoose');

const OptionSchema = new mongoose.Schema({
    text: { type: String, required: true },
    isCorrect: { type: Boolean, required: true }
});

const QuestionSchema = new mongoose.Schema({
    text: { type: String, required: true },
    options: [OptionSchema],
    difficulty: { type: Number, required: true },
    tags: [String]
});

module.exports = mongoose.model('Question', QuestionSchema);
