import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Calendar, Flag, User } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'done' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignee?: string;
  dueDate?: string;
  tags?: string[];
}

interface TaskCardProps {
  task: Task;
  onDragStart?: (e: React.DragEvent, task: Task) => void;
  onClick?: (task: Task) => void;
}

const priorityColors = {
  low: 'bg-muted text-muted-foreground',
  medium: 'bg-warning/10 text-warning border-warning/20',
  high: 'bg-destructive/10 text-destructive border-destructive/20',
  urgent: 'bg-destructive text-destructive-foreground'
};

const priorityIcons = {
  low: <Flag className="w-3 h-3" />,
  medium: <Flag className="w-3 h-3" />,
  high: <Flag className="w-3 h-3" />,
  urgent: <Flag className="w-3 h-3 fill-current" />
};

export function TaskCard({ task, onDragStart, onClick }: TaskCardProps) {
  return (
    <Card
      draggable
      onDragStart={(e) => onDragStart?.(e, task)}
      onClick={() => onClick?.(task)}
      className={cn(
        "cursor-grab active:cursor-grabbing transition-all duration-200",
        "hover:shadow-elevated hover:-translate-y-1 bg-gradient-card",
        "border-l-4",
        task.priority === 'urgent' && "border-l-destructive",
        task.priority === 'high' && "border-l-destructive/60",
        task.priority === 'medium' && "border-l-warning",
        task.priority === 'low' && "border-l-muted-foreground"
      )}
    >
      <CardContent className="p-4 space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-medium text-sm leading-tight text-card-foreground">
            {task.title}
          </h3>
          <Badge variant="outline" className={priorityColors[task.priority]}>
            {priorityIcons[task.priority]}
            <span className="ml-1 text-xs">{task.priority}</span>
          </Badge>
        </div>

        {/* Description */}
        {task.description && (
          <p className="text-xs text-muted-foreground line-clamp-2">
            {task.description}
          </p>
        )}

        {/* Tags */}
        {task.tags && task.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {task.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs px-2 py-0.5">
                {tag}
              </Badge>
            ))}
            {task.tags.length > 3 && (
              <Badge variant="secondary" className="text-xs px-2 py-0.5">
                +{task.tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-2">
          {/* Due Date */}
          {task.dueDate && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="w-3 h-3" />
              {new Date(task.dueDate).toLocaleDateString()}
            </div>
          )}

          {/* Assignee */}
          <div className="flex items-center gap-1">
            {task.assignee ? (
              <Avatar className="w-6 h-6">
                <AvatarFallback className="text-xs bg-primary/10 text-primary">
                  {task.assignee.split(' ').map(n => n[0]).join('').toUpperCase()}
                </AvatarFallback>
              </Avatar>
            ) : (
              <div className="w-6 h-6 rounded-full border border-dashed border-muted-foreground/30 flex items-center justify-center">
                <User className="w-3 h-3 text-muted-foreground/50" />
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}