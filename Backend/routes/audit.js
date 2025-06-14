// backend/routes/audit.js
const router   = require('express').Router();
const authMw   = require('../middlewares/auth');
const Audit    = require('../models/Audit');

// Só admin pode listar logs
function adminOnly(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ msg: 'Acesso negado.' });
  }
  next();
}

router.get('/', authMw, adminOnly, async (req, res) => {
  const logs = await Audit.find()
    .populate('user', 'name email')
    .sort({ timestamp: -1 })
    .limit(100);
  res.json(logs);
});

module.exports = router;
