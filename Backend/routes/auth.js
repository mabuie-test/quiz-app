const router   = require('express').Router();
const bcrypt   = require('bcryptjs');
const jwt      = require('jsonwebtoken');
const authMw   = require('../middlewares/auth');
const User     = require('../models/User');
const { logAudit } = require('../utils/audit');

// Registo (first-admin logic)
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (await User.findOne({ email })) {
    return res.status(400).json({ msg: 'Email já registado.' });
  }
  const hashed = await bcrypt.hash(password, 10);
  const count  = await User.countDocuments();
  const role   = count === 0 ? 'admin' : 'player';
  const user   = new User({ name, email, password: hashed, role });
  await user.save();
  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '8h' });

  // Auditoria de registo
  await logAudit({
    userId:    user._id.toString(),
    action:    'REGISTER',
    resource:  'User',
    resourceId:user._id.toString(),
    ip:        req.ip,
    details:   { name, email, role }
  });

  res.json({ token, user: { name: user.name, email: user.email, role: user.role } });
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ msg: 'Credenciais inválidas.' });
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(400).json({ msg: 'Credenciais inválidas.' });
  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '8h' });

  // Auditoria de login
  await logAudit({
    userId:    user._id.toString(),
    action:    'LOGIN',
    resource:  'User',
    resourceId:user._id.toString(),
    ip:        req.ip
  });

  res.json({ token, user: { name: user.name, email: user.email, role: user.role } });
});

// Perfil
router.get('/me', authMw, (req, res) => {
  res.json(req.user);
});

module.exports = router;
