const router   = require('express').Router();
const Category = require('../models/Category');

// Criar categoria
router.post('/', async (req, res) => {
  const cat = new Category(req.body);
  await cat.save();
  res.json(cat);
});

// Listar categorias
router.get('/', async (req, res) => {
  const cats = await Category.find();
  res.json(cats);
});

// Atualizar
router.put('/:id', async (req, res) => {
  await Category.findByIdAndUpdate(req.params.id, req.body);
  res.json({ msg: 'Categoria atualizada.' });
});

// Eliminar
router.delete('/:id', async (req, res) => {
  await Category.findByIdAndDelete(req.params.id);
  res.json({ msg: 'Categoria removida.' });
});

module.exports = router;
