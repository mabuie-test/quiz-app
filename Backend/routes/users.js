// backend/routes/users.js
const router = require('express').Router();
const bcrypt = require('bcryptjs');
const User   = require('../models/User');
const authMw = require('../middlewares/auth');

// Só admin pode aceder
function adminOnly(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ msg: 'Acesso negado. Apenas admin.' });
  }
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
  if (!name || !email || !password || !['admin','player'].includes(role)) {
    return res.status(400).json({ msg: 'Dados inválidos.' });
  }
  if (await User.findOne({ email })) {
    return res.status(400).json({ msg: 'Email já registado.' });
  }
  const hashed = await bcrypt.hash(password, 10);
  const user = new User({ name, email, password: hashed, role });
  await user.save();
  res.json({ _id: user._id, name: user.name, email: user.email, role: user.role });
});

// Atualizar utilizador
router.put('/:id', authMw, adminOnly, async (req, res) => {
  const updates = { ...req.body };
  if (updates.password) {
    updates.password = await bcrypt.hash(updates.password, 10);
  }
  await User.findByIdAndUpdate(req.params.id, updates);
  res.json({ msg: 'Utilizador atualizado.' });
});

// Eliminar utilizador
router.delete('/:id', authMw, adminOnly, async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ msg: 'Utilizador removido.' });
});

module.exports = router;
