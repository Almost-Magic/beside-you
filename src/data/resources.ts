export interface SupportResource {
  id: string;
  name: string;
  phone?: string;
  website?: string;
  description: string;
  category: 'crisis' | 'financial' | 'practical' | 'emotional' | 'medical';
  forPatients: boolean;
  forCaregivers: boolean;
}

export const australianResources: SupportResource[] = [
  // Crisis Resources (always shown first)
  {
    id: 'lifeline',
    name: 'Lifeline',
    phone: '13 11 14',
    website: 'https://www.lifeline.org.au',
    description: '24/7 crisis support and suicide prevention. Someone is always there to listen.',
    category: 'crisis',
    forPatients: true,
    forCaregivers: true,
  },
  {
    id: 'cancer-council',
    name: 'Cancer Council Helpline',
    phone: '13 11 20',
    website: 'https://www.cancer.org.au',
    description: 'Free, confidential support from cancer nurses. Information about treatment, managing side effects, and practical support.',
    category: 'crisis',
    forPatients: true,
    forCaregivers: true,
  },
  {
    id: 'beyond-blue',
    name: 'Beyond Blue',
    phone: '1300 22 4636',
    website: 'https://www.beyondblue.org.au',
    description: '24/7 support for anxiety, depression, and emotional wellbeing.',
    category: 'crisis',
    forPatients: true,
    forCaregivers: true,
  },

  // Emotional Support
  {
    id: 'cancer-council-counselling',
    name: 'Cancer Council Counselling',
    phone: '13 11 20',
    website: 'https://www.cancer.org.au/support-and-services/cancer-council-support',
    description: 'Free counselling for people affected by cancer. Available in person, by phone, or online.',
    category: 'emotional',
    forPatients: true,
    forCaregivers: true,
  },
  {
    id: 'look-good-feel-better',
    name: 'Look Good Feel Better',
    phone: '1800 650 960',
    website: 'https://lgfb.org.au',
    description: 'Free workshops helping people manage the appearance-related effects of cancer treatment.',
    category: 'emotional',
    forPatients: true,
    forCaregivers: false,
  },

  // Financial Support
  {
    id: 'centrelink',
    name: 'Centrelink',
    phone: '132 717',
    website: 'https://www.servicesaustralia.gov.au/cancer',
    description: 'Government support payments and services for people affected by cancer.',
    category: 'financial',
    forPatients: true,
    forCaregivers: true,
  },
  {
    id: 'cancer-council-financial',
    name: 'Cancer Council Financial Assistance',
    phone: '13 11 20',
    website: 'https://www.cancer.org.au/support-and-services/practical-support/financial-assistance',
    description: 'Grants and support for people experiencing financial hardship due to cancer.',
    category: 'financial',
    forPatients: true,
    forCaregivers: true,
  },

  // Practical Support
  {
    id: 'transport-treatment',
    name: 'Transport to Treatment',
    phone: '13 11 20',
    website: 'https://www.cancer.org.au/support-and-services/practical-support/transport',
    description: 'Help getting to and from cancer treatment appointments.',
    category: 'practical',
    forPatients: true,
    forCaregivers: false,
  },
  {
    id: 'accommodation',
    name: 'Accommodation Assistance',
    phone: '13 11 20',
    website: 'https://www.cancer.org.au/support-and-services/practical-support/accommodation',
    description: 'Low-cost accommodation for people who need to travel for treatment.',
    category: 'practical',
    forPatients: true,
    forCaregivers: true,
  },
  {
    id: 'carer-gateway',
    name: 'Carer Gateway',
    phone: '1800 422 737',
    website: 'https://www.carergateway.gov.au',
    description: 'Australian Government support for carers including respite, counselling, and practical assistance.',
    category: 'practical',
    forPatients: false,
    forCaregivers: true,
  },

  // Medical Information
  {
    id: 'eviq',
    name: 'eviQ',
    website: 'https://www.eviq.org.au/patients-and-carers',
    description: 'Reliable, evidence-based cancer treatment information written for patients.',
    category: 'medical',
    forPatients: true,
    forCaregivers: true,
  },
  {
    id: 'bcna',
    name: 'Breast Cancer Network Australia',
    phone: '1800 500 258',
    website: 'https://www.bcna.org.au',
    description: 'Support and information specifically for people affected by breast cancer.',
    category: 'medical',
    forPatients: true,
    forCaregivers: true,
  },
  {
    id: 'pcfa',
    name: 'Prostate Cancer Foundation of Australia',
    phone: '1800 22 00 99',
    website: 'https://www.prostate.org.au',
    description: 'Support and information for people affected by prostate cancer.',
    category: 'medical',
    forPatients: true,
    forCaregivers: true,
  },
];

export const crisisResources = australianResources.filter(r => r.category === 'crisis');

export function getResourcesByCategory(category: string, role?: 'patient' | 'caregiver'): SupportResource[] {
  return australianResources.filter(resource => {
    if (category !== 'all' && resource.category !== category) return false;
    if (role === 'patient' && !resource.forPatients) return false;
    if (role === 'caregiver' && !resource.forCaregivers) return false;
    return true;
  });
}
