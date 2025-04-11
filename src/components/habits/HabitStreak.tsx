
import React from 'react';
import { subDays, format, isWithinInterval, isSameDay, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';

interface HabitStreakProps {
  completedDates: string[];
}

const HabitStreak: React.FC<HabitStreakProps> = ({ completedDates }) => {
  const today = new Date();
  const startDate = subDays(today, 14);
  
  // Generate dates for the last 15 days
  const daysToShow = [];
  for (let i = 0; i < 15; i++) {
    const date = subDays(today, 14 - i);
    daysToShow.push(date);
  }

  const isDateCompleted = (date: Date) => {
    return completedDates.some(completedDate => {
      const parsedCompletedDate = parseISO(completedDate);
      return isSameDay(parsedCompletedDate, date);
    });
  };

  return (
    <div className="mt-3">
      <p className="text-xs text-muted-foreground mb-2">Last 15 days:</p>
      <div className="flex">
        {daysToShow.map((date, index) => {
          const completed = isDateCompleted(date);
          const isToday = isSameDay(date, today);
          
          return (
            <div 
              key={index} 
              className={cn(
                "h-2 flex-1 mx-0.5 rounded-sm",
                completed ? "bg-brand-purple" : "bg-muted",
                isToday && "border border-brand-purple"
              )}
              title={`${format(date, 'MMM dd')}: ${completed ? 'Completed' : 'Not completed'}`}
            />
          );
        })}
      </div>
    </div>
  );
};

export default HabitStreak;
