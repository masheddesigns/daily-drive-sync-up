
export interface Habit {
  id: string;
  name: string;
  description?: string;
  streak: number;
  frequency: 'daily' | 'weekly';
  completedDates: string[];
  createdAt: string;
  reminderTime?: string;
  color?: string;
}

export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  createdAt: string;
  reminderTime?: string;
  tags?: string[];
  listId?: string;
}

export interface TodoList {
  id: string;
  name: string;
  createdAt: string;
  color?: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  color?: string;
  tags?: string[];
  categoryId?: string;
}

export interface NoteCategory {
  id: string;
  name: string;
  createdAt: string;
  color?: string;
}

export interface PersistentData {
  habits: Habit[];
  todos: Todo[];
  todoLists: TodoList[];
  notes: Note[];
  noteCategories: NoteCategory[];
  lastBackupDate?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'habit' | 'todo' | 'note' | 'system';
  read: boolean;
  createdAt: string;
  targetId?: string;
}
