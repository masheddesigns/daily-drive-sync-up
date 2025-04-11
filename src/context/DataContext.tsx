import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { PersistentData, Habit, Todo, Note, Notification, TodoList, NoteCategory } from '@/types';
import { useToast } from '@/components/ui/use-toast';

interface DataContextType {
  habits: Habit[];
  todos: Todo[];
  todoLists: TodoList[];
  notes: Note[];
  noteCategories: NoteCategory[];
  notifications: Notification[];
  addHabit: (habit: Omit<Habit, 'id' | 'streak' | 'completedDates' | 'createdAt'>) => void;
  updateHabit: (id: string, habit: Partial<Habit>) => void;
  deleteHabit: (id: string) => void;
  completeHabit: (id: string) => void;
  addTodo: (todo: Omit<Todo, 'id' | 'completed' | 'createdAt'>) => void;
  updateTodo: (id: string, todo: Partial<Todo>) => void;
  deleteTodo: (id: string) => void;
  toggleTodo: (id: string) => void;
  addTodoList: (list: Omit<TodoList, 'id' | 'createdAt'>) => void;
  updateTodoList: (id: string, list: Partial<TodoList>) => void;
  deleteTodoList: (id: string) => void;
  addNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateNote: (id: string, note: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  addNoteCategory: (category: Omit<NoteCategory, 'id' | 'createdAt'>) => void;
  updateNoteCategory: (id: string, category: Partial<NoteCategory>) => void;
  deleteNoteCategory: (id: string) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'read' | 'createdAt'>) => void;
  markNotificationAsRead: (id: string) => void;
  deleteNotification: (id: string) => void;
  exportData: () => PersistentData;
  importData: (data: PersistentData) => void;
  backupToGoogleDrive: () => Promise<void>;
  restoreFromGoogleDrive: () => Promise<void>;
  isDriveConnected: boolean;
  connectToDrive: () => Promise<void>;
  disconnectFromDrive: () => void;
  isLoading: boolean;
}

