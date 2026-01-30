import { useState, useRef, useEffect } from 'react';
import { Mic, Send, Bot, User, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useApp } from '@/contexts/AppContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export function CompanionPage() {
  const { profile, settings, acknowledgeAI } = useApp();
  const [showDisclaimer, setShowDisclaimer] = useState(!profile?.hasAcknowledgedAI);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [acknowledged, setAcknowledged] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleAcknowledge = async () => {
    if (acknowledged) {
      await acknowledgeAI();
      setShowDisclaimer(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Check for crisis keywords
    const crisisResponse = checkForCrisis(input);
    if (crisisResponse) {
      setTimeout(() => {
        setMessages((prev) => [...prev, {
          role: 'assistant',
          content: crisisResponse,
          timestamp: new Date(),
        }]);
        setIsLoading(false);
      }, 500);
      return;
    }

    // Generate response (using local responses for now)
    setTimeout(() => {
      const response = generateLocalResponse(input);
      setMessages((prev) => [...prev, {
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      }]);
      setIsLoading(false);
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] md:h-[calc(100vh-8rem)] animate-fade-in">
      {/* Disclaimer Modal */}
      <Dialog open={showDisclaimer} onOpenChange={() => {}}>
        <DialogContent className="max-w-md" onPointerDownOutside={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle>Before we begin</DialogTitle>
            <DialogDescription>
              The AI companion is here to support you — but it has limits.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 my-4">
            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">I CAN:</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>✓ Explain medical terms in plain language</li>
                <li>✓ Help you prepare questions for your care team</li>
                <li>✓ Listen when you need to talk</li>
                <li>✓ Offer comfort and emotional support</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">I CANNOT:</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>✗ Give medical advice</li>
                <li>✗ Diagnose symptoms</li>
                <li>✗ Tell you to change medications</li>
                <li>✗ Replace your doctors or care team</li>
              </ul>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
            <Checkbox
              id="acknowledge"
              checked={acknowledged}
              onCheckedChange={(checked) => setAcknowledged(checked === true)}
            />
            <label htmlFor="acknowledge" className="text-sm cursor-pointer">
              I understand this is not medical advice
            </label>
          </div>

          <Button 
            onClick={handleAcknowledge} 
            disabled={!acknowledged}
            className="w-full mt-4"
          >
            Start Conversation
          </Button>
        </DialogContent>
      </Dialog>

      {/* Header */}
      <div className="mb-4">
        <h1 className="text-2xl font-semibold text-foreground mb-1">AI Companion</h1>
        <p className="text-muted-foreground">
          A gentle companion to help you understand and feel supported
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center max-w-sm">
              <Bot className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                How can I help you today?
              </h3>
              <p className="text-muted-foreground text-sm mb-4">
                You can ask me to explain medical terms, help prepare for appointments,
                or just talk through how you are feeling.
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                <SuggestedQuestion 
                  text="What is chemotherapy?" 
                  onClick={() => setInput("What is chemotherapy?")} 
                />
                <SuggestedQuestion 
                  text="I am scared about my scan" 
                  onClick={() => setInput("I'm scared about my scan results")} 
                />
                <SuggestedQuestion 
                  text="Help me prepare for my oncologist" 
                  onClick={() => setInput("Help me prepare questions for my oncologist appointment")} 
                />
              </div>
            </div>
          </div>
        ) : (
          messages.map((message, index) => (
            <ChatMessage key={index} message={message} />
          ))
        )}
        {isLoading && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm">Thinking...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-border pt-4">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message or ask a question..."
              className="min-h-[60px] resize-none pr-12"
              disabled={isLoading}
            />
            <Button
              size="icon"
              variant="ghost"
              className="absolute right-2 top-2 btn-voice h-10 w-10"
              disabled={isLoading}
            >
              <Mic className="w-5 h-5" />
            </Button>
          </div>
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            size="icon"
            className="h-[60px] w-[60px]"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          I can explain and support, but I cannot give medical advice. 
          Always talk to your care team about treatment.
        </p>
      </div>
    </div>
  );
}

function ChatMessage({ message }: { message: Message }) {
  const isUser = message.role === 'user';
  
  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
        isUser ? 'bg-primary' : 'bg-muted'
      }`}>
        {isUser ? (
          <User className="w-4 h-4 text-primary-foreground" />
        ) : (
          <Bot className="w-4 h-4 text-muted-foreground" />
        )}
      </div>
      <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
        isUser 
          ? 'bg-primary text-primary-foreground rounded-tr-sm' 
          : 'bg-muted text-foreground rounded-tl-sm'
      }`}>
        <p className="whitespace-pre-wrap">{message.content}</p>
      </div>
    </div>
  );
}

