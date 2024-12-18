import { serve } from '@hono/node-server'
import { Hono } from 'hono'

const app = new Hono()

// Get all tasks
app.get('/tasks', (c) => {
  return c.json(tasks)
})

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
  { id: 1, name: 'Task 1', completed: false },
  { id: 2, name: 'Task 2', completed: true }
]