const DEFAULT_DATA: PersistentData = {
  habits: [],
  todos: [],
  todoLists: [],
  notes: [],
  noteCategories: []
};

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within a DataProvider');
  return context;
};

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<PersistentData>(DEFAULT_DATA);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isDriveConnected, setIsDriveConnected] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  // Load data from localStorage on initial render
  useEffect(() => {
    const savedData = localStorage.getItem('habitTrackerData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        // Handle backward compatibility
        if (!parsedData.todoLists) parsedData.todoLists = [];
        if (!parsedData.noteCategories) parsedData.noteCategories = [];
        
        setData(parsedData);
      } catch (error) {
        console.error('Failed to parse saved data:', error);
        setData(DEFAULT_DATA);
      }
    }

    const savedNotifications = localStorage.getItem('habitTrackerNotifications');
    if (savedNotifications) {
      try {
        setNotifications(JSON.parse(savedNotifications));
      } catch (error) {
        console.error('Failed to parse saved notifications:', error);
        setNotifications([]);
      }
    }

    // Check for Google Drive connection
    const driveConnected = localStorage.getItem('isDriveConnected') === 'true';
    setIsDriveConnected(driveConnected);
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('habitTrackerData', JSON.stringify(data));
  }, [data]);

  // Save notifications to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('habitTrackerNotifications', JSON.stringify(notifications));
  }, [notifications]);

  // Generate a unique ID
  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  };

  // Habit functions
  const addHabit = (habit: Omit<Habit, 'id' | 'streak' | 'completedDates' | 'createdAt'>) => {
    const newHabit: Habit = {
      id: generateId(),
      streak: 0,
      completedDates: [],
      createdAt: new Date().toISOString(),
      ...habit
    };
    
    setData(prev => ({
      ...prev,
      habits: [...prev.habits, newHabit]
    }));
    
    toast({
      title: "Habit Added",
      description: `${habit.name} has been added to your habits.`
    });
  };

  const updateHabit = (id: string, habit: Partial<Habit>) => {
    setData(prev => ({
      ...prev,
      habits: prev.habits.map(h => 
        h.id === id ? { ...h, ...habit } : h
      )
    }));
  };

  const deleteHabit = (id: string) => {
    setData(prev => ({
      ...prev,
      habits: prev.habits.filter(h => h.id !== id)
    }));
    
    toast({
      title: "Habit Deleted",
      description: "The habit has been deleted."
    });
  };

  const completeHabit = (id: string) => {
    const today = new Date().toISOString().split('T')[0];
    
    setData(prev => {
      const habit = prev.habits.find(h => h.id === id);
      if (!habit) return prev;
      
      const completedToday = habit.completedDates.includes(today);
      
      if (completedToday) {
        // If already completed today, uncomplete it
        return {
          ...prev,
          habits: prev.habits.map(h => {
            if (h.id === id) {
              return {
                ...h,
                completedDates: h.completedDates.filter(date => date !== today),
                streak: Math.max(0, h.streak - 1)
              };
            }
            return h;
          })
        };
      } else {
        // Complete the habit for today
        return {
          ...prev,
          habits: prev.habits.map(h => {
            if (h.id === id) {
              return {
                ...h,
                completedDates: [...h.completedDates, today],
                streak: h.streak + 1
              };
            }
            return h;
          })
        };
      }
    });
  };

  // Todo functions
  const addTodo = (todo: Omit<Todo, 'id' | 'completed' | 'createdAt'>) => {
    const newTodo: Todo = {
      id: generateId(),
      completed: false,
      createdAt: new Date().toISOString(),
      ...todo
    };
    
    setData(prev => ({
      ...prev,
      todos: [...prev.todos, newTodo]
    }));
    
    toast({
      title: "Todo Added",
      description: `${todo.title} has been added to your todos.`
    });
  };

  const updateTodo = (id: string, todo: Partial<Todo>) => {
    setData(prev => ({
      ...prev,
      todos: prev.todos.map(t => 
        t.id === id ? { ...t, ...todo } : t
      )
    }));
  };

  const deleteTodo = (id: string) => {
    setData(prev => ({
      ...prev,
      todos: prev.todos.filter(t => t.id !== id)
    }));
    
    toast({
      title: "Todo Deleted",
      description: "The todo has been deleted."
    });
  };

  const toggleTodo = (id: string) => {
    setData(prev => ({
      ...prev,
      todos: prev.todos.map(t => {
        if (t.id === id) {
          const completed = !t.completed;
          
          // Show toast if the todo is marked as completed
          if (completed) {
            toast({
              title: "Todo Completed",
              description: `"${t.title}" marked as completed.`
            });
          }
          
          return { ...t, completed };
        }
        return t;
      })
    }));
  };

  // Todo List functions
  const addTodoList = (list: Omit<TodoList, 'id' | 'createdAt'>) => {
    const newList: TodoList = {
      id: generateId(),
      createdAt: new Date().toISOString(),
      ...list
    };
    
    setData(prev => ({
      ...prev,
      todoLists: [...prev.todoLists, newList]
    }));
    
    toast({
      title: "List Added",
      description: `${list.name} list has been created.`
    });
  };

  const updateTodoList = (id: string, list: Partial<TodoList>) => {
    setData(prev => ({
      ...prev,
      todoLists: prev.todoLists.map(l => 
        l.id === id ? { ...l, ...list } : l
      )
    }));
  };

  const deleteTodoList = (id: string) => {
    setData(prev => {
      // Also delete all todos in the list
      const updatedTodos = prev.todos.filter(todo => todo.listId !== id);
      
      return {
        ...prev,
        todoLists: prev.todoLists.filter(l => l.id !== id),
        todos: updatedTodos
      };
    });
    
    toast({
      title: "List Deleted",
      description: "The list and all its todos have been deleted."
    });
  };

  // Note functions
  const addNote = (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newNote: Note = {
      id: generateId(),
      createdAt: now,
      updatedAt: now,
      ...note
    };
    
    setData(prev => ({
      ...prev,
      notes: [...prev.notes, newNote]
    }));
    
    toast({
      title: "Note Added",
      description: `${note.title} has been added to your notes.`
    });
  };

  const updateNote = (id: string, note: Partial<Note>) => {
    setData(prev => ({
      ...prev,
      notes: prev.notes.map(n => {
        if (n.id === id) {
          return {
            ...n,
            ...note,
            updatedAt: new Date().toISOString()
          };
        }
        return n;
      })
    }));
  };

  const deleteNote = (id: string) => {
    setData(prev => ({
      ...prev,
      notes: prev.notes.filter(n => n.id !== id)
    }));
    
    toast({
      title: "Note Deleted",
      description: "The note has been deleted."
    });
  };

  // Note Category functions
  const addNoteCategory = (category: Omit<NoteCategory, 'id' | 'createdAt'>) => {
    const newCategory: NoteCategory = {
      id: generateId(),
      createdAt: new Date().toISOString(),
      ...category
    };
    
    setData(prev => ({
      ...prev,
      noteCategories: [...prev.noteCategories, newCategory]
    }));
    
    toast({
      title: "Category Added",
      description: `${category.name} category has been created.`
    });
  };

  const updateNoteCategory = (id: string, category: Partial<NoteCategory>) => {
    setData(prev => ({
      ...prev,
      noteCategories: prev.noteCategories.map(c => 
        c.id === id ? { ...c, ...category } : c
      )
    }));
  };

  const deleteNoteCategory = (id: string) => {
    setData(prev => {
      // Update notes to remove categoryId
      const updatedNotes = prev.notes.map(note => {
        if (note.categoryId === id) {
          return { ...note, categoryId: undefined };
        }
        return note;
      });
      
      return {
        ...prev,
        noteCategories: prev.noteCategories.filter(c => c.id !== id),
        notes: updatedNotes
      };
    });
    
    toast({
      title: "Category Deleted",
      description: "The category has been deleted."
    });
  };

  // Notification functions
  const addNotification = (notification: Omit<Notification, 'id' | 'read' | 'createdAt'>) => {
    const newNotification: Notification = {
      id: generateId(),
      read: false,
      createdAt: new Date().toISOString(),
      ...notification
    };
    
    setNotifications(prev => [newNotification, ...prev]);
    
    toast({
      title: notification.title,
      description: notification.message
    });
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Data export/import functions
  const exportData = (): PersistentData => {
    return {
      ...data,
      lastBackupDate: new Date().toISOString()
    };
  };

  const importData = (importedData: PersistentData) => {
    setData(importedData);
    toast({
      title: "Data Imported",
      description: "Your data has been successfully imported."
    });
  };

  // Google Drive functions (mock implementations)
  const connectToDrive = async () => {
    setIsLoading(true);
    
    // Mock Google Drive connection
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsDriveConnected(true);
    localStorage.setItem('isDriveConnected', 'true');
    
    setIsLoading(false);
    
    toast({
      title: "Google Drive Connected",
      description: "Your account is now connected to Google Drive for backups."
    });
    
    return Promise.resolve();
  };

  const disconnectFromDrive = () => {
    setIsDriveConnected(false);
    localStorage.setItem('isDriveConnected', 'false');
    
    toast({
      title: "Google Drive Disconnected",
      description: "Your account has been disconnected from Google Drive."
    });
  };

  const backupToGoogleDrive = async () => {
    if (!isDriveConnected) {
      toast({
        title: "Error",
        description: "Please connect to Google Drive first.",
        variant: "destructive"
      });
      return Promise.reject("Not connected to Google Drive");
    }
    
    setIsLoading(true);
    
    // Mock backup process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newData = {
      ...data,
      lastBackupDate: new Date().toISOString()
    };
    
    setData(newData);
    setIsLoading(false);
    
    toast({
      title: "Backup Complete",
      description: "Your data has been backed up to Google Drive."
    });
    
    return Promise.resolve();
  };

  const restoreFromGoogleDrive = async () => {
    if (!isDriveConnected) {
      toast({
        title: "Error",
        description: "Please connect to Google Drive first.",
        variant: "destructive"
      });
      return Promise.reject("Not connected to Google Drive");
    }
    
    setIsLoading(true);
    
    // Mock restore process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // For now, we'll just pretend we restored data
    // In a real app, we would fetch data from Google Drive
    setIsLoading(false);
    
    toast({
      title: "Restore Complete",
      description: "Your data has been restored from Google Drive."
    });
    
    return Promise.resolve();
  };

  const contextValue: DataContextType = {
    habits: data.habits,
    todos: data.todos,
    todoLists: data.todoLists,
    notes: data.notes,
    noteCategories: data.noteCategories,
    notifications,
    addHabit,
    updateHabit,
    deleteHabit,
    completeHabit,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
    addTodoList,
    updateTodoList,
    deleteTodoList,
    addNote,
    updateNote,
    deleteNote,
    addNoteCategory,
    updateNoteCategory,
    deleteNoteCategory,
    addNotification,
    markNotificationAsRead,
    deleteNotification,
    exportData,
    importData,
    backupToGoogleDrive,
    restoreFromGoogleDrive,
    isDriveConnected,
    connectToDrive,
    disconnectFromDrive,
    isLoading
  };

  return (
    <DataContext.Provider value={contextValue}>
      {children}
    </DataContext.Provider>
  );
};
