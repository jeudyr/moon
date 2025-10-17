const router = require('express').Router();
const { Op } = require('sequelize');

const {
  Categoria,
  Subcategoria,
  Producto,
  Carrito,
  DetalleCarrito,
} = require('../models');

/* Helpers */
const toInt = (v, d = 0) => {
  const n = parseInt(v, 10);
  return Number.isFinite(n) ? n : d;
};

/* ======= Catálogo ======= */

// GET /api/categorias
router.get('/categorias', async (req, res, next) => {
  try {
    const rows = await Categoria.findAll({ order: [['id_categoria', 'ASC']] });
    res.json(rows);
  } catch (e) { next(e); }
});

// GET /api/subcategorias
router.get('/subcategorias', async (req, res, next) => {
  try {
    const rows = await Subcategoria.findAll({
      order: [['id_subcategoria', 'ASC']],
      include: [{ model: Categoria, as: 'categoria' }],
    });
    res.json(rows);
  } catch (e) { next(e); }
});

// NUEVO: GET /api/categorias/:id/subcategorias
router.get('/categorias/:id/subcategorias', async (req, res, next) => {
  try {
    const id = toInt(req.params.id);
    const rows = await Subcategoria.findAll({
      where: { fk_categoria: id },
      order: [['id_subcategoria', 'ASC']],
    });
    res.json(rows);
  } catch (e) { next(e); }
});

// GET /api/productos?q=texto&limit=100
router.get('/productos', async (req, res, next) => {
  try {
    const q = (req.query.q || '').trim();
    const limit = Math.min(Math.max(toInt(req.query.limit, 100), 1), 500);
    const where = q ? { nombre: { [Op.iLike]: `%${q}%` } } : undefined;

    const rows = await Producto.findAll({
      where,
      order: [['id_producto', 'ASC']],
      limit,
    });
    res.json(rows);
  } catch (e) { next(e); }
});

// GET /api/productos/:id  (con subcategoria y categoria para “migas”)
router.get('/productos/:id', async (req, res, next) => {
  try {
    const id = toInt(req.params.id);
    const row = await Producto.findByPk(id, {
      include: [{
        model: Subcategoria,
        as: 'subcategoria',
        include: [{ model: Categoria, as: 'categoria' }],
      }],
    });
    if (!row) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(row);
  } catch (e) { next(e); }
});

// NUEVO: GET /api/categorias/:id/productos  (productos de una categoría)
router.get('/categorias/:id/productos', async (req, res, next) => {
  try {
    const idCat = toInt(req.params.id);
    const rows = await Producto.findAll({
      include: [{
        model: Subcategoria,
        as: 'subcategoria',
        where: { fk_categoria: idCat },
        required: true,
      }],
      order: [['id_producto', 'ASC']],
    });
    res.json(rows);
  } catch (e) { next(e); }
});

// NUEVO: GET /api/subcategorias/:id/productos  (productos de una subcategoría)
router.get('/subcategorias/:id/productos', async (req, res, next) => {
  try {
    const idSub = toInt(req.params.id);
    const rows = await Producto.findAll({
      where: { fk_subcategoria: idSub },
      order: [['id_producto', 'ASC']],
    });
    res.json(rows);
  } catch (e) { next(e); }
});

/* ======= Carrito ======= */

// GET /api/carrito?usuario=ID
router.get('/carrito', async (req, res, next) => {
  try {
    const usuarioId = toInt(req.query.usuario);
    if (!usuarioId) return res.status(400).json({ error: 'usuario requerido' });

    let cart = await Carrito.findOne({ where: { fk_usuario: usuarioId } });
    if (!cart) cart = await Carrito.create({ fk_usuario: usuarioId });

    const items = await DetalleCarrito.findAll({
      where: { fk_carrito: cart.id_carrito },
      include: [{ model: Producto, as: 'producto' }],
      order: [['id_detalle_carrito', 'ASC']],
    });

    const total = items.reduce(
      (s, it) => s + Number(it.producto?.precio || 0) * Number(it.cantidad || 0),
      0
    );

    res.json({
      id_carrito: cart.id_carrito,
      items: items.map(it => ({
        id_detalle: it.id_detalle_carrito,
        cantidad: it.cantidad,
        producto: it.producto,
        subtotal: Number(it.producto?.precio || 0) * Number(it.cantidad || 0),
      })),
      total,
    });
  } catch (e) { next(e); }
});

// POST /api/carrito/items  { usuario_id, producto_id, cantidad?=1 }
router.post('/carrito/items', async (req, res, next) => {
  try {
    const usuario_id = toInt(req.body.usuario_id);
    const producto_id = toInt(req.body.producto_id);
    const cantidad = Math.max(1, toInt(req.body.cantidad, 1));

    if (!usuario_id || !producto_id) {
      return res.status(400).json({ error: 'faltan datos' });
    }

    const [cart] = await Carrito.findOrCreate({
      where: { fk_usuario: usuario_id },
      defaults: { fk_usuario: usuario_id },
    });

    const [row, created] = await DetalleCarrito.findOrCreate({
      where: { fk_carrito: cart.id_carrito, fk_producto: producto_id },
      defaults: { fk_carrito: cart.id_carrito, fk_producto: producto_id, cantidad },
    });

    if (!created) {
      row.cantidad = Number(row.cantidad) + cantidad;
      await row.save();
    }

    res.status(created ? 201 : 200).json(row);
  } catch (e) { next(e); }
});

// PUT /api/carrito/items/:id  { cantidad }
router.put('/carrito/items/:id', async (req, res, next) => {
  try {
    const id = toInt(req.params.id);
    const cantidad = Math.max(1, toInt(req.body.cantidad, 1));

    const row = await DetalleCarrito.findByPk(id);
    if (!row) return res.status(404).json({ error: 'item no encontrado' });

    row.cantidad = cantidad;
    await row.save();

    res.json(row);
  } catch (e) { next(e); }
});

// DELETE /api/carrito/items/:id
router.delete('/carrito/items/:id', async (req, res, next) => {
  try {
    const id = toInt(req.params.id);
    await DetalleCarrito.destroy({ where: { id_detalle_carrito: id } });
    res.status(204).send();
  } catch (e) { next(e); }
});

// DELETE /api/carrito  { usuario_id }
router.delete('/carrito', async (req, res, next) => {
  try {
    const usuario_id = toInt(req.body.usuario_id);
    if (!usuario_id) return res.status(400).json({ error: 'usuario requerido' });

    const cart = await Carrito.findOne({ where: { fk_usuario: usuario_id } });
    if (!cart) return res.status(204).send();

    await DetalleCarrito.destroy({ where: { fk_carrito: cart.id_carrito } });
    res.status(204).send();
  } catch (e) { next(e); }
});

module.exports = router;
