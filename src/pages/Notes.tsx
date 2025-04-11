import React, { useState } from 'react';
import { 
  Plus, 
  MoreVertical, 
  Trash2,
  Edit,
  Calendar,
  Tag,
  Folder,
  List,
  FileText
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
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Note, NoteCategory } from '@/types';
import { useData } from '@/context/DataContext';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const colors = [
  "bg-brand-purple-light",
  "bg-blue-100",
  "bg-green-100",
  "bg-yellow-100",
  "bg-orange-100",
  "bg-red-100",
  "bg-pink-100",
  "bg-purple-100",
  "bg-indigo-100",
];

const categoryColors = [
  "bg-brand-purple/10 border-brand-purple/30",
  "bg-blue-500/10 border-blue-500/30",
  "bg-green-500/10 border-green-500/30",
  "bg-amber-500/10 border-amber-500/30",
  "bg-red-500/10 border-red-500/30",
  "bg-pink-500/10 border-pink-500/30",
  "bg-indigo-500/10 border-indigo-500/30",
];

const NoteItem = ({ note }: { note: Note }) => {
  const { updateNote, deleteNote, noteCategories } = useData();
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(note.title);
  const [editedContent, setEditedContent] = useState(note.content);
  const [editedCategoryId, setEditedCategoryId] = useState(note.categoryId);

  const handleSaveEdit = () => {
    updateNote(note.id, {
      title: editedTitle,
      content: editedContent,
      categoryId: editedCategoryId
    });
    setIsEditing(false);
  };

  const handleDelete = () => {
    deleteNote(note.id);
  };

  const noteColor = note.color || colors[Math.floor(Math.random() * colors.length)];
  const category = note.categoryId ? noteCategories.find(cat => cat.id === note.categoryId) : null;

  return (
    <Card className={cn("h-full flex flex-col", noteColor)}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          {isEditing ? (
            <Input
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="font-semibold"
            />
          ) : (
            <CardTitle>{note.title}</CardTitle>
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
        {category && !isEditing && (
          <Badge variant="outline" className={cn("text-xs", category.color || "")}>
            <Folder className="h-3 w-3 mr-1" />
            {category.name}
          </Badge>
        )}
        {isEditing && (
          <Select
            value={editedCategoryId || "none"}
            onValueChange={(value) => setEditedCategoryId(value === "none" ? undefined : value)}
          >
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Select a category (optional)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No Category</SelectItem>
              {noteCategories.map(category => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </CardHeader>
      
      <CardContent className="flex-1">
        {isEditing ? (
          <Textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="min-h-[150px]"
          />
        ) : (
          <div className="whitespace-pre-wrap text-sm">{note.content}</div>
        )}
      </CardContent>
      
      <CardFooter className="flex-col items-start pt-2 border-t">
        <p className="text-xs text-muted-foreground flex items-center">
          <Calendar className="h-3 w-3 mr-1" />
          Updated {format(new Date(note.updatedAt), 'MMM d, yyyy')}
        </p>
        
        {note.tags && note.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {note.tags.map(tag => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

const AddNoteForm = ({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) => {
  const { addNote, noteCategories } = useData();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [color, setColor] = useState(colors[0]);
  const [categoryId, setCategoryId] = useState<string | undefined>(undefined);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && content.trim()) {
      addNote({
        title,
        content,
        color,
        categoryId: categoryId === 'none' ? undefined : categoryId
      });
      
      // Reset form
      setTitle('');
      setContent('');
      setCategoryId(undefined);
      
      // Close dialog
      onOpenChange(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Note Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter note title"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="content">Content</Label>
          <Textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Enter note content"
            className="min-h-[200px]"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category (optional)</Label>
          <Select
            value={categoryId || "none"}
            onValueChange={(value) => setCategoryId(value === "none" ? undefined : value)}
          >
            <SelectTrigger id="category">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No Category</SelectItem>
              {noteCategories.map(category => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label>Note Color</Label>
          <div className="flex flex-wrap gap-2">
            {colors.map((bgColor) => (
              <Button
                key={bgColor}
                type="button"
                variant="outline"
                className={cn(
                  "w-8 h-8 rounded-full p-0 border-2",
                  bgColor,
                  color === bgColor ? "border-primary" : "border-transparent"
                )}
                onClick={() => setColor(bgColor)}
              />
            ))}
          </div>
        </div>
      </div>
      
      <DialogFooter className="mt-6">
        <Button type="submit">Add Note</Button>
      </DialogFooter>
    </form>
  );
};

const AddCategoryForm = ({ onClose }: { onClose: () => void }) => {
  const { addNoteCategory } = useData();
  const [name, setName] = useState('');
  const [color, setColor] = useState(categoryColors[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      addNoteCategory({ 
        name: name.trim(),
        color
      });
      setName('');
      onClose();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="categoryName">Category Name</Label>
        <Input
          id="categoryName"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter category name"
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Category Color</Label>
        <div className="flex flex-wrap gap-2">
          {categoryColors.map((bgColor) => (
            <Button
              key={bgColor}
              type="button"
              variant="outline"
              className={cn(
                "w-8 h-8 rounded-full p-0 border-2",
                bgColor,
                color === bgColor ? "border-primary" : "border-transparent"
              )}
              onClick={() => setColor(bgColor)}
            />
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-6">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">
          Add Category
        </Button>
      </div>
    </form>
  );
};

const Notes = () => {
  const { notes, noteCategories, deleteNoteCategory } = useData();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isAddingCategory, setIsAddingCategory] = useState(false);

  const filteredNotes = notes.filter(note => {
    if (selectedCategory === null) return true;
    return note.categoryId === selectedCategory;
  });

  const handleAddCategoryClick = () => {
    setIsAddingCategory(true);
  };

  const handleCategoryDelete = (id: string) => {
    if (selectedCategory === id) {
      setSelectedCategory(null);
    }
    deleteNoteCategory(id);
  };

  return (
    <div className="space-y-6 pt-4 px-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notes</h1>
          <p className="text-muted-foreground">
            Capture your thoughts and ideas
          </p>
        </div>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Note
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add a new note</DialogTitle>
              <DialogDescription>
                Create a new note to capture your thoughts.
              </DialogDescription>
            </DialogHeader>
            <AddNoteForm open={dialogOpen} onOpenChange={setDialogOpen} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Categories</h2>
            <Button variant="ghost" size="icon" onClick={handleAddCategoryClick}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-1">
            <Button
              variant={selectedCategory === null ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setSelectedCategory(null)}
            >
              <FileText className="h-4 w-4 mr-2" />
              All Notes
            </Button>
            
            {noteCategories.map(category => (
              <div key={category.id} className="flex items-center">
                <Button
                  variant={selectedCategory === category.id ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <div className={cn("h-3 w-3 rounded-full mr-2", category.color || "bg-primary")} />
                  {category.name}
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem 
                      onClick={() => handleCategoryDelete(category.id)}
                      className="text-red-500"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Category
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>

          {isAddingCategory && (
            <Card>
              <CardContent className="pt-4">
                <AddCategoryForm onClose={() => setIsAddingCategory(false)} />
              </CardContent>
            </Card>
          )}
        </div>

        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNotes.length === 0 ? (
              <Card className="col-span-full p-8 text-center">
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    {selectedCategory
                      ? "This category doesn't have any notes. Add your first note to get started."
                      : "You don't have any notes yet. Add your first note to get started."
                    }
                  </p>
                  <Button onClick={() => setDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Note
                  </Button>
                </CardContent>
              </Card>
            ) : (
              filteredNotes.map((note) => (
                <NoteItem key={note.id} note={note} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notes;
