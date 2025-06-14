// backend/routes/auth.js
const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');
const authMw = require('../middlewares/auth');
const User   = require('../models/User');

// Registo (primeiro user = admin; restantes = player)
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  // 1. Impedir emails duplicados
  if (await User.findOne({ email })) {
    return res.status(400).json({ msg: 'Email já registado.' });
  }

  // 2. Gerar hash
  const hashed = await bcrypt.hash(password, 10);

  // 3. Definir role
  const count = await User.countDocuments();
  const role  = count === 0 ? 'admin' : 'player';

  // 4. Criar e gravar
  const user = new User({ name, email, password: hashed, role });
  await user.save();

  // 5. Gerar e devolver token + user
  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '8h' }
  );
  res.json({ token, user: { name: user.name, email: user.email, role: user.role } });
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ msg: 'Credenciais inválidas.' });
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(400).json({ msg: 'Credenciais inválidas.' });

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '8h' }
  );
  res.json({ token, user: { name: user.name, email: user.email, role: user.role } });
});

// Perfil
router.get('/me', authMw, (req, res) => {
  res.json(req.user);
});

module.exports = router;
