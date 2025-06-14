// backend/routes/auth.js
const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');
const User   = require('../models/User');

// Registo (temporariamente atribui sempre role = 'admin')
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  // 1. Verificar se já existe user com este email
  if (await User.findOne({ email })) {
    return res.status(400).json({ msg: 'Email já registado.' });
  }

  // 2. Hash da password
  const hashed = await bcrypt.hash(password, 10);

  // 3. Atribuir sempre role 'admin'
  const role = 'admin';

  // 4. Criar e guardar
  const user = new User({ name, email, password: hashed, role });
  await user.save();

  // 5. Gerar token JWT
  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '8h' }
  );

  // 6. Devolver token e dados do user (incluindo role)
  res.json({
    token,
    user: { name: user.name, email: user.email, role: user.role }
  });
});

// Login (mantém‑se igual)
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

// Perfil do user autenticado (mantém‑se igual)
router.get('/me', require('../middlewares/auth'), (req, res) => {
  res.json(req.user);
});

module.exports = router;
