import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { TaskCard, Task } from './TaskCard';
import { cn } from '@/lib/utils';

interface KanbanColumnProps {
  title: string;
  status: string;
  tasks: Task[];
  onDrop?: (e: React.DragEvent, status: string) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onAddTask?: (status: string) => void;
  onTaskClick?: (task: Task) => void;
  onTaskDragStart?: (e: React.DragEvent, task: Task) => void;
}

const columnStyles = {
  todo: 'border-t-4 border-t-muted-foreground',
  'in-progress': 'border-t-4 border-t-primary',
  done: 'border-t-4 border-t-warning', 
  completed: 'border-t-4 border-t-accent'
};

const statusCounts = {
  todo: 'bg-muted text-muted-foreground',
  'in-progress': 'bg-primary/10 text-primary',
  done: 'bg-warning/10 text-warning',
  completed: 'bg-accent/10 text-accent'
};

export function KanbanColumn({ 
  title, 
  status, 
  tasks, 
  onDrop, 
  onDragOver, 
  onAddTask,
  onTaskClick,
  onTaskDragStart 
}: KanbanColumnProps) {
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    onDrop?.(e, status);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    onDragOver?.(e);
  };

  return (
    <Card className={cn(
      "w-80 bg-gradient-card shadow-card hover:shadow-elevated transition-shadow",
      columnStyles[status as keyof typeof columnStyles]
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-base text-card-foreground">{title}</h3>
            <Badge className={statusCounts[status as keyof typeof statusCounts]}>
              {tasks.length}
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onAddTask?.(status)}
            className="h-8 w-8 hover:bg-primary/10"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent 
        className="min-h-[600px] space-y-3"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onDragStart={onTaskDragStart}
            onClick={onTaskClick}
          />
        ))}
        
        {tasks.length === 0 && (
          <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-2">
              <Plus className="w-6 h-6" />
            </div>
            <p className="text-sm">No tasks yet</p>
            <p className="text-xs">Drag a task here or click + to add one</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}