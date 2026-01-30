import { useState, useEffect } from 'react';
import { Plus, Activity, Calendar, TrendingUp, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SymptomEntry, getSymptoms, addSymptom, deleteSymptom } from '@/lib/database';
import { format } from 'date-fns';

const commonSymptoms = [
  'Fatigue',
  'Nausea',
  'Pain',
  'Appetite changes',
  'Sleep problems',
  'Mood changes',
  'Mouth sores',
  'Neuropathy',
  'Other',
];

export function SymptomsPage() {
  const [symptoms, setSymptoms] = useState<SymptomEntry[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSymptoms();
  }, []);

  async function loadSymptoms() {
    try {
      const data = await getSymptoms();
      setSymptoms(data.reverse()); // Most recent first
    } catch (error) {
      console.error('Failed to load symptoms:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleAddSymptom(entry: Omit<SymptomEntry, 'id' | 'createdAt'>) {
    try {
      await addSymptom(entry);
      await loadSymptoms();
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Failed to add symptom:', error);
    }
  }

  async function handleDeleteSymptom(id: string) {
    try {
      await deleteSymptom(id);
      await loadSymptoms();
    } catch (error) {
      console.error('Failed to delete symptom:', error);
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
          <h1 className="text-2xl font-semibold text-foreground mb-2">Symptom Tracker</h1>
          <p className="text-muted-foreground">
            Tracking symptoms helps you communicate clearly with your care team.
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Log Symptom
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Log a Symptom</DialogTitle>
              <DialogDescription>
                Track how you are feeling to share with your care team.
              </DialogDescription>
            </DialogHeader>
            <SymptomForm onSubmit={handleAddSymptom} onCancel={() => setIsDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Symptom List */}
      {symptoms.length === 0 ? (
        <div className="empty-state bg-card rounded-xl border border-border/50 py-16">
          <Activity className="empty-state-icon" />
          <h3 className="text-lg font-medium text-foreground mb-2">No symptoms logged yet</h3>
          <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
            Tracking your symptoms helps you have clearer conversations with your care team.
            You do not have to track everything — even noting one symptom can help.
          </p>
          <div className="flex flex-wrap gap-2 justify-center mb-6">
            {commonSymptoms.slice(0, 5).map((symptom) => (
              <span key={symptom} className="px-3 py-1 bg-muted rounded-full text-sm text-muted-foreground">
                {symptom}
              </span>
            ))}
          </div>
          <Button onClick={() => setIsDialogOpen(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            Log First Symptom
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {symptoms.map((entry) => (
            <SymptomCard 
              key={entry.id} 
              entry={entry} 
              onDelete={() => handleDeleteSymptom(entry.id)} 
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface SymptomFormProps {
  onSubmit: (entry: Omit<SymptomEntry, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}

function SymptomForm({ onSubmit, onCancel }: SymptomFormProps) {
  const [symptom, setSymptom] = useState('');
  const [customSymptom, setCustomSymptom] = useState('');
  const [severity, setSeverity] = useState<string>('3');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalSymptom = symptom === 'Other' ? customSymptom : symptom;
    if (!finalSymptom) return;

    onSubmit({
      date: new Date().toISOString(),
      symptom: finalSymptom,
      severity: parseInt(severity) as 1 | 2 | 3 | 4 | 5,
      notes: notes || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>Symptom</Label>
        <Select value={symptom} onValueChange={setSymptom}>
          <SelectTrigger>
            <SelectValue placeholder="Select a symptom" />
          </SelectTrigger>
          <SelectContent>
            {commonSymptoms.map((s) => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {symptom === 'Other' && (
          <Input
            value={customSymptom}
            onChange={(e) => setCustomSymptom(e.target.value)}
            placeholder="Describe the symptom"
          />
        )}
      </div>

      <div className="space-y-2">
        <Label>Severity (1-5)</Label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((level) => (
            <button
              key={level}
              type="button"
              onClick={() => setSeverity(level.toString())}
              className={`flex-1 py-3 rounded-lg text-center font-medium transition-colors ${
                severity === level.toString()
                  ? `severity-${level}`
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {level}
            </button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">1 = mild, 5 = severe</p>
      </div>

      <div className="space-y-2">
        <Label>Notes (optional)</Label>
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Any additional details..."
          rows={3}
        />
      </div>

      <div className="flex gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
        <Button type="submit" className="flex-1" disabled={!symptom || (symptom === 'Other' && !customSymptom)}>
          Log Symptom
        </Button>
      </div>
    </form>
  );
}

interface SymptomCardProps {
  entry: SymptomEntry;
  onDelete: () => void;
}

function SymptomCard({ entry, onDelete }: SymptomCardProps) {
  return (
    <div className="bg-card rounded-xl p-4 border border-border/50 flex items-start gap-4">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 severity-${entry.severity}`}>
        {entry.severity}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-medium text-foreground">{entry.symptom}</h3>
          <span className="text-xs text-muted-foreground">
            {format(new Date(entry.date), 'MMM d, h:mm a')}
          </span>
        </div>
        {entry.notes && (
          <p className="text-sm text-muted-foreground">{entry.notes}</p>
        )}
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={onDelete}
        className="text-muted-foreground hover:text-destructive shrink-0"
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  );
}
