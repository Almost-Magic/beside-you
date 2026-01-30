import { useState } from 'react';
import { Moon, Sun, Type, Download, Upload, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useApp } from '@/contexts/AppContext';
import { exportAllData } from '@/lib/database';
import { toast } from 'sonner';

export function SettingsPage() {
  const { settings, updateSettings, profile } = useApp();
  const [apiKey, setApiKey] = useState(settings?.groqApiKey || '');

  const handleExportData = async () => {
    try {
      const data = await exportAllData();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `besideyou-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('Backup downloaded successfully');
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Failed to export data');
    }
  };

  const handleSaveApiKey = () => {
    updateSettings({ groqApiKey: apiKey });
    toast.success('API key saved');
  };

  if (!settings) return null;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-foreground mb-2">Settings</h1>
        <p className="text-muted-foreground">
          Customise BesideYou to work best for you.
        </p>
      </div>

      {/* Appearance */}
      <section className="bg-card rounded-xl p-6 border border-border/50 space-y-6">
        <h2 className="font-medium text-foreground flex items-center gap-2">
          <Sun className="w-5 h-5" />
          Appearance
        </h2>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Theme</Label>
              <p className="text-sm text-muted-foreground">Choose light, dark, or auto</p>
            </div>
            <Select
              value={settings.theme}
              onValueChange={(value: 'light' | 'dark' | 'auto') => updateSettings({ theme: value })}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="auto">Auto</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Text Size</Label>
              <p className="text-sm text-muted-foreground">Make text easier to read</p>
            </div>
            <Select
              value={settings.fontSize}
              onValueChange={(value: 'normal' | 'large' | 'larger') => updateSettings({ fontSize: value })}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="large">Large</SelectItem>
                <SelectItem value="larger">Larger</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* AI Companion */}
      <section className="bg-card rounded-xl p-6 border border-border/50 space-y-6">
        <h2 className="font-medium text-foreground">AI Companion</h2>
        
        <div className="space-y-4">
          <div>
            <Label>Groq API Key (Optional)</Label>
            <p className="text-sm text-muted-foreground mb-2">
              For enhanced AI responses. Get a free key at{' '}
              <a href="https://console.groq.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                console.groq.com
              </a>
            </p>
            <div className="flex gap-2">
              <Input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your API key"
              />
              <Button onClick={handleSaveApiKey}>Save</Button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Voice Input</Label>
              <p className="text-sm text-muted-foreground">Use voice to talk to the companion</p>
            </div>
            <Switch
              checked={settings.voiceEnabled}
              onCheckedChange={(checked) => updateSettings({ voiceEnabled: checked })}
            />
          </div>
        </div>
      </section>

      {/* Data & Privacy */}
      <section className="bg-card rounded-xl p-6 border border-border/50 space-y-6">
        <h2 className="font-medium text-foreground">Data & Privacy</h2>
        
        <div className="space-y-4">
          <div className="p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-foreground mb-2">
              <strong>Your data stays on your device.</strong>
            </p>
            <p className="text-sm text-muted-foreground">
              We never see your data. We cannot see your data. Everything is stored 
              locally in your browser.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="outline" onClick={handleExportData} className="flex-1 gap-2">
              <Download className="w-4 h-4" />
              Download Backup
            </Button>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="bg-card rounded-xl p-6 border border-border/50">
        <h2 className="font-medium text-foreground mb-4">About BesideYou</h2>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>Version 1.0.0</p>
          <p>Created by Mani Padisetti at Almost Magic Tech Lab, Sydney, Australia.</p>
          <p>For those facing cancer: You are not alone. We are beside you.</p>
        </div>
      </section>
    </div>
  );
}
