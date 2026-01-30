import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/AppContext';
import { Heart, Shield, Users, BookOpen, MessageCircle, Sparkles, Leaf } from 'lucide-react';

type OnboardingStep = 'welcome' | 'role' | 'features' | 'ready';

export function Onboarding() {
  const [step, setStep] = useState<OnboardingStep>('welcome');
  const { completeOnboarding } = useApp();

  const handleRoleSelect = async (role: 'patient' | 'caregiver' | 'supporter') => {
    await completeOnboarding(role);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {step === 'welcome' && (
          <WelcomeStep onContinue={() => setStep('role')} />
        )}
        {step === 'role' && (
          <RoleStep 
            onSelect={(role) => {
              handleRoleSelect(role);
            }}
            onBack={() => setStep('welcome')}
          />
        )}
      </div>
    </div>
  );
}

function WelcomeStep({ onContinue }: { onContinue: () => void }) {
  return (
    <div className="text-center animate-fade-in">
      <div className="mb-8">
        <div className="w-20 h-20 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center">
          <Leaf className="w-10 h-10 text-primary" />
        </div>
        <h1 className="text-3xl font-semibold text-foreground mb-2">
          Welcome to BesideYou
        </h1>
        <p className="text-lg text-muted-foreground">
          A companion for the cancer journey.
          <br />
          Free, private, and always here.
        </p>
      </div>

      <div className="bg-card rounded-xl p-6 mb-8 text-left border border-border/50">
        <div className="flex items-start gap-3 mb-4">
          <Shield className="w-5 h-5 text-primary mt-0.5 shrink-0" />
          <div>
            <h3 className="font-medium text-foreground">Your privacy matters</h3>
            <p className="text-muted-foreground text-sm mt-1">
              Everything you create here stays on this device.
              We never see your data. We can't.
            </p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground pl-8">
          Your memories, your symptoms, your notes — they're yours alone.
        </p>
      </div>

      <Button
        onClick={onContinue}
        size="lg"
        className="w-full py-6 text-lg"
      >
        Continue
      </Button>
    </div>
  );
}

interface RoleStepProps {
  onSelect: (role: 'patient' | 'caregiver' | 'supporter') => void;
  onBack: () => void;
}

function RoleStep({ onSelect, onBack }: RoleStepProps) {
  return (
    <div className="animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-foreground mb-2">
          Who will be using BesideYou?
        </h2>
        <p className="text-muted-foreground">
          This helps us personalise your experience
        </p>
      </div>

      <div className="space-y-4 mb-8">
        <RoleCard
          icon={Heart}
          iconColor="text-rose-500"
          title="I am a patient"
          description="I'm navigating my own cancer journey."
          onClick={() => onSelect('patient')}
        />
        <RoleCard
          icon={Users}
          iconColor="text-blue-500"
          title="I am a caregiver"
          description="I'm caring for someone with cancer."
          onClick={() => onSelect('caregiver')}
        />
        <RoleCard
          icon={Sparkles}
          iconColor="text-emerald-500"
          title="I'm supporting someone"
          description="A friend or family member has cancer."
          onClick={() => onSelect('supporter')}
        />
      </div>

      <button
        onClick={onBack}
        className="w-full text-center text-muted-foreground hover:text-foreground transition-colors py-2"
      >
        Go back
      </button>
    </div>
  );
}

interface RoleCardProps {
  icon: React.ElementType;
  iconColor: string;
  title: string;
  description: string;
  onClick: () => void;
}

function RoleCard({ icon: Icon, iconColor, title, description, onClick }: RoleCardProps) {
  return (
    <button
      onClick={onClick}
      className="w-full p-5 bg-card rounded-xl border border-border/50 text-left hover:border-primary/30 hover:bg-card/80 transition-all duration-200 group"
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center group-hover:scale-105 transition-transform">
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
        <div>
          <h3 className="font-medium text-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
    </button>
  );
}

function FeaturesStep({ onContinue }: { onContinue: () => void }) {
  const features = [
    { icon: BookOpen, title: 'Understand', description: 'Look up medical terms in plain language. 1,499 terms explained simply.' },
    { icon: MessageCircle, title: 'Prepare', description: 'Get ready for appointments with questions to ask your care team.' },
    { icon: Heart, title: 'Track', description: "Log symptoms, medications, and how you're feeling over time." },
    { icon: Sparkles, title: 'Remember', description: 'Collect good days, small moments, and things worth holding onto.' },
  ];

  return (
    <div className="animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-foreground mb-2">
          Here&apos;s what BesideYou offers
        </h2>
      </div>

      <div className="space-y-4 mb-8">
        {features.map((feature, index) => (
          <div key={index} className="flex items-start gap-4 p-4 bg-card rounded-lg border border-border/30">
            <feature.icon className="w-5 h-5 text-primary mt-0.5 shrink-0" />
            <div>
              <h3 className="font-medium text-foreground">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>

      <Button
        onClick={onContinue}
        size="lg"
        className="w-full py-6 text-lg"
      >
        Get Started
      </Button>
    </div>
  );
}
