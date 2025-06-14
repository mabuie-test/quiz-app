const router     = require('express').Router();
const mongoose   = require('mongoose');
const Question   = require('../models/Question');
const authMw     = require('../middlewares/auth');
const { logAudit } = require('../utils/audit');

// Iniciar quiz
router.post('/start', authMw, async (req, res) => {
  const { categoryId, numQuestions = 10 } = req.body;
  const questions = await Question.aggregate([
    { $match: { category: mongoose.Types.ObjectId(categoryId) }},
    { $sample: { size: numQuestions }}
  ]);
  await logAudit({
    userId:    req.user.id,
    action:    'START_QUIZ',
    resource:  'Quiz',
    resourceId: categoryId,
    ip:        req.user.ip,
    details:   { numQuestions }
  });
  const payload = questions.map(q => ({
    _id: q._id,
    text: q.text,
    options: q.options.map(o => o.text)
  }));
  res.json(payload);
});

// Responder questão
router.post('/answer', authMw, async (req, res) => {
  const { questionId, selectedOptionIndex } = req.body;
  const q = await Question.findById(questionId);
  const correct = q.options[selectedOptionIndex]?.isCorrect || false;
  await logAudit({
    userId:    req.user.id,
    action:    correct ? 'ANSWER_CORRECT' : 'ANSWER_INCORRECT',
    resource:  'Quiz',
    resourceId: questionId,
    ip:        req.user.ip,
    details:   { selectedOptionIndex }
  });
  res.json({ correct, explanation: q.explanation });
});

module.exports = router;
