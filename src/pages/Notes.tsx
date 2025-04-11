
import React, { useState } from 'react';
import { 
  Plus, 
  MoreVertical, 
  Trash2,
  Edit,
  Calendar,
  Tag
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
import { Note } from '@/types';
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

const NoteItem = ({ note }: { note: Note }) => {
  const { updateNote, deleteNote } = useData();
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(note.title);
  const [editedContent, setEditedContent] = useState(note.content);

  const handleSaveEdit = () => {
    updateNote(note.id, {
      title: editedTitle,
      content: editedContent
    });
    setIsEditing(false);
  };

  const handleDelete = () => {
    deleteNote(note.id);
  };

  const noteColor = note.color || colors[Math.floor(Math.random() * colors.length)];

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
  const { addNote } = useData();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [color, setColor] = useState(colors[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && content.trim()) {
      addNote({
        title,
        content,
        color
      });
      
      // Reset form
      setTitle('');
      setContent('');
      
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

const Notes = () => {
  const { notes } = useData();
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div className="space-y-6">
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {notes.length === 0 ? (
          <Card className="col-span-full p-8 text-center">
            <CardContent>
              <p className="text-muted-foreground mb-4">
                You don't have any notes yet. Add your first note to get started.
              </p>
              <Button onClick={() => setDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Note
              </Button>
            </CardContent>
          </Card>
        ) : (
          notes.map((note) => (
            <NoteItem key={note.id} note={note} />
          ))
        )}
      </div>
    </div>
  );
};

export default Notes;
