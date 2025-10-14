const { Task } = require('../models');

async function listTasks() {
  return Task.findAll({ order: [['created_at', 'DESC']] });
}

async function getTask(id) {
  const task = await Task.findByPk(id);
  if (!task) {
    const err = new Error('Tarea no encontrada');
    err.status = 404;
    throw err;
  }
  return task;
}

async function createTask(data) {
  return Task.create({ title: data.title, done: !!data.done });
}

async function updateTask(id, data) {
  const task = await getTask(id);
  await task.update({ title: data.title ?? task.title, done: data.done ?? task.done });
  return task;
}

async function deleteTask(id) {
  const task = await getTask(id);
  await task.destroy();
  return { deleted: true };
}

module.exports = { listTasks, getTask, createTask, updateTask, deleteTask };
