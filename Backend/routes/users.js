const router = require('express').Router();
const User   = require('../models/User');

// Listar utilizadores
router.get('/', async (req, res) => {
  const users = await User.find().select('-password');
  res.json(users);
});

// Atualizar utilizador
router.put('/:id', async (req, res) => {
  const updates = req.body;
  await User.findByIdAndUpdate(req.params.id, updates);
  res.json({ msg: 'Utilizador atualizado.' });
});

// Eliminar utilizador
router.delete('/:id', async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ msg: 'Utilizador removido.' });
});

module.exports = router;
