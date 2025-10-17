const router = require('express').Router();
const { Categoria, Subcategoria, Producto } = require('../models');

// GET /api/categorias
router.get('/categorias', async (_req, res, next) => {
  try {
    const cats = await Categoria.findAll({
      include: {
        model: Subcategoria,
        as: 'subcategorias',
        include: { model: Producto, as: 'productos', attributes: ['id_producto'] }
      },
      order: [['nombre', 'ASC']]
    });

    const data = cats.map(c => ({
      id: c.id_categoria,                 // <- importante
      nombre: c.nombre,
      total: c.subcategorias?.reduce((acc, s) => acc + (s.productos?.length || 0), 0) || 0
    }));

    res.json(data);
  } catch (e) { next(e); }
});

// GET /api/categorias/:id/productos
router.get('/categorias/:id/productos', async (req, res, next) => {
  try {
    const { id } = req.params;                   // id_categoria
    const productos = await Producto.findAll({
      attributes: ['id_producto','nombre','precio','url','marca'],
      include: [{
        model: Subcategoria,
        as: 'subcategoria',
        attributes: [],                           // no necesitamos campos de subcat en la respuesta
        where: { fk_categoria: id },              // <-- clave: filtra por la categoría
        required: true                            // <-- fuerza INNER JOIN
      }],
      order: [['nombre', 'ASC']]
    });
    res.json(productos);
  } catch (e) { next(e); }
});
router.get('/categorias/:id/subcategorias', async (req, res, next) => {
  try {
    const { id } = req.params; // id_categoria
    const subs = await Subcategoria.findAll({
      where: { fk_categoria: id },
      order: [['nombre', 'ASC']]
    });
    res.json(subs.map(s => ({ id: s.id_subcategoria, nombre: s.nombre })));
  } catch (e) { next(e); }
});

// Productos por subcategoría
router.get('/subcategorias/:id/productos', async (req, res, next) => {
  try {
    const { id } = req.params; // id_subcategoria
    const productos = await Producto.findAll({
      where: { fk_subcategoria: id },
      order: [['nombre', 'ASC']]
    });
    res.json(productos);
  } catch (e) { next(e); }
});

// Detalle de un producto por ID
router.get('/productos/:id', async (req, res, next) => {
  try {
    const { Producto, Subcategoria, Categoria } = require('../models');
    const { id } = req.params;

    const prod = await Producto.findByPk(id, {
      attributes: ['id_producto','nombre','descripcion','precio','url','color','marca','fk_subcategoria'],
      include: [{
        model: Subcategoria,
        as: 'subcategoria',
        attributes: ['id_subcategoria','nombre','fk_categoria'],
        include: [{ model: Categoria, as: 'categoria', attributes: ['id_categoria','nombre'] }]
      }]
    });

    if (!prod) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(prod);
  } catch (e) { next(e); }
});


module.exports = router;


