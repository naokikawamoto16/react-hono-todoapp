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
  const [addInputValue, setAddInputValue] = useState('');
  const [editingTask, setEditingTask] = useState<{ id: number; name: string } | undefined>(undefined);

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

  useEffect(() => {
    console.log(tasks);
  }, [tasks]);

  const addTask = async () => {
    const name = addInputValue.trim();
    if (!name) return;
    try {
      const res = await fetch('http://localhost:3000/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: addInputValue.trim() }),
      });
      const addedTask = await res.json();
      console.log(addedTask);
      setTasks((prevTasks) => [...prevTasks, addedTask]);
    } catch (error) {
      console.error(error);
    }
    setAddInputValue("");
  };

  const updateTask = async (taskId: number, completed?: CheckedState, name?: string) => {
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

      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId
            ? { ...task, name: name ?? task.name, completed: currentCompleted ?? task.completed }
            : task
        )
      );
    } catch (error) {
      console.error(error);
    }
    setEditingTask(undefined);
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <div className="flex gap-2 mb-4">
        <Input
          value={addInputValue}
          onChange={(e) => setAddInputValue(e.target.value)}
          placeholder="Add a new todo"
        />
        <Button onClick={addTask}>Add</Button>
      </div>
      <div className="space-y-2">
        {tasks.map((task, index) => (
          <Card
            key={index}
            className={`p-4 flex justify-between items-center ${
              task.completed ? "opacity-50 line-through" : ""
            }`}
          >
            <div className="flex items-center gap-2">
              <Checkbox
                checked={task.completed}
                onCheckedChange={(checked: CheckedState) => updateTask(task.id, checked)}
              />
              <Dialog
                onOpenChange={(isOpen) => {
                  if (isOpen) {
                    setEditingTask({ id: task.id, name: task.name });
                  } else {
                    setEditingTask(undefined);
                  }
                }}
              >
                <DialogTrigger asChild>
                  <span className="cursor-pointer">{task.name}</span>
                </DialogTrigger>
                <DialogContent>
                  <DialogTitle>Edit Task Name</DialogTitle>
                    <Input
                      value={editingTask?.name}
                      onChange={(e) =>
                        setEditingTask((prev) =>
                          prev ? { ...prev, name: e.target.value } : undefined
                        )
                      }
                    />
                  <div className="mt-4 flex justify-end gap-2">
                    <Button
                      onClick={() => {
                        if (editingTask) {
                          updateTask(editingTask.id, undefined, editingTask.name);
                        }
                      }}
                    >
                      Save
                    </Button>
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
  );
}

