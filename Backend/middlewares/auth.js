// backend/middlewares/auth.js
const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  // Extrair token do header Authorization: "Bearer <token>"
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ msg: 'Sem token, acesso negado.' });
  }

  try {
    // Verificar e decodificar
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Obter o IP real (confia em X-Forwarded-For graças ao trust proxy)
    const ip = req.ip;

    // Anexar user e ip ao request
    req.user = {
      id:   decoded.id,
      role: decoded.role,
      ip    // agora será o IP completo
    };

    next();
  } catch (err) {
    return res.status(401).json({ msg: 'Token inválido.' });
  }
};
