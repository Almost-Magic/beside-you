import { NavLink, useLocation } from 'react-router-dom';
import { 
  Home, 
  BookOpen, 
  MessageCircle, 
  Activity, 
  Sparkles, 
  Heart,
  HelpCircle,
  Settings,
  Menu,
  X 
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const navItems = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/glossary', icon: BookOpen, label: 'Glossary' },
  { to: '/companion', icon: MessageCircle, label: 'Companion' },
  { to: '/symptoms', icon: Activity, label: 'Symptoms' },
  { to: '/good-days', icon: Sparkles, label: 'Good Days' },
  { to: '/peace', icon: Heart, label: 'Peace' },
  { to: '/resources', icon: HelpCircle, label: 'Resources' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex fixed left-0 top-0 h-full w-64 bg-sidebar border-r border-sidebar-border p-4 flex-col">
        <div className="mb-8 px-2">
          <h1 className="text-xl font-semibold text-sidebar-foreground flex items-center gap-2">
            <span className="text-2xl">🌿</span> BesideYou
          </h1>
          <p className="text-xs text-muted-foreground mt-1">Your cancer support companion</p>
        </div>

        <div className="flex-1 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'nav-item',
                  isActive && 'active'
                )
              }
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>

        {/* Emergency Button */}
        <div className="mt-auto pt-4 border-t border-sidebar-border">
          <NavLink to="/emergency">
            <Button variant="destructive" className="w-full justify-start gap-2">
              <span className="text-lg">🆘</span>
              I Need Help Now
            </Button>
          </NavLink>
        </div>
      </nav>

      {/* Mobile Header */}
      <header className="md:hidden fixed top-0 left-0 right-0 h-16 bg-background border-b border-border z-50 px-4 flex items-center justify-between">
        <h1 className="text-lg font-semibold flex items-center gap-2">
          <span>🌿</span> BesideYou
        </h1>
        
        <div className="flex items-center gap-2">
          <NavLink to="/emergency">
            <Button variant="destructive" size="sm" className="gap-1">
              <span>🆘</span>
              <span className="sr-only sm:not-sr-only">Help</span>
            </Button>
          </NavLink>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-16 bg-background z-40 animate-fade-in">
          <nav className="p-4 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  cn(
                    'nav-item',
                    isActive && 'active'
                  )
                }
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>
      )}

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-background border-t border-border z-50 flex items-center justify-around px-2">
        {navItems.slice(0, 5).map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center gap-1 p-2 rounded-lg transition-colors min-w-[60px]',
                isActive 
                  ? 'text-primary' 
                  : 'text-muted-foreground hover:text-foreground'
              )
            }
          >
            <item.icon className="w-5 h-5" />
            <span className="text-xs">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </>
  );
}

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="md:ml-64 pt-16 md:pt-0 pb-20 md:pb-0 min-h-screen">
        <div className="p-4 md:p-8 max-w-4xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
