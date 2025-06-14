// backend/models/Audit.js
const mongoose = require('mongoose');

const AuditSchema = new mongoose.Schema({
  user:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  action:     { type: String, required: true },      // ex.: 'CREATE_USER', 'DELETE_QUESTION'
  resource:   { type: String, required: true },      // ex.: 'User', 'Category'
  resourceId: { type: String },                      // _id do recurso afetado
  timestamp:  { type: Date, default: Date.now },
  ip:         { type: String, required: true },
  details:    { type: mongoose.Schema.Types.Mixed }  // opcional, payload ou alterações
});

module.exports = mongoose.model('Audit', AuditSchema);
