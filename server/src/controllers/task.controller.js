const service = require('../services/task.service');

async function index(_req, res, next) {
  try { res.json(await service.listTasks()); }
  catch (e) { next(e); }
}
async function show(req, res, next) {
  try { res.json(await service.getTask(req.params.id)); }
  catch (e) { next(e); }
}
async function store(req, res, next) {
  try {
    if (!req.body.title) {
      const err = new Error('El título es obligatorio');
      err.status = 400; throw err;
    }
    const created = await service.createTask(req.body);
    res.status(201).json(created);
  } catch (e) { next(e); }
}
async function update(req, res, next) {
  try { res.json(await service.updateTask(req.params.id, req.body)); }
  catch (e) { next(e); }
}
async function destroy(req, res, next) {
  try { res.json(await service.deleteTask(req.params.id)); }
  catch (e) { next(e); }
}

module.exports = { index, show, store, update, destroy };
