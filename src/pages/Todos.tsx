
import React, { useState } from 'react';
import { 
  Plus, 
  CheckSquare,
  Square,
  Calendar,
  Tag,
  Clock,
  MoreVertical,
  Trash2,
  Edit,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from '@/components/ui/separator';
import { Todo } from '@/types';
import { useData } from '@/context/DataContext';
import { format, isPast, isToday, isTomorrow } from 'date-fns';
import { cn } from '@/lib/utils';

const priorityColors = {
  low: "bg-habit-green/10 text-habit-green border-habit-green/20",
  medium: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  high: "bg-habit-red/10 text-habit-red border-habit-red/20"
};

const TodoItem = ({ todo }: { todo: Todo }) => {
  const { toggleTodo, updateTodo, deleteTodo } = useData();
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);
  const [editedDesc, setEditedDesc] = useState(todo.description || '');

  const handleToggle = () => {
    toggleTodo(todo.id);
  };

  const handleSaveEdit = () => {
    updateTodo(todo.id, {
      title: editedTitle,
      description: editedDesc
    });
    setIsEditing(false);
  };

  const handleDelete = () => {
    deleteTodo(todo.id);
  };

  const getDueStatusText = () => {
    if (!todo.dueDate) return null;
    
    if (isToday(new Date(todo.dueDate))) {
      return <span className="text-blue-500 font-medium">Today</span>;
    } else if (isTomorrow(new Date(todo.dueDate))) {
      return <span className="text-purple-500 font-medium">Tomorrow</span>;
    } else if (isPast(new Date(todo.dueDate)) && !todo.completed) {
      return <span className="text-destructive font-medium">Overdue</span>;
    } else {
      return format(new Date(todo.dueDate), 'MMM d, yyyy');
    }
  };

  return (
    <div className={cn(
      "p-4 border rounded-md mb-4 group",
      todo.completed ? "bg-muted/50" : "bg-card hover:border-brand-purple",
      isPast(new Date(todo.dueDate || '')) && !todo.completed ? "border-destructive/30" : ""
    )}>
      <div className="flex items-start gap-3">
        <Button 
          variant="ghost" 
          size="icon" 
          className="mt-0.5 text-muted-foreground" 
          onClick={handleToggle}
        >
          {todo.completed ? (
            <CheckSquare className="h-5 w-5 text-brand-purple" />
          ) : (
            <Square className="h-5 w-5" />
          )}
        </Button>
        
        <div className="flex-1">
          {isEditing ? (
            <div className="space-y-2 mb-3">
              <Input
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                className="font-medium"
              />
              <Input
                value={editedDesc}
                onChange={(e) => setEditedDesc(e.target.value)}
                placeholder="Add description (optional)"
              />
            </div>
          ) : (
            <>
              <p className={cn(
                "font-medium",
                todo.completed && "line-through text-muted-foreground"
              )}>
                {todo.title}
              </p>
              {todo.description && (
                <p className={cn(
                  "text-sm text-muted-foreground mt-1",
                  todo.completed && "line-through"
                )}>
                  {todo.description}
                </p>
              )}
            </>
          )}
          
          <div className="flex flex-wrap gap-2 mt-2">
            <Badge variant="outline" className={cn(priorityColors[todo.priority])}>
              {todo.priority}
            </Badge>
            
            {todo.dueDate && (
              <Badge variant="outline" className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {getDueStatusText()}
              </Badge>
            )}
            
            {todo.tags && todo.tags.map(tag => (
              <Badge key={tag} variant="outline" className="flex items-center gap-1">
                <Tag className="h-3 w-3" />
                {tag}
              </Badge>
            ))}
          </div>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="opacity-0 group-hover:opacity-100 focus:opacity-100"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {isEditing ? (
              <>
                <DropdownMenuItem onClick={handleSaveEdit}>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Save Changes
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setIsEditing(false)}>
                  Cancel
                </DropdownMenuItem>
              </>
            ) : (
              <>
                <DropdownMenuItem onClick={() => setIsEditing(true)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleToggle}>
                  {todo.completed ? (
                    <>
                      <Square className="h-4 w-4 mr-2" />
                      Mark as Incomplete
                    </>
                  ) : (
                    <>
                      <CheckSquare className="h-4 w-4 mr-2" />
                      Mark as Complete
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={handleDelete} 
                  className="text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

const AddTodoForm = ({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) => {
  const { addTodo } = useData();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      addTodo({
        title,
        description: description.trim() || undefined,
        priority,
        dueDate: dueDate || undefined
      });
      
      // Reset form
      setTitle('');
      setDescription('');
      setPriority('medium');
      setDueDate('');
      
      // Close dialog
      onOpenChange(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Todo Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter todo title"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Description (optional)</Label>
          <Input
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter a description"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="priority">Priority</Label>
            <Select
              value={priority}
              onValueChange={(value) => setPriority(value as 'low' | 'medium' | 'high')}
            >
              <SelectTrigger id="priority">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="dueDate">Due Date (optional)</Label>
            <Input
              id="dueDate"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
        </div>
      </div>
      
      <DialogFooter className="mt-6">
        <Button type="submit">Add Todo</Button>
      </DialogFooter>
    </form>
  );
};

const Todos = () => {
  const { todos } = useData();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  const filteredTodos = todos.filter(todo => {
    if (filter === 'all') return true;
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const incompleteTodos = todos.filter(todo => !todo.completed);
  const hasOverdueTodos = incompleteTodos.some(
    todo => todo.dueDate && isPast(new Date(todo.dueDate)) && !isToday(new Date(todo.dueDate))
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Todo List</h1>
          <p className="text-muted-foreground">
            Manage your tasks and stay organized
          </p>
        </div>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Todo
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add a new todo</DialogTitle>
              <DialogDescription>
                Create a new task to keep track of your work.
              </DialogDescription>
            </DialogHeader>
            <AddTodoForm open={dialogOpen} onOpenChange={setDialogOpen} />
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="flex justify-between items-center">
        <div className="space-x-2">
          <Button 
            variant={filter === 'all' ? "default" : "outline"} 
            size="sm"
            onClick={() => setFilter('all')}
          >
            All
          </Button>
          <Button 
            variant={filter === 'active' ? "default" : "outline"} 
            size="sm"
            onClick={() => setFilter('active')}
          >
            Active
          </Button>
          <Button 
            variant={filter === 'completed' ? "default" : "outline"} 
            size="sm"
            onClick={() => setFilter('completed')}
          >
            Completed
          </Button>
        </div>
        
        <p className="text-sm text-muted-foreground">
          {incompleteTodos.length} {incompleteTodos.length === 1 ? 'task' : 'tasks'} remaining
        </p>
      </div>
      
      {hasOverdueTodos && (
        <div className="flex items-center gap-2 p-3 border border-destructive/30 bg-destructive/5 rounded-md">
          <AlertCircle className="h-5 w-5 text-destructive" />
          <p className="text-sm">You have overdue tasks. Consider updating their due dates.</p>
        </div>
      )}
      
      <div>
        {filteredTodos.length === 0 ? (
          <Card className="p-8 text-center">
            <CardContent>
              <p className="text-muted-foreground mb-4">
                {filter === 'all' 
                  ? "You don't have any todos yet. Add your first todo to get started."
                  : filter === 'active'
                    ? "You don't have any active todos. All caught up!"
                    : "You don't have any completed todos yet."
                }
              </p>
              {filter === 'all' && (
                <Button onClick={() => setDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Todo
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div>
            {filteredTodos.map((todo) => (
              <TodoItem key={todo.id} todo={todo} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Todos;
