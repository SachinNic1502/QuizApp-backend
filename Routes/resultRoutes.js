const express = require('express');
const router = express.Router();
const Result = require('../Model/Result');
const Question = require('../Model/Question'); // Assuming you have a Question model

router.post('/submit-quiz', async (req, res) => {
  try {
    const { userId, answers } = req.body;

    if (!userId ||!answers ||!Object.keys(answers).length) {
      return res.status(400).send({ message: 'Invalid request body. Please provide a valid userId and answers.' });
    }

    // Fetch questions from database
    const questions = await Question.find();

    // Assuming each question has a correctOption field
    const correctAnswers = questions.map(question => question.correctOption);

    let score = 0;
    for (let i = 0; i < correctAnswers.length; i++) {
      if (answers[i + 1] === correctAnswers[i]) {
        score++;
      }
    }

    let suggestions = [];

    if (score < 10) {
      suggestions.push('Review basic concepts.');
    } else if (score < 15) {
      suggestions.push('Practice more to improve.');
    } else {
      suggestions.push('Great job! Keep it up.');
    }

    const result = new Result({ userId, score, suggestions });
    await result.save();

    res.send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Internal Server Error', error });
  }
});

module.exports = router;