function SuggestedQuestion({ text, onClick }: { text: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="px-3 py-2 text-sm bg-muted rounded-full hover:bg-muted/80 transition-colors text-foreground"
    >
      {text}
    </button>
  );
}

function checkForCrisis(input: string): string | null {
  const lowerInput = input.toLowerCase();
  
  const suicidalPatterns = [
    'want to die', 'kill myself', 'end it all', 'suicid',
    "don't want to live", "don't want to be here", 'better off dead'
  ];
  
  const emergencyPatterns = [
    "can't breathe", 'chest pain', 'severe pain', 'emergency'
  ];

  if (suicidalPatterns.some(pattern => lowerInput.includes(pattern))) {
    return `I can hear that you're in a really dark place right now. These feelings are serious, and you deserve support from someone trained to help.

Please reach out right now:

🆘 Lifeline: 13 11 14 (24/7)
🆘 Suicide Call Back: 1300 659 467
🆘 Beyond Blue: 1300 22 4636

If you're in immediate danger, please call 000.

You matter. Please reach out.`;
  }

  if (emergencyPatterns.some(pattern => lowerInput.includes(pattern))) {
    return `This sounds like it might be a medical emergency.

🚨 If you're experiencing severe symptoms, please:

• Call 000 immediately
• Go to your nearest emergency department
• Contact your cancer care team's emergency line

Don't wait to see if it gets better. Please get help now.`;
  }

  return null;
}

function generateLocalResponse(input: string): string {
  const lowerInput = input.toLowerCase();

  if (lowerInput.includes('scared') || lowerInput.includes('afraid') || lowerInput.includes('worry')) {
    return `It's completely okay to feel scared. Cancer brings so many unknowns, and fear is a natural response to uncertainty.

Your feelings are valid. Being scared doesn't mean you're not strong — it means you're human.

Would you like to talk more about what's worrying you? Or would a grounding exercise help right now?`;
  }

  if (lowerInput.includes('chemotherapy') || lowerInput.includes('chemo')) {
    return `Chemotherapy uses medicines to kill cancer cells or stop them from growing. It can be given as tablets, injections, or through a drip into your vein.

Because it travels through your whole body, it can cause side effects in areas that don't have cancer. But there are good medications to help manage most side effects.

Would you like to know more about:
• Common side effects and how to manage them?
• Questions to ask your care team about chemo?`;
  }

  if (lowerInput.includes('appointment') || lowerInput.includes('oncologist') || lowerInput.includes('doctor')) {
    return `Here are some questions you might want to ask at your appointment:

1. What are my treatment options?
2. What are the side effects I should expect?
3. How long will treatment take?
4. What should I do if I have problems between appointments?
5. Is there anything I should avoid during treatment?

Would you like me to help you think of more specific questions based on your situation?`;
  }

  if (lowerInput.includes('tired') || lowerInput.includes('fatigue') || lowerInput.includes('exhausted')) {
    return `Cancer-related fatigue is different from normal tiredness. It can feel overwhelming and doesn't go away with rest. Please know this is very common — you're not alone in feeling this way.

Some things that might help:
• Gentle movement, even just a short walk
• Pacing yourself — don't try to do everything at once
• Good nutrition and staying hydrated
• Talking to your care team about how severe it is

Your care team may be able to help find what's causing it and how to manage it better.`;
  }

  // Default response
  return `I'm here to listen and help however I can.

I can help you:
• Understand medical terms in plain language
• Prepare questions for your appointments
• Find Australian support resources
• Just talk through how you're feeling

What would be most helpful right now?`;
}
