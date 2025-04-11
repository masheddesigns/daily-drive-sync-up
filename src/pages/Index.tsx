
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CheckSquare, 
  ListTodo, 
  FileText, 
  ChevronRight,
  Download,
  Bell
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-b from-background to-muted/50">
      <div className="max-w-4xl w-full space-y-8 text-center">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Daily Drive
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Keep track of your habits, tasks, and notes in one place
          </p>
        </div>

        <div className="flex flex-wrap gap-4 justify-center">
          <Button 
            size="lg" 
            onClick={() => navigate('/habits')}
            className="bg-brand-purple hover:bg-brand-purple-dark"
          >
            Get Started
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            onClick={() => navigate('/todos')}
          >
            Explore Features
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <Card>
            <CardHeader>
              <CheckSquare className="w-10 h-10 mb-2 text-brand-purple" />
              <CardTitle>Habit Tracking</CardTitle>
              <CardDescription>
                Build consistency with daily habit tracking
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Track your streaks, set reminders, and build positive habits for a more productive life.
              </p>
            </CardContent>
            <CardFooter>
              <Button 
                variant="ghost" 
                className="w-full"
                onClick={() => navigate('/habits')}
              >
                Track Habits
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <ListTodo className="w-10 h-10 mb-2 text-blue-500" />
              <CardTitle>Todo Lists</CardTitle>
              <CardDescription>
                Organize tasks by priority and due date
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Manage your tasks, set priorities, and never miss a deadline with our intuitive todo list.
              </p>
            </CardContent>
            <CardFooter>
              <Button 
                variant="ghost" 
                className="w-full"
                onClick={() => navigate('/todos')}
              >
                Manage Todos
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <FileText className="w-10 h-10 mb-2 text-amber-500" />
              <CardTitle>Note Taking</CardTitle>
              <CardDescription>
                Capture ideas and information quickly
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Create, organize and access your notes effortlessly with our simple but powerful note-taking system.
              </p>
            </CardContent>
            <CardFooter>
              <Button 
                variant="ghost" 
                className="w-full"
                onClick={() => navigate('/notes')}
              >
                Take Notes
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <Card>
            <CardHeader>
              <Bell className="w-8 h-8 mb-2 text-purple-500" />
              <CardTitle>Smart Notifications</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Get reminders for habits and important tasks so you never fall behind on your goals.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Download className="w-8 h-8 mb-2 text-green-500" />
              <CardTitle>Google Drive Backup</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Keep your data safe with automatic backups to Google Drive. Access your information from anywhere.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
