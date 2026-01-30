import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  MessageCircle, 
  Activity, 
  Sparkles, 
  Heart,
  HelpCircle,
  Search,
  Mic
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/AppContext';

const quickActions = [
  {
    icon: Search,
    title: 'Look up a word I heard today',
    description: 'Search the medical glossary',
    to: '/glossary',
    color: 'text-primary',
  },
  {
    icon: BookOpen,
    title: 'Prepare for an appointment',
    description: 'Get questions ready',
    to: '/appointments',
    color: 'text-blue-500',
  },
  {
    icon: MessageCircle,
    title: 'I just need to talk to someone',
    description: 'Chat with the AI companion',
    to: '/companion',
    color: 'text-emerald-500',
  },
  {
    icon: Heart,
    title: 'I need a moment to breathe',
    description: 'Grounding exercises',
    to: '/peace',
    color: 'text-rose-500',
  },
];

const features = [
  {
    icon: BookOpen,
    title: 'Medical Glossary',
    description: '1,499 terms explained simply',
    to: '/glossary',
  },
  {
    icon: MessageCircle,
    title: 'AI Companion',
    description: 'Understanding support, any time',
    to: '/companion',
  },
  {
    icon: Activity,
    title: 'Symptom Tracker',
    description: 'Track how you\'re feeling',
    to: '/symptoms',
  },
  {
    icon: Sparkles,
    title: 'Good Days Jar',
    description: 'Collect moments of light',
    to: '/good-days',
  },
  {
    icon: Heart,
    title: 'Moments of Peace',
    description: 'Breathing & grounding',
    to: '/peace',
  },
  {
    icon: HelpCircle,
    title: 'Resources',
    description: 'Australian support services',
    to: '/resources',
  },
];

export function HomePage() {
  const { profile } = useApp();
  
  const greeting = getGreeting();
  const roleText = profile?.role === 'caregiver' 
    ? 'How can we support you today?' 
    : profile?.role === 'supporter'
    ? 'How can we help you help someone you care about?'
    : 'How can we help you today?';

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Section */}
      <section className="text-center py-6">
        <h1 className="text-3xl font-semibold text-foreground mb-2">
          {greeting}
        </h1>
        <p className="text-lg text-muted-foreground">
          {roleText}
        </p>
      </section>

      {/* Start Here - Quick Actions */}
      <section className="bg-card rounded-xl p-6 border border-border/50">
        <div className="text-center mb-6">
          <p className="text-muted-foreground">
            You don't need to use everything here.
            <br />
            Most people start with just one thing:
          </p>
        </div>

        <div className="grid gap-3">
          {quickActions.map((action) => (
            <Link key={action.to} to={action.to}>
              <div className="p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center group-hover:scale-105 transition-transform">
                  <action.icon className={`w-5 h-5 ${action.color}`} />
                </div>
                <div className="text-left">
                  <h3 className="font-medium text-foreground">{action.title}</h3>
                  <p className="text-sm text-muted-foreground">{action.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* All Features Grid */}
      <section>
        <h2 className="text-lg font-medium text-foreground mb-4">All Features</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {features.map((feature) => (
            <Link key={feature.to} to={feature.to}>
              <div className="card-feature h-full">
                <feature.icon className="w-8 h-8 text-primary mb-3" />
                <h3 className="font-medium text-foreground mb-1">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Emergency Help - Always Visible */}
      <section>
        <Link to="/emergency">
          <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4 flex items-center gap-4 hover:bg-destructive/15 transition-colors">
            <div className="text-3xl">🆘</div>
            <div className="text-left">
              <h3 className="font-medium text-foreground">I Need Help Right Now</h3>
              <p className="text-sm text-muted-foreground">Crisis support, breathing exercises, and immediate help</p>
            </div>
          </div>
        </Link>
      </section>
    </div>
  );
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}
