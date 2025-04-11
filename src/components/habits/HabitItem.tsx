
import React, { useState } from 'react';
import { 
  Edit, 
  Trash2, 
  MoreVertical, 
  CheckCircle2, 
  Flame,
  Calendar,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Habit } from '@/types';
import { cn } from '@/lib/utils';
import { useData } from '@/context/DataContext';
import HabitWeekView from './HabitWeekView';
import HabitStreak from './HabitStreak';

interface HabitItemProps {
  habit: Habit;
}

const HabitItem: React.FC<HabitItemProps> = ({ habit }) => {
  const { completeHabit, updateHabit, deleteHabit } = useData();
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(habit.name);
  const [editedDesc, setEditedDesc] = useState(habit.description || '');

  const today = new Date().toISOString().split('T')[0];
  const isCompletedToday = habit.completedDates.includes(today);

  const handleComplete = () => {
    completeHabit(habit.id);
  };

  const handleToggleDate = (dateString: string) => {
    // Get current completed dates
    const newCompletedDates = [...habit.completedDates];
    
    // Toggle date
    if (newCompletedDates.includes(dateString)) {
      const index = newCompletedDates.indexOf(dateString);
      newCompletedDates.splice(index, 1);
    } else {
      newCompletedDates.push(dateString);
    }
    
    // Sort dates
    newCompletedDates.sort();
    
    // Update habit with new dates and recalculate streak
    updateHabit(habit.id, {
      completedDates: newCompletedDates
    });
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
        
        {/* Week view for tracking */}
        <HabitWeekView 
          completedDates={habit.completedDates} 
          onToggleDate={handleToggleDate} 
        />
        
        {/* Streak visualization */}
        <HabitStreak completedDates={habit.completedDates} />
      </CardContent>
      
      <CardFooter className="pt-2">
        <Button 
          variant={isCompletedToday ? "default" : "outline"} 
          className={`w-full ${isCompletedToday ? "bg-brand-purple hover:bg-brand-purple-dark" : ""}`}
          onClick={handleComplete}
        >
          <CheckCircle2 className="h-4 w-4 mr-2" />
          {isCompletedToday ? "Completed Today" : "Mark Today Complete"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default HabitItem;
