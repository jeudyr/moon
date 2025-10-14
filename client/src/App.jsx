import { useEffect, useState } from 'react'

export default function App() {
  const [tasks, setTasks] = useState([])
  const [title, setTitle] = useState('')

  useEffect(() => {
    fetch('/api/tasks')
      .then(r => r.json())
      .then(setTasks)
      .catch(() => setTasks([]))
  }, [])

  async function addTask(e) {
    e.preventDefault()
    const t = title.trim()
    if (!t) return
    const res = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: t })
    })
    const created = await res.json()
    setTasks(prev => [created, ...prev])
    setTitle('')
  }

  return (
    <div style={{ padding: 24, fontFamily: 'sans-serif' }}>
      <h1>Mis Tareas (MVC + Postgres)</h1>
      <form onSubmit={addTask} style={{ marginBottom: 16 }}>
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Nueva tarea..."
          style={{ padding: 8, marginRight: 8 }}
        />
        <button>Agregar</button>
      </form>
      <ul>
        {tasks.map(t => (
          <li key={t.id}>{t.title} {t.done ? '✅' : ''}</li>
        ))}
      </ul>
    </div>
  )
}
