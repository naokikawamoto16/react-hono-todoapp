import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { CheckedState } from '@radix-ui/react-checkbox'

export const Route = createFileRoute('/tasks')({
  component: TasksComponent,
})

interface Task {
  id: number;
  name: string;
  completed: boolean;
}

function TasksComponent() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [addInputName, setAddInputName] = useState('');
  const [updateInputName, setUpdateInputName] = useState('');

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

  const addTask = async () => {
    if (!addInputName.trim()) return;
    try {
      const res = await fetch('http://localhost:3000/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: addInputName.trim() }),
      });
      const result = await res.json();
      setTasks((prevTasks) => [...prevTasks, result]);
    } catch (error) {
      console.error(error);
    }
    setAddInputName("");
  };

  const updateTask = async (taskId: number, completed?: CheckedState) => {
    let name: string | undefined = updateInputName.trim() || undefined;
    const currentCompleted = typeof completed === 'boolean' ? completed : undefined;

    try {
      const body: any = { id: taskId };

      if (name !== undefined) {
        body.name = name;
      }
      if (currentCompleted !== undefined) {
        body.completed = currentCompleted;
      }

      await fetch(`http://localhost:3000/tasks/${taskId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      setTasks((prevTasks) => prevTasks.map((task: Task) =>
        task.id === taskId ? { ...task, name: name ?? task.name, completed: currentCompleted ?? task.completed } : task
      ));
    } catch (error) {
      console.error(error);
    }
    setUpdateInputName("");
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <div className="flex gap-2 mb-4">
        <Input
          value={addInputName}
          onChange={(e) => setAddInputName(e.target.value)}
          placeholder="Add a new todo"
        />
        <Button onClick={addTask}>Add</Button>
      </div>
      <div className="space-y-2">
        {tasks.map((task) => (
          <Card
            key={task.id}
            className={`p-4 flex justify-between items-center ${
              task.completed ? "opacity-50 line-through" : ""
            }`}
          >
            <div className="flex items-center gap-2">
              <Checkbox
                checked={task.completed}
                onCheckedChange={(checked: CheckedState) => updateTask(task.id, checked)}
              />
              <Dialog>
                <DialogTrigger asChild>
                  <span className="cursor-pointer">{task.name}</span>
                </DialogTrigger>
                <DialogContent>
                  <DialogTitle>Edit Task Name</DialogTitle>
                  <Input
                    value={updateInputName}
                    onChange={(e) => setUpdateInputName(e.target.value)}
                  />
                  <div className="mt-4 flex justify-end gap-2">
                    <Button onClick={() => updateTask(task.id)}>Save</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <Button variant="ghost">
              Remove
            </Button>
          </Card>
        ))}
      </div>
    </div>
  )
}
