import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

export const Route = createFileRoute('/tasks')({
  component: TasksComponent,
})

function TasksComponent() {
  const [tasks, setTasks] = useState<{ id: number; name: string }[]>([]);

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
      <ul>
        {tasks && tasks.map((task: { id: number; name: string }) => (
          <li key={task.id}>{task.name}</li>
        ))}
      </ul>
    </div>
  )
}
