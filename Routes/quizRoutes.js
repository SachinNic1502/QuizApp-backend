const express = require('express');
const router = express.Router();
const Question = require('../Model/Question');

router.get('/questions', async (req, res) => {
    try {
        const questions = await Question.find();
        res.send(questions);
    } catch (error) {
        res.status(500).send(error);
    }
});
router.post('/questions', async (req, res) => {
    const { text, options, difficulty, tags } = req.body;

    if (!text || !options || options.length === 0 || !difficulty) {
        return res.status(400).send({ message: 'All fields are required' });
    }

    try {
        const newQuestion = new Question({
            text,
            options,
            difficulty,
            tags
        });

        await newQuestion.save();
        res.status(201).send(newQuestion);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.post('/quiz', async (req, res) => {
    // Initial quiz logic with CAT implementation will go here
});

module.exports = router;
