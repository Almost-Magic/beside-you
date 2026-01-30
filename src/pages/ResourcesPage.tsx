import { Phone, ExternalLink, Heart, Users, DollarSign, Stethoscope, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { australianResources, crisisResources, SupportResource } from '@/data/resources';
import { useState } from 'react';

const categories = [
  { id: 'all', label: 'All', icon: Heart },
  { id: 'crisis', label: 'Crisis', icon: AlertTriangle },
  { id: 'emotional', label: 'Emotional', icon: Heart },
  { id: 'financial', label: 'Financial', icon: DollarSign },
  { id: 'practical', label: 'Practical', icon: Users },
  { id: 'medical', label: 'Medical', icon: Stethoscope },
];

export function ResourcesPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredResources = selectedCategory === 'all'
    ? australianResources
    : australianResources.filter(r => r.category === selectedCategory);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-foreground mb-2">Support Resources</h1>
        <p className="text-muted-foreground">
          Australian support services for patients and caregivers.
        </p>
      </div>

      {/* Crisis Resources - Always Visible */}
      <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4">
        <h2 className="font-medium text-foreground mb-3 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-destructive" />
          Crisis Support (24/7)
        </h2>
        <div className="grid gap-2 md:grid-cols-3">
          {crisisResources.map((resource) => (
            <a
              key={resource.id}
              href={`tel:${resource.phone?.replace(/\s/g, '')}`}
              className="flex items-center gap-3 p-3 bg-background rounded-lg hover:bg-muted transition-colors"
            >
              <Phone className="w-5 h-5 text-destructive" />
              <div>
                <p className="font-medium text-foreground text-sm">{resource.name}</p>
                <p className="text-sm text-primary">{resource.phone}</p>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 md:flex-wrap">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory(category.id)}
            className="shrink-0 gap-2"
          >
            <category.icon className="w-4 h-4" />
            {category.label}
          </Button>
        ))}
      </div>

      {/* Resources List */}
      <div className="space-y-4">
        {filteredResources
          .filter(r => r.category !== 'crisis') // Already shown above
          .map((resource) => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}
      </div>

      <div className="text-center py-4">
        <p className="text-sm text-muted-foreground">
          All resources are Australian and free to access.
        </p>
      </div>
    </div>
  );
}

function ResourceCard({ resource }: { resource: SupportResource }) {
  return (
    <div className="bg-card rounded-xl p-5 border border-border/50">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h3 className="font-medium text-foreground mb-1">{resource.name}</h3>
          <p className="text-sm text-muted-foreground mb-3">{resource.description}</p>
          
          <div className="flex flex-wrap gap-2">
            {resource.phone && (
              <a
                href={`tel:${resource.phone.replace(/\s/g, '')}`}
                className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
              >
                <Phone className="w-4 h-4" />
                {resource.phone}
              </a>
            )}
            {resource.website && (
              <a
                href={resource.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
              >
                <ExternalLink className="w-4 h-4" />
                Website
              </a>
            )}
          </div>
        </div>
        
        <div className="flex gap-1">
          {resource.forPatients && (
            <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">
              Patients
            </span>
          )}
          {resource.forCaregivers && (
            <span className="px-2 py-1 bg-accent/20 text-accent-foreground text-xs rounded">
              Caregivers
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
