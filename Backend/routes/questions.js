const router     = require('express').Router();
const Question   = require('../models/Question');
const authMw     = require('../middlewares/auth');
const { logAudit } = require('../utils/audit');

// Apenas Admin pode gerir Questões
function adminOnly(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ msg: 'Acesso negado. Apenas admin.' });
  }
  next();
}

// Criar questão
router.post('/', authMw, adminOnly, async (req, res) => {
  const q = new Question(req.body);
  const saved = await q.save();
  await logAudit({
    userId:    req.user.id,
    action:    'CREATE_QUESTION',
    resource:  'Question',
    resourceId:saved._id.toString(),
    ip:        req.user.ip,
    details:   { text: saved.text, category: saved.category }
  });
  res.json(saved);
});

// Listar questões
router.get('/', async (req, res) => {
  const filter = {};
  if (req.query.category) filter.category = req.query.category;
  const qs = await Question.find(filter);
  res.json(qs);
});

// Atualizar questão
router.put('/:id', authMw, adminOnly, async (req, res) => {
  await Question.findByIdAndUpdate(req.params.id, req.body);
  await logAudit({
    userId:    req.user.id,
    action:    'UPDATE_QUESTION',
    resource:  'Question',
    resourceId:req.params.id,
    ip:        req.user.ip,
    details:   req.body
  });
  res.json({ msg: 'Questão atualizada.' });
});

// Eliminar questão
router.delete('/:id', authMw, adminOnly, async (req, res) => {
  await Question.findByIdAndDelete(req.params.id);
  await logAudit({
    userId:    req.user.id,
    action:    'DELETE_QUESTION',
    resource:  'Question',
    resourceId:req.params.id,
    ip:        req.user.ip
  });
  res.json({ msg: 'Questão removida.' });
});

module.exports = router;
