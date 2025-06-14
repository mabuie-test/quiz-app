const router     = require('express').Router();
const Category   = require('../models/Category');
const authMw     = require('../middlewares/auth');
const { logAudit } = require('../utils/audit');

// Apenas Admin
function adminOnly(req, res, next) {
  if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Acesso negado.' });
  next();
}

// Criar categoria
router.post('/', authMw, adminOnly, async (req, res) => {
  const cat = new Category(req.body);
  const saved = await cat.save();
  await logAudit({
    userId:    req.user.id,
    action:    'CREATE_CATEGORY',
    resource:  'Category',
    resourceId:saved._id.toString(),
    ip:        req.user.ip,
    details:   req.body
  });
  res.json(saved);
});

// Listar categorias
router.get('/', async (req, res) => {
  const cats = await Category.find();
  res.json(cats);
});

// Atualizar
router.put('/:id', authMw, adminOnly, async (req, res) => {
  await Category.findByIdAndUpdate(req.params.id, req.body);
  await logAudit({
    userId:    req.user.id,
    action:    'UPDATE_CATEGORY',
    resource:  'Category',
    resourceId:req.params.id,
    ip:        req.user.ip,
    details:   req.body
  });
  res.json({ msg: 'Categoria atualizada.' });
});

// Eliminar
router.delete('/:id', authMw, adminOnly, async (req, res) => {
  await Category.findByIdAndDelete(req.params.id);
  await logAudit({
    userId:    req.user.id,
    action:    'DELETE_CATEGORY',
    resource:  'Category',
    resourceId:req.params.id,
    ip:        req.user.ip
  });
  res.json({ msg: 'Categoria removida.' });
});

module.exports = router;
