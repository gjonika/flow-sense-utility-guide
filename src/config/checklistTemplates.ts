
import { ChecklistResponse } from '@/types/checklist';

export interface ChecklistTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  industry: string;
  questions: {
    id: string;
    category: string;
    subcategory?: string;
    question: string;
    required: boolean;
    compliance_standards?: string[];
  }[];
}

export const CHECKLIST_TEMPLATES: ChecklistTemplate[] = [
  {
    id: 'maritime_solas',
    name: 'SOLAS Maritime Safety',
    description: 'Standard SOLAS compliance checklist for vessel inspections',
    category: 'safety',
    industry: 'maritime',
    questions: [
      {
        id: 'fire_safety_001',
        category: 'Fire Safety',
        subcategory: 'Detection Systems',
        question: 'Are fire detection systems operational and tested?',
        required: true,
        compliance_standards: ['SOLAS', 'DNV']
      },
      {
        id: 'fire_safety_002',
        category: 'Fire Safety',
        subcategory: 'Suppression Systems',
        question: 'Are fire suppression systems properly maintained?',
        required: true,
        compliance_standards: ['SOLAS']
      },
      {
        id: 'emergency_001',
        category: 'Emergency Equipment',
        subcategory: 'Life Jackets',
        question: 'Are life jackets available and in good condition?',
        required: true,
        compliance_standards: ['SOLAS', 'IMO']
      },
      {
        id: 'emergency_002',
        category: 'Emergency Equipment',
        subcategory: 'Evacuation Routes',
        question: 'Are emergency evacuation routes clearly marked?',
        required: true,
        compliance_standards: ['SOLAS']
      },
      {
        id: 'structural_001',
        category: 'Structural Integrity',
        subcategory: 'Hull Condition',
        question: 'Is the hull structure free from visible damage?',
        required: true,
        compliance_standards: ['DNV', 'ABS']
      }
    ]
  },
  {
    id: 'offshore_oil_gas',
    name: 'Offshore Oil & Gas',
    description: 'Comprehensive inspection checklist for offshore platforms',
    category: 'industrial',
    industry: 'oil_gas',
    questions: [
      {
        id: 'pressure_001',
        category: 'Pressure Systems',
        subcategory: 'Pipelines',
        question: 'Are pipeline pressure readings within safe limits?',
        required: true,
        compliance_standards: ['API', 'NORSOK']
      },
      {
        id: 'safety_001',
        category: 'Safety Systems',
        subcategory: 'Gas Detection',
        question: 'Are gas detection systems calibrated and functional?',
        required: true,
        compliance_standards: ['API', 'ISO']
      },
      {
        id: 'environmental_001',
        category: 'Environmental',
        subcategory: 'Waste Management',
        question: 'Are waste disposal procedures being followed?',
        required: false,
        compliance_standards: ['MARPOL', 'EPA']
      }
    ]
  },
  {
    id: 'commercial_vessel',
    name: 'Commercial Vessel',
    description: 'Standard commercial vessel inspection checklist',
    category: 'commercial',
    industry: 'maritime',
    questions: [
      {
        id: 'cargo_001',
        category: 'Cargo Operations',
        subcategory: 'Loading Equipment',
        question: 'Is cargo loading equipment properly maintained?',
        required: true,
        compliance_standards: ['IMO', 'ISM']
      },
      {
        id: 'navigation_001',
        category: 'Navigation',
        subcategory: 'Bridge Equipment',
        question: 'Are navigation systems operational and calibrated?',
        required: true,
        compliance_standards: ['SOLAS', 'IMO']
      }
    ]
  }
];

export const initializeChecklistForSurvey = (surveyId: string, templateId?: string): ChecklistResponse[] => {
  const template = templateId 
    ? CHECKLIST_TEMPLATES.find(t => t.id === templateId)
    : CHECKLIST_TEMPLATES[0]; // Default to SOLAS

  if (!template) {
    console.warn(`[Checklist] Template ${templateId} not found, using default`);
    return initializeChecklistForSurvey(surveyId, CHECKLIST_TEMPLATES[0].id);
  }

  return template.questions.map(question => ({
    id: `${surveyId}_${question.id}`,
    survey_id: surveyId,
    zone_id: null,
    template_id: template.id,
    question_id: question.id,
    question_category: question.category,
    question_text: question.question,
    response_type: 'na' as const,
    is_mandatory: question.required,
    notes: '',
    asset_tag: '',
    qr_code: '',
    rfid_tag: '',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    needs_sync: true
  }));
};

export const validateChecklistIntegrity = (responses: ChecklistResponse[]): {
  isValid: boolean;
  errors: string[];
  canRestore: boolean;
} => {
  const errors: string[] = [];
  
  if (!Array.isArray(responses)) {
    errors.push('Checklist responses is not an array');
    return { isValid: false, errors, canRestore: true };
  }

  if (responses.length === 0) {
    errors.push('Checklist is empty');
    return { isValid: false, errors, canRestore: true };
  }

  // Check for required fields
  responses.forEach((response, index) => {
    if (!response.id) errors.push(`Response ${index + 1}: Missing ID`);
    if (!response.survey_id) errors.push(`Response ${index + 1}: Missing survey_id`);
    if (!response.question_id) errors.push(`Response ${index + 1}: Missing question_id`);
    if (!response.question_category) errors.push(`Response ${index + 1}: Missing question_category`);
  });

  // Check for duplicates
  const questionIds = responses.map(r => r.question_id);
  const duplicates = questionIds.filter((id, index) => questionIds.indexOf(id) !== index);
  if (duplicates.length > 0) {
    errors.push(`Duplicate questions found: ${duplicates.join(', ')}`);
  }

  return {
    isValid: errors.length === 0,
    errors,
    canRestore: true
  };
};

export const restoreChecklistFromTemplate = (surveyId: string, templateId?: string): ChecklistResponse[] => {
  console.log(`[Checklist] Restoring checklist for survey ${surveyId} with template ${templateId}`);
  return initializeChecklistForSurvey(surveyId, templateId);
};
