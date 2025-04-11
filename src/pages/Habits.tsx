
import React, { useState } from 'react';
import { 
  Plus, 
  MoreVertical, 
  CheckCircle2, 
  Clock, 
  Flame, 
  Trash2,
  Edit
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
import { useData } from '@/context/DataContext';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Habit } from '@/types';
import { differenceInDays, format, isToday } from 'date-fns';

const HabitItem = ({ habit }: { habit: Habit }) => {
  const { completeHabit, updateHabit, deleteHabit } = useData();
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(habit.name);
  const [editedDesc, setEditedDesc] = useState(habit.description || '');

  const today = new Date().toISOString().split('T')[0];
  const isCompletedToday = habit.completedDates.includes(today);

  const handleComplete = () => {
    completeHabit(habit.id);
  };

  const handleSaveEdit = () => {
    updateHabit(habit.id, {
      name: editedName,
      description: editedDesc
    });
    setIsEditing(false);
  };

  const handleDelete = () => {
    deleteHabit(habit.id);
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          {isEditing ? (
            <Input
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              className="font-semibold"
            />
          ) : (
            <CardTitle>{habit.name}</CardTitle>
          )}
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {isEditing ? (
                <>
                  <DropdownMenuItem onClick={handleSaveEdit}>
                    Save Changes
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setIsEditing(false)}>
                    Cancel
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem onClick={() => setIsEditing(true)}>
                    <Edit className="h-4 w-4 mr-2" />Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleDelete} className="text-destructive">
                    <Trash2 className="h-4 w-4 mr-2" />Delete
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        {isEditing ? (
          <Input
            value={editedDesc}
            onChange={(e) => setEditedDesc(e.target.value)}
            className="text-muted-foreground text-sm mt-2"
            placeholder="Add a description"
          />
        ) : (
          habit.description && (
            <CardDescription>{habit.description}</CardDescription>
          )
        )}
      </CardHeader>
      
      <CardContent>
        <div className="flex items-center gap-4 mt-2">
          <div className="flex items-center gap-1">
            <Flame className="h-4 w-4 text-orange-500" />
            <span className="text-sm font-semibold">{habit.streak}</span>
          </div>
          
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {habit.frequency}
            </span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-2">
        <Button 
          variant={isCompletedToday ? "default" : "outline"} 
          className={`w-full ${isCompletedToday ? "bg-brand-purple hover:bg-brand-purple-dark" : ""}`}
          onClick={handleComplete}
        >
          <CheckCircle2 className="h-4 w-4 mr-2" />
          {isCompletedToday ? "Completed" : "Mark as Complete"}
        </Button>
      </CardFooter>
    </Card>
  );
};

const AddHabitForm = ({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) => {
  const { addHabit } = useData();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [frequency, setFrequency] = useState<'daily' | 'weekly'>('daily');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      addHabit({
        name,
        description: description.trim() || undefined,
        frequency
      });
      
      // Reset form
      setName('');
      setDescription('');
      setFrequency('daily');
      
      // Close dialog
      onOpenChange(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Habit Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter habit name"
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
        
        <div className="space-y-2">
          <Label htmlFor="frequency">Frequency</Label>
          <Select
            value={frequency}
            onValueChange={(value) => setFrequency(value as 'daily' | 'weekly')}
          >
            <SelectTrigger id="frequency">
              <SelectValue placeholder="Select frequency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <DialogFooter className="mt-6">
        <Button type="submit">Add Habit</Button>
      </DialogFooter>
    </form>
  );
};

const Habits = () => {
  const { habits } = useData();
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Habits</h1>
          <p className="text-muted-foreground">
            Track your daily and weekly habits to build consistency
          </p>
        </div>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Habit
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add a new habit</DialogTitle>
              <DialogDescription>
                Create a new habit to track. Habits help you build consistency over time.
              </DialogDescription>
            </DialogHeader>
            <AddHabitForm open={dialogOpen} onOpenChange={setDialogOpen} />
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {habits.length === 0 ? (
          <Card className="col-span-full p-8 text-center">
            <CardContent>
              <p className="text-muted-foreground mb-4">
                You don't have any habits yet. Add your first habit to start tracking.
              </p>
              <Button onClick={() => setDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Habit
              </Button>
            </CardContent>
          </Card>
        ) : (
          habits.map((habit) => (
            <HabitItem key={habit.id} habit={habit} />
          ))
        )}
      </div>
    </div>
  );
};

export default Habits;
