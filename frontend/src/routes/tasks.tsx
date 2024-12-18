import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

export const Route = createFileRoute('/tasks')({
  component: TasksComponent,
})

interface Task {
  id: number
  name: string
}

function TasksComponent() {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('http://localhost:3000/tasks');
        const result = await res.json();
        setTasks(result);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-2">
      <h3>Test</h3>
      <ul className='text-2xl'>
        {tasks && tasks.map((task: { id: number; name: string }) => (
          <li key={task.id}>{task.name}</li>
        ))}
      </ul>
    </div>
  )
}
