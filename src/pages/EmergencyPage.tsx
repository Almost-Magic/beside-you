import { Phone, AlertTriangle, Wind, Heart, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { crisisResources } from '@/data/resources';

export function EmergencyPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="text-center py-4">
        <div className="text-5xl mb-4">🆘</div>
        <h1 className="text-2xl font-semibold text-foreground mb-2">I Need Help Right Now</h1>
        <p className="text-muted-foreground">
          You are not alone. Support is available.
        </p>
      </div>

      {/* Immediate Crisis - Medical Emergency */}
      <div className="bg-destructive/10 border-2 border-destructive/30 rounded-xl p-6">
        <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-destructive" />
          Medical Emergency?
        </h2>
        <p className="text-foreground mb-4">
          If you are having a medical emergency — difficulty breathing, chest pain, 
          severe bleeding, or your cancer team told you to call in an emergency:
        </p>
        <a href="tel:000" className="block">
          <Button variant="destructive" size="lg" className="w-full text-lg gap-2">
            <Phone className="w-5 h-5" />
            Call 000 Now
          </Button>
        </a>
      </div>

      {/* Crisis Support Lines */}
      <div className="bg-card rounded-xl p-6 border border-border/50">
        <h2 className="font-semibold text-foreground mb-4">
          Need to Talk to Someone?
        </h2>
        <p className="text-muted-foreground mb-4">
          These lines are free, confidential, and available 24/7.
        </p>
        <div className="space-y-3">
          {crisisResources.map((resource) => (
            <a
              key={resource.id}
              href={`tel:${resource.phone?.replace(/\s/g, '')}`}
              className="flex items-center justify-between p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
            >
              <div>
                <p className="font-medium text-foreground">{resource.name}</p>
                <p className="text-sm text-muted-foreground">{resource.description}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold text-primary">{resource.phone}</p>
                <p className="text-xs text-muted-foreground">Tap to call</p>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Breathing Exercise */}
      <div className="bg-primary/5 rounded-xl p-6 border border-primary/20">
        <h2 className="font-semibold text-foreground mb-3 flex items-center gap-2">
          <Wind className="w-5 h-5 text-primary" />
          Need to Calm Down First?
        </h2>
        <p className="text-muted-foreground mb-4">
          Sometimes we need a moment to breathe before we can reach out.
        </p>
        <Link to="/peace">
          <Button variant="outline" className="w-full gap-2">
            <Heart className="w-4 h-4" />
            Breathing Exercise
          </Button>
        </Link>
      </div>

      {/* Gentle Reminder */}
      <div className="text-center py-6">
        <div className="bg-muted/50 rounded-xl p-6 max-w-md mx-auto">
          <p className="text-foreground mb-2">
            <strong>You are still here. That matters.</strong>
          </p>
          <p className="text-muted-foreground text-sm">
            Whatever you are facing right now, you do not have to face it alone.
            Reaching out for help is a sign of strength, not weakness.
          </p>
        </div>
      </div>

      {/* Back to Home */}
      <div className="text-center">
        <Link to="/">
          <Button variant="ghost">
            ← Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
