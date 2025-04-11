
import React from 'react';
import { format, subDays, addDays, isToday, isBefore, isSameDay } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HabitWeekViewProps {
  completedDates: string[];
  onToggleDate: (dateString: string) => void;
}

const HabitWeekView: React.FC<HabitWeekViewProps> = ({ completedDates, onToggleDate }) => {
  const today = new Date();
  
  // Generate the last 3 days, today, and the next 3 days
  const daysToShow = [];
  for (let i = -3; i <= 3; i++) {
    const date = i < 0 
      ? subDays(today, Math.abs(i)) 
      : i > 0 
        ? addDays(today, i) 
        : today;
    
    daysToShow.push(date);
  }

  const isDateCompleted = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return completedDates.includes(dateString);
  };

  const isPast = (date: Date) => {
    return isBefore(date, today) && !isToday(date);
  };

  return (
    <div className="flex justify-between mt-4 mb-2">
      {daysToShow.map((date, index) => {
        const dateString = date.toISOString().split('T')[0];
        const completed = isDateCompleted(date);
        const isPastDate = isPast(date);
        
        return (
          <div key={dateString} className="flex flex-col items-center">
            <div className="text-xs text-muted-foreground mb-1">
              {isToday(date) ? 'Today' : format(date, 'EEE')}
            </div>
            <div className="text-xs font-medium mb-2">{format(date, 'd')}</div>
            <Button
              size="sm"
              variant="outline"
              className={cn(
                "h-8 w-8 p-0 rounded-full",
                completed && "bg-brand-purple text-white hover:bg-brand-purple-dark",
                !completed && isPastDate && "border-dashed"
              )}
              onClick={() => onToggleDate(dateString)}
              disabled={isBefore(date, subDays(today, 3))}
            >
              {completed && <Check className="h-4 w-4" />}
            </Button>
          </div>
        );
      })}
    </div>
  );
};

export default HabitWeekView;
