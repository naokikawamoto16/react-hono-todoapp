import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'

const app = new Hono()

app.use('/*', cors())

app.post('/tasks', async (c) => {
  const body = await c.req.json()
  const id = tasks.length + 1
  const task: Task = {
    id,
    name: body.name,
    completed: false
  }
  tasks.push(task)
  return c.json({ ...task }, 201)
})

app.get('/tasks/:id', (c) => {
  const id = Number(c.req.param('id'))
  const task = tasks.find(t => t.id === id)
  if (!task) {
    return c.json({ message: 'Task not found' }, 404)
  }
  return c.json(task)
})

app.get('/tasks', (c) => {
  return c.json(tasks)
})

app.patch('/tasks/:id', async (c) => {
  const id = Number(c.req.param('id'))
  const task = tasks.find(t => t.id === id)
  if (!task) {
    return c.json({ message: 'Task not found' }, 404)
  }
  let body: { name?: string; completed?: boolean }
  try {
    body = await c.req.json()
  } catch (error) {
    return c.json({ message: 'Invalid JSON' }, 400)
  }
  if (body.name !== undefined) task.name = body.name
  if (body.completed !== undefined) task.completed = body.completed
  return c.json({ message: 'success' }, 200)
})

app.delete('/tasks/:id', (c) => {
  const id = Number(c.req.param('id'))
  const index = tasks.findIndex(t => t.id === id)
  if (index === -1) {
    return c.json({ message: 'Task not found' }, 404)
  }
  tasks.splice(index, 1)
  return c.json({ message: 'success' }, 200)
});

const port = 3000
console.log(`Server is running on http://localhost:${port}`)

serve({
  fetch: app.fetch,
  port
})

interface Task {
  id: number
  name: string
  completed: boolean
}

const tasks: Task[] = [
  { id: 1, name: 'Task 1', completed: true },
  { id: 2, name: 'Task 2', completed: false }
]
