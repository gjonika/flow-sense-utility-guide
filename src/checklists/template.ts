
export interface ChecklistQuestion {
  id: string;
  category: string;
  question: string;
  required: boolean;
  answer?: 'yes' | 'no' | 'n/a';
  note?: string;
  media?: File[];
}

export const DEFAULT_COMPLIANCE_CHECKLIST: ChecklistQuestion[] = [
  // Fire Safety
  {
    id: 'fire-001',
    category: 'Fire Safety',
    question: 'Are smoke detectors installed and functional in all required areas?',
    required: true
  },
  {
    id: 'fire-002',
    category: 'Fire Safety',
    question: 'Are fire extinguishers properly mounted and inspected?',
    required: true
  },
  {
    id: 'fire-003',
    category: 'Fire Safety',
    question: 'Are emergency exits clearly marked and unobstructed?',
    required: true
  },
  {
    id: 'fire-004',
    category: 'Fire Safety',
    question: 'Is the fire suppression system operational and tested?',
    required: true
  },

  // Life Safety
  {
    id: 'life-001',
    category: 'Life Safety',
    question: 'Are life jackets available and accessible for all passengers?',
    required: true
  },
  {
    id: 'life-002',
    category: 'Life Safety',
    question: 'Are lifeboats properly secured and equipped?',
    required: true
  },
  {
    id: 'life-003',
    category: 'Life Safety',
    question: 'Is emergency lighting functional throughout the vessel?',
    required: false
  },
  {
    id: 'life-004',
    category: 'Life Safety',
    question: 'Are muster stations clearly marked and accessible?',
    required: true
  },

  // Navigation
  {
    id: 'nav-001',
    category: 'Navigation',
    question: 'Are all navigation instruments calibrated and operational?',
    required: true
  },
  {
    id: 'nav-002',
    category: 'Navigation',
    question: 'Are radio communication systems tested and functional?',
    required: true
  },
  {
    id: 'nav-003',
    category: 'Navigation',
    question: 'Is GPS and backup navigation equipment operational?',
    required: true
  },

  // Hull & Structure
  {
    id: 'hull-001',
    category: 'Hull & Structure',
    question: 'Are watertight doors and hatches properly sealed?',
    required: true
  },
  {
    id: 'hull-002',
    category: 'Hull & Structure',
    question: 'Is the hull free from significant corrosion or damage?',
    required: false
  },
  {
    id: 'hull-003',
    category: 'Hull & Structure',
    question: 'Are structural welds and joints in good condition?',
    required: true
  },

  // Machinery
  {
    id: 'mach-001',
    category: 'Machinery',
    question: 'Are engine room ventilation systems operational?',
    required: true
  },
  {
    id: 'mach-002',
    category: 'Machinery',
    question: 'Are fuel lines and connections leak-free?',
    required: true
  },
  {
    id: 'mach-003',
    category: 'Machinery',
    question: 'Is emergency power generation equipment functional?',
    required: true
  },

  // Environmental
  {
    id: 'env-001',
    category: 'Environmental',
    question: 'Are waste management systems properly functioning?',
    required: true
  },
  {
    id: 'env-002',
    category: 'Environmental',
    question: 'Is bilge water separation equipment operational?',
    required: true
  },

  // Crew Areas
  {
    id: 'crew-001',
    category: 'Crew Areas',
    question: 'Are crew quarters properly ventilated and safe?',
    required: false
  },
  {
    id: 'crew-002',
    category: 'Crew Areas',
    question: 'Are galley facilities clean and equipment functional?',
    required: true
  }
];

export const getChecklistByCategory = () => {
  const categorized: { [key: string]: ChecklistQuestion[] } = {};
  
  DEFAULT_COMPLIANCE_CHECKLIST.forEach(question => {
    if (!categorized[question.category]) {
      categorized[question.category] = [];
    }
    categorized[question.category].push(question);
  });
  
  return categorized;
};

export const initializeChecklistForSurvey = (surveyId: string): ChecklistQuestion[] => {
  return DEFAULT_COMPLIANCE_CHECKLIST.map(question => ({
    ...question,
    answer: undefined,
    note: '',
    media: []
  }));
};
