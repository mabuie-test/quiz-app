const router   = require('express').Router();
const mongoose = require('mongoose');
const Question = require('../models/Question');

// Iniciar quiz
router.post('/start', async (req, res) => {
  const { categoryId, numQuestions = 10 } = req.body;
  const questions = await Question.aggregate([
    { $match: { category: mongoose.Types.ObjectId(categoryId) }},
    { $sample: { size: numQuestions }}
  ]);
  const payload = questions.map(q => ({
    _id: q._id,
    text: q.text,
    options: q.options.map(o => o.text)
  }));
  res.json(payload);
});

// Responder questão
router.post('/answer', async (req, res) => {
  const { questionId, selectedOptionIndex } = req.body;
  const q = await Question.findById(questionId);
  const correct = q.options[selectedOptionIndex]?.isCorrect || false;
  res.json({ correct, explanation: q.explanation });
});

module.exports = router;
