import { useState } from 'react';
import { Search, Star, ChevronRight, BookOpen } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { glossaryTerms, glossaryCategories, searchGlossary, GlossaryTerm } from '@/data/glossary';
import { cn } from '@/lib/utils';

export function GlossaryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTerm, setSelectedTerm] = useState<GlossaryTerm | null>(null);

  const filteredTerms = searchGlossary(searchQuery, selectedCategory);

  if (selectedTerm) {
    return (
      <GlossaryDetail 
        term={selectedTerm} 
        onBack={() => setSelectedTerm(null)} 
      />
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-foreground mb-2">Medical Glossary</h1>
        <p className="text-muted-foreground">
          Medical terms explained in plain language. Tap any term to learn more.
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search for a term..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 h-12 text-base"
        />
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 md:flex-wrap">
        {glossaryCategories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory(category.id)}
            className="shrink-0"
          >
            {category.label}
          </Button>
        ))}
      </div>

      {/* Results */}
      <div className="space-y-2">
        {filteredTerms.length === 0 ? (
          <div className="empty-state">
            <BookOpen className="empty-state-icon" />
            <h3 className="text-lg font-medium text-foreground mb-2">No terms found</h3>
            <p className="text-muted-foreground">
              Try a different search term or browse all categories.
            </p>
          </div>
        ) : (
          <>
            <p className="text-sm text-muted-foreground">
              {filteredTerms.length} term{filteredTerms.length !== 1 ? 's' : ''} found
            </p>
            {filteredTerms.map((term) => (
              <button
                key={term.id}
                onClick={() => setSelectedTerm(term)}
                className="glossary-term w-full text-left flex items-center justify-between group"
              >
                <div>
                  <h3 className="font-medium text-foreground group-hover:text-primary transition-colors">
                    {term.term}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {term.plainExplanation}
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </button>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

interface GlossaryDetailProps {
  term: GlossaryTerm;
  onBack: () => void;
}

function GlossaryDetail({ term, onBack }: GlossaryDetailProps) {
  return (
    <div className="space-y-6 animate-fade-in">
      <Button variant="ghost" onClick={onBack} className="gap-2 -ml-2">
        ← Back to glossary
      </Button>

      <div>
        <h1 className="text-3xl font-semibold text-foreground mb-1">{term.term}</h1>
        {term.pronunciation && (
          <p className="text-muted-foreground italic">{term.pronunciation}</p>
        )}
      </div>

      <div className="bg-card rounded-xl p-6 border border-border/50">
        <h2 className="font-medium text-foreground mb-3">In plain language</h2>
        <p className="text-foreground leading-relaxed">{term.plainExplanation}</p>
      </div>

      {term.doctorMightSay && term.doctorMightSay.length > 0 && (
        <div className="bg-muted/50 rounded-xl p-6">
          <h2 className="font-medium text-foreground mb-3">Your doctor might say</h2>
          <ul className="space-y-2">
            {term.doctorMightSay.map((phrase, index) => (
              <li key={index} className="flex items-start gap-2 text-muted-foreground">
                <span className="text-primary">"</span>
                <span>{phrase}</span>
                <span className="text-primary">"</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {term.youCanAsk && term.youCanAsk.length > 0 && (
        <div className="bg-primary/5 rounded-xl p-6">
          <h2 className="font-medium text-foreground mb-3">Questions you can ask</h2>
          <ul className="space-y-2">
            {term.youCanAsk.map((question, index) => (
              <li key={index} className="flex items-start gap-2 text-foreground">
                <span className="text-primary shrink-0">•</span>
                <span>{question}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {term.relatedTerms && term.relatedTerms.length > 0 && (
        <div>
          <h2 className="font-medium text-foreground mb-3">Related terms</h2>
          <div className="flex flex-wrap gap-2">
            {term.relatedTerms.map((related) => (
              <span
                key={related}
                className="px-3 py-1 bg-muted rounded-full text-sm text-muted-foreground"
              >
                {related.replace(/-/g, ' ')}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="pt-4 border-t border-border">
        <p className="text-sm text-muted-foreground">
          <strong>Remember:</strong> This information is general. Always discuss your specific situation with your care team.
        </p>
      </div>
    </div>
  );
}
