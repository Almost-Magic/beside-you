import { useState, useEffect } from 'react';
import { Plus, Sparkles, Calendar, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { GoodDayEntry, getGoodDays, addGoodDay, deleteGoodDay } from '@/lib/database';
import { format } from 'date-fns';

export function GoodDaysPage() {
  const [entries, setEntries] = useState<GoodDayEntry[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadEntries();
  }, []);

  async function loadEntries() {
    try {
      const data = await getGoodDays();
      setEntries(data.reverse()); // Most recent first
    } catch (error) {
      console.error('Failed to load entries:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleAddEntry(content: string) {
    try {
      await addGoodDay({
        date: new Date().toISOString(),
        content,
      });
      await loadEntries();
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Failed to add entry:', error);
    }
  }

  async function handleDeleteEntry(id: string) {
    try {
      await deleteGoodDay(id);
      await loadEntries();
    } catch (error) {
      console.error('Failed to delete entry:', error);
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground mb-2 flex items-center gap-2">
            <span>🫙</span> Good Days Jar
          </h1>
          <p className="text-muted-foreground">
            Collect moments of light to revisit on difficult days.
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Add Moment
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>What was good today?</DialogTitle>
              <DialogDescription>
                Even small moments of light matter. A kind word, a good cup of tea, 
                a moment of sunshine.
              </DialogDescription>
            </DialogHeader>
            <GoodDayForm onSubmit={handleAddEntry} onCancel={() => setIsDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Entries */}
      {entries.length === 0 ? (
        <EmptyJar onAdd={() => setIsDialogOpen(true)} />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {entries.map((entry) => (
            <GoodDayCard 
              key={entry.id} 
              entry={entry} 
              onDelete={() => handleDeleteEntry(entry.id)} 
            />
          ))}
        </div>
      )}
    </div>
  );
}

function EmptyJar({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl p-8 text-center border border-amber-200/50 dark:border-amber-700/30">
      <div className="text-6xl mb-6">🫙</div>
      <p className="text-foreground mb-4 max-w-md mx-auto">
        Even on the hardest days, there can be small moments of light.
      </p>
      <p className="text-muted-foreground mb-6 max-w-md mx-auto text-sm">
        A kind word. A good cup of tea. A moment of sunshine.
        A text from someone who cares. A show that made you smile.
      </p>
      <p className="text-foreground mb-6 max-w-md mx-auto">
        This is a place to collect them. On difficult days, you can come back here and remember:
        good moments exist, even in this journey.
      </p>
      <Button onClick={onAdd} className="gap-2">
        <Sparkles className="w-4 h-4" />
        Add Your First Moment
      </Button>
    </div>
  );
}

interface GoodDayFormProps {
  onSubmit: (content: string) => void;
  onCancel: () => void;
}

function GoodDayForm({ onSubmit, onCancel }: GoodDayFormProps) {
  const [content, setContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    onSubmit(content.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write about a good moment..."
        rows={4}
        autoFocus
      />
      <div className="flex gap-2">
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
        <Button type="submit" className="flex-1" disabled={!content.trim()}>
          Add to Jar
        </Button>
      </div>
    </form>
  );
}

interface GoodDayCardProps {
  entry: GoodDayEntry;
  onDelete: () => void;
}

function GoodDayCard({ entry, onDelete }: GoodDayCardProps) {
  return (
    <div className="jar-entry group relative">
      <p className="text-foreground mb-3 pr-8">{entry.content}</p>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Calendar className="w-4 h-4" />
        <span>{format(new Date(entry.date), 'MMMM d, yyyy')}</span>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={onDelete}
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  );
}
