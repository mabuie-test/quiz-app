// backend/middlewares/auth.js
const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  // 1. Extrair token do header Authorization: "Bearer <token>"
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ msg: 'Sem token, acesso negado.' });
  }

  try {
    // 2. Verificar e decodificar
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // 3. Anexar user e ip ao request
    req.user = {
      id: decoded.id,
      role: decoded.role,
      ip: req.ip
    };
    next();
  } catch (err) {
    return res.status(401).json({ msg: 'Token inválido.' });
  }
};
