'use client'

import { createClient } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'

type Task = {
  id: string
  name: string
  created_at: string
}

function Page() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTaskName, setNewTaskName] = useState('')
  const [loading, setLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_KEY!
  )

  async function fetchTasks() {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        toast.error('Error fetching tasks')
      } else {
        setTasks(data)
      }
    } catch (error) {
      toast.error('An unexpected error occurred')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  async function addTask(e: React.FormEvent) {
    e.preventDefault()
    if (!newTaskName.trim()) return

    setIsSubmitting(true)
    try {
      const { error } = await supabase
        .from('tasks')
        .insert({
          name: newTaskName.trim()
          // user_id will be set automatically by the database default
        })

      if (error) {
        toast.error('Error adding task')
      } else {
        toast.success('Task added successfully')
        setNewTaskName('')
        fetchTasks()
      }
    } catch (error) {
      toast.error('An unexpected error occurred')
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  async function deleteTask(id: string) {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id)

      if (error) {
        toast.error('Error deleting task')
      } else {
        toast.success('Task deleted successfully')
        fetchTasks()
      }
    } catch (error) {
      toast.error('An unexpected error occurred')
      console.error(error)
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  return (
    <div className="container mx-auto max-w-2xl p-4">
      <h1 className="text-2xl font-bold mb-6">My Tasks</h1>

      <div className="mb-8">
        <form onSubmit={addTask} className="flex gap-2">
          <Input
            type="text"
            placeholder="Enter a new task"
            value={newTaskName}
            onChange={(e) => setNewTaskName(e.target.value)}
            disabled={isSubmitting}
          />
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Adding...' : 'Add Task'}
          </Button>
        </form>
      </div>

      {loading ? (
        <div className="text-center">Loading tasks...</div>
      ) : tasks.length === 0 ? (
        <div className="text-center text-gray-500">No tasks yet</div>
      ) : (
        <ul className="space-y-3">
          {tasks.map((task) => (
            <li
              key={task.id}
              className="flex items-center justify-between p-3 bg-white rounded-lg shadow">
              <span>{task.name}</span>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => deleteTask(task.id)}>
                Delete
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default Page