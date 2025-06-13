const router   = require('express').Router();
const Question = require('../models/Question');

// Criar questão
router.post('/', async (req, res) => {
  const q = new Question(req.body);
  await q.save();
  res.json(q);
});

// Listar questões (opcional filtro)
router.get('/', async (req, res) => {
  const filter = {};
  if (req.query.category) filter.category = req.query.category;
  const qs = await Question.find(filter);
  res.json(qs);
});

// Atualizar
router.put('/:id', async (req, res) => {
  await Question.findByIdAndUpdate(req.params.id, req.body);
  res.json({ msg: 'Questão atualizada.' });
});

// Eliminar
router.delete('/:id', async (req, res) => {
  await Question.findByIdAndDelete(req.params.id);
  res.json({ msg: 'Questão removida.' });
});

module.exports = router;
