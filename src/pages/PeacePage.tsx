import { useState, useEffect } from 'react';
import { Heart, Wind, Pause, Play, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const quotes = [
  "You are still here. That matters.",
  "One moment at a time. That's all you need.",
  "It's okay to not be okay.",
  "You are stronger than you know.",
  "This moment will pass.",
  "You don't have to have it all figured out.",
  "Rest is not giving up. It's taking care.",
  "You are worthy of gentleness.",
];

export function PeacePage() {
  const [activeExercise, setActiveExercise] = useState<'breathing' | 'grounding' | null>(null);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-foreground mb-2">Moments of Peace</h1>
        <p className="text-muted-foreground">
          Take a moment. You deserve it.
        </p>
      </div>

      {/* Quote */}
      <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl p-8 text-center">
        <p className="text-xl text-foreground italic">
          "{quotes[Math.floor(Math.random() * quotes.length)]}"
        </p>
      </div>

      {/* Exercise Selection */}
      {!activeExercise ? (
        <div className="grid gap-4 md:grid-cols-2">
          <button
            onClick={() => setActiveExercise('breathing')}
            className="card-feature text-left group"
          >
            <Wind className="w-10 h-10 text-primary mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">Breathing Exercise</h3>
            <p className="text-muted-foreground">
              A gentle guided breathing exercise to help calm your nervous system.
            </p>
          </button>
          
          <button
            onClick={() => setActiveExercise('grounding')}
            className="card-feature text-left group"
          >
            <Heart className="w-10 h-10 text-rose-500 mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">Grounding Exercise</h3>
            <p className="text-muted-foreground">
              Connect with the present moment using your senses.
            </p>
          </button>
        </div>
      ) : activeExercise === 'breathing' ? (
        <BreathingExercise onClose={() => setActiveExercise(null)} />
      ) : (
        <GroundingExercise onClose={() => setActiveExercise(null)} />
      )}

      {/* Gentle Reminder */}
      <div className="text-center py-4">
        <p className="text-sm text-muted-foreground">
          It is okay to close this and come back later. No pressure.
        </p>
      </div>
    </div>
  );
}

function BreathingExercise({ onClose }: { onClose: () => void }) {
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale' | 'rest'>('inhale');
  const [isRunning, setIsRunning] = useState(true);
  const [cycleCount, setCycleCount] = useState(0);

  const phaseDurations = {
    inhale: 4000,
    hold: 4000,
    exhale: 4000,
    rest: 2000,
  };

  const phaseLabels = {
    inhale: 'Breathe in...',
    hold: 'Hold...',
    exhale: 'Breathe out...',
    rest: 'Rest...',
  };

  useEffect(() => {
    if (!isRunning) return;

    const timer = setTimeout(() => {
      switch (phase) {
        case 'inhale':
          setPhase('hold');
          break;
        case 'hold':
          setPhase('exhale');
          break;
        case 'exhale':
          setPhase('rest');
          break;
        case 'rest':
          setPhase('inhale');
          setCycleCount((c) => c + 1);
          break;
      }
    }, phaseDurations[phase]);

    return () => clearTimeout(timer);
  }, [phase, isRunning]);

  const circleSize = phase === 'inhale' || phase === 'hold' ? 'scale-110' : 'scale-100';

  return (
    <div className="bg-card rounded-xl p-8 border border-border/50 text-center">
      <h3 className="text-lg font-medium text-foreground mb-6">4-4-4 Breathing</h3>
      
      <div className="flex justify-center mb-8">
        <div
          className={cn(
            'w-48 h-48 rounded-full bg-primary/10 flex items-center justify-center transition-transform duration-[4000ms] ease-in-out',
            circleSize
          )}
        >
          <div className="text-center">
            <p className="text-2xl font-medium text-primary mb-1">{phaseLabels[phase]}</p>
            <p className="text-sm text-muted-foreground">Cycle {cycleCount + 1}</p>
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsRunning(!isRunning)}
        >
          {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => {
            setPhase('inhale');
            setCycleCount(0);
          }}
        >
          <RotateCcw className="w-4 h-4" />
        </Button>
        <Button variant="outline" onClick={onClose}>
          Done
        </Button>
      </div>

      <p className="text-sm text-muted-foreground mt-6">
        Breathe in for 4 seconds, hold for 4, breathe out for 4.
      </p>
    </div>
  );
}

function GroundingExercise({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(0);
  
  const steps = [
    { sense: '👀 See', prompt: 'Name 5 things you can see right now.' },
    { sense: '✋ Touch', prompt: 'Name 4 things you can touch or feel.' },
    { sense: '👂 Hear', prompt: 'Name 3 things you can hear.' },
    { sense: '👃 Smell', prompt: 'Name 2 things you can smell.' },
    { sense: '👅 Taste', prompt: 'Name 1 thing you can taste.' },
  ];

  const currentStep = steps[step];
  const isComplete = step >= steps.length;

  return (
    <div className="bg-card rounded-xl p-8 border border-border/50 text-center">
      <h3 className="text-lg font-medium text-foreground mb-6">5-4-3-2-1 Grounding</h3>
      
      {!isComplete ? (
        <>
          <div className="mb-8">
            <p className="text-4xl mb-4">{currentStep.sense}</p>
            <p className="text-xl text-foreground">{currentStep.prompt}</p>
          </div>

          <div className="flex justify-center gap-2 mb-6">
            {steps.map((_, index) => (
              <div
                key={index}
                className={cn(
                  'w-3 h-3 rounded-full transition-colors',
                  index < step ? 'bg-primary' : index === step ? 'bg-primary/50' : 'bg-muted'
                )}
              />
            ))}
          </div>

          <p className="text-sm text-muted-foreground mb-6">
            Take your time. There is no rush.
          </p>

          <div className="flex justify-center gap-4">
            {step > 0 && (
              <Button variant="outline" onClick={() => setStep(step - 1)}>
                Previous
              </Button>
            )}
            <Button onClick={() => setStep(step + 1)}>
              {step === steps.length - 1 ? 'Complete' : 'Next'}
            </Button>
          </div>
        </>
      ) : (
        <>
          <div className="text-6xl mb-6">💚</div>
          <p className="text-xl text-foreground mb-4">Well done.</p>
          <p className="text-muted-foreground mb-6">
            You have grounded yourself in this moment. 
            You are here. You are present.
          </p>
          <div className="flex justify-center gap-4">
            <Button variant="outline" onClick={() => setStep(0)}>
              Do Again
            </Button>
            <Button onClick={onClose}>
              Done
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
