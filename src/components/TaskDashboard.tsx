import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, BarChart3, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { KanbanColumn } from './KanbanColumn';
import { TaskForm } from './TaskForm';
import { Task } from './TaskCard';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from './ThemeToggle';

// Sample data
const sampleTasks: Task[] = [
  {
    id: '1',
    title: 'Design System Implementation',
    description: 'Create a comprehensive design system with reusable components and tokens for the application.',
    status: 'in-progress',
    priority: 'high',
    assignee: 'Sarah Chen',
    dueDate: '2025-01-15',
    tags: ['Design', 'Frontend', 'UI/UX']
  },
  {
    id: '2',
    title: 'User Authentication Flow',
    description: 'Implement secure login, registration, and password reset functionality.',
    status: 'todo',
    priority: 'urgent',
    assignee: 'Mike Johnson',
    dueDate: '2025-01-10',
    tags: ['Backend', 'Security', 'Auth']
  },
  {
    id: '3',
    title: 'Database Migration',
    description: 'Update database schema to support new user roles and permissions.',
    status: 'done',
    priority: 'medium',
    assignee: 'Alex Rodriguez',
    dueDate: '2025-01-08',
    tags: ['Database', 'Backend']
  },
  {
    id: '4',
    title: 'Mobile Responsive Design',
    description: 'Ensure all components work perfectly on mobile devices and tablets.',
    status: 'completed',
    priority: 'medium',
    assignee: 'Emma Davis',
    dueDate: '2025-01-05',
    tags: ['Frontend', 'Mobile', 'CSS']
  },
  {
    id: '5',
    title: 'API Documentation',
    description: 'Create comprehensive API documentation for all endpoints.',
    status: 'todo',
    priority: 'low',
    assignee: 'David Kim',
    dueDate: '2025-01-20',
    tags: ['Documentation', 'API']
  }
];

export function TaskDashboard() {
  const [tasks, setTasks] = useState<Task[]>(sampleTasks);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | undefined>();
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);

  const columns = [
    { id: 'todo', title: 'To Do', status: 'todo' },
    { id: 'in-progress', title: 'In Progress', status: 'in-progress' },
    { id: 'done', title: 'Done', status: 'done' },
    { id: 'completed', title: 'Completed', status: 'completed' }
  ];

  const getTasksByStatus = (status: string) => {
    return tasks.filter(task => task.status === status);
  };

  const handleTaskDragStart = (e: React.DragEvent, task: Task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDrop = (e: React.DragEvent, newStatus: string) => {
    e.preventDefault();
    if (draggedTask && draggedTask.status !== newStatus) {
      setTasks(prev =>
        prev.map(task =>
          task.id === draggedTask.id
            ? { ...task, status: newStatus as Task['status'] }
            : task
        )
      );
    }
    setDraggedTask(null);
  };

  const handleAddTask = (status?: string) => {
    setSelectedTask(undefined);
    setIsFormOpen(true);
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsFormOpen(true);
  };

  const handleFormSubmit = (taskData: Omit<Task, 'id'>) => {
    if (selectedTask) {
      // Update existing task
      setTasks(prev =>
        prev.map(task =>
          task.id === selectedTask.id
            ? { ...task, ...taskData }
            : task
        )
      );
    } else {
      // Create new task
      const newTask: Task = {
        ...taskData,
        id: Date.now().toString()
      };
      setTasks(prev => [...prev, newTask]);
    }
  };

  // Statistics
  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'completed').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    overdue: tasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'completed').length
  };

  return (
    <div className="min-h-screen bg-background p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Task Dashboard
            </h1>
            <p className="text-muted-foreground mt-2">
              Manage your projects with drag-and-drop simplicity
            </p>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button onClick={() => handleAddTask()} size="lg" className="shadow-elevated">
              <Plus className="w-5 h-5 mr-2" />
              New Task
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-card shadow-card hover:shadow-elevated transition-all">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-primary" />
                Total Tasks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-card-foreground">{stats.total}</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card shadow-card hover:shadow-elevated transition-all">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-accent" />
                Completed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-card-foreground">{stats.completed}</div>
              <Badge variant="outline" className="mt-1 bg-accent/10 text-accent border-accent/20">
                {stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}% done
              </Badge>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card shadow-card hover:shadow-elevated transition-all">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                In Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-card-foreground">{stats.inProgress}</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card shadow-card hover:shadow-elevated transition-all">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-destructive" />
                Overdue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-card-foreground">{stats.overdue}</div>
              {stats.overdue > 0 && (
                <Badge variant="outline" className="mt-1 bg-destructive/10 text-destructive border-destructive/20">
                  Needs attention
                </Badge>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex gap-6 overflow-x-auto pb-6">
        {columns.map((column) => (
          <KanbanColumn
            key={column.id}
            title={column.title}
            status={column.status}
            tasks={getTasksByStatus(column.status)}
            onDrop={handleDrop}
            onAddTask={handleAddTask}
            onTaskClick={handleTaskClick}
            onTaskDragStart={handleTaskDragStart}
          />
        ))}
      </div>

      {/* Task Form Modal */}
      <TaskForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedTask(undefined);
        }}
        onSubmit={handleFormSubmit}
        task={selectedTask}
      />
    </div>
  );
}