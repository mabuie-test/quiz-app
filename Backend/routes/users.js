const router       = require('express').Router();
const bcrypt       = require('bcryptjs');
const User         = require('../models/User');
const authMw       = require('../middlewares/auth');
const { logAudit } = require('../utils/audit');

// Só admin
function adminOnly(req, res, next) {
  if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Acesso negado.' });
  next();
}

// Listar utilizadores
router.get('/', authMw, adminOnly, async (req, res) => {
  const users = await User.find().select('-password');
  res.json(users);
});

// Criar novo utilizador
router.post('/', authMw, adminOnly, async (req, res) => {
  const { name, email, password, role } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  const user = new User({ name, email, password: hashed, role });
  const saved = await user.save();
  await logAudit({
    userId:    req.user.id,
    action:    'CREATE_USER',
    resource:  'User',
    resourceId:saved._id.toString(),
    ip:        req.user.ip,
    details:   { name, email, role }
  });
  res.json({ _id: saved._id, name: saved.name, email: saved.email, role: saved.role });
});

// Atualizar utilizador
router.put('/:id', authMw, adminOnly, async (req, res) => {
  const updates = { ...req.body };
  if (updates.password) {
    updates.password = await bcrypt.hash(updates.password, 10);
  }
  await User.findByIdAndUpdate(req.params.id, updates);
  await logAudit({
    userId:    req.user.id,
    action:    'UPDATE_USER',
    resource:  'User',
    resourceId:req.params.id,
    ip:        req.user.ip,
    details:   updates
  });
  res.json({ msg: 'Utilizador atualizado.' });
});

// Eliminar utilizador
router.delete('/:id', authMw, adminOnly, async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  await logAudit({
    userId:    req.user.id,
    action:    'DELETE_USER',
    resource:  'User',
    resourceId:req.params.id,
    ip:        req.user.ip
  });
  res.json({ msg: 'Utilizador removido.' });
});

module.exports = router;
