// backend/utils/audit.js
const Audit = require('../models/Audit');

async function logAudit({ userId, action, resource, resourceId, ip, details = {} }) {
  try {
    await Audit.create({ user: userId, action, resource, resourceId, ip, details });
  } catch (err) {
    console.error('Erro ao gravar auditoria:', err);
  }
}

module.exports = { logAudit };
