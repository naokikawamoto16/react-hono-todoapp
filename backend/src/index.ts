import { serve } from '@hono/node-server'
import { Hono } from 'hono'

interface Task {
  id: number
  name: string
  completed: boolean
}

const tasks: Task[] = [
  { id: 1, name: 'Task 1', completed: true },
  { id: 2, name: 'Task 2', completed: false }
]

const app = new Hono()

// Get a task by id
app.get('/tasks/:id', (c) => {
  const id = Number(c.req.param('id'))
  const task = tasks.find(t => t.id === id)
  if (!task) {
    return c.json({ message: 'Task not found' }, 404)
  }
  return c.json(task)
})

// Get all tasks
app.get('/tasks', (c) => {
  return c.json(tasks)
})

// Create a new task
app.post('/tasks', async (c) => {
  const body = await c.req.json()
  const id = tasks.length + 1
  const task = {
    id,
    name: body.name,
    completed: false
  }
  tasks.push(task)
  return c.json({ message: 'success' }, 201)
})

// Update a task by id
app.patch('/tasks/:id', async (c) => {
  const id = Number(c.req.param('id'))
  const task = tasks.find(t => t.id === id)
  if (!task) {
    return c.json({ message: 'Task not found' }, 404)
  }
  const body = await c.req.json()
  task.name = body.name
  task.completed = body.completed
  return c.json({ message: 'success' }, 200)
})

const port = 3000
console.log(`Server is running on http://localhost:${port}`)

serve({
  fetch: app.fetch,
  port
})
