
import { ChecklistResponse } from '@/types/checklist';
import { initializeChecklistForSurvey } from './checklistTemplates';

// Re-export for backward compatibility
export { initializeChecklistForSurvey } from './checklistTemplates';
export { CHECKLIST_TEMPLATES } from './checklistTemplates';

// Backward compatibility wrapper
export const DEFAULT_COMPLIANCE_CHECKLIST = [
  {
    id: 'fire_safety_001',
    category: 'Fire Safety',
    question: 'Are fire detection systems operational and tested?',
    required: true
  },
  {
    id: 'fire_safety_002',
    category: 'Fire Safety',
    question: 'Are fire suppression systems properly maintained?',
    required: true
  },
  {
    id: 'emergency_001',
    category: 'Emergency Equipment',
    question: 'Are life jackets available and in good condition?',
    required: true
  },
  {
    id: 'emergency_002',
    category: 'Emergency Equipment',
    question: 'Are emergency evacuation routes clearly marked?',
    required: true
  },
  {
    id: 'structural_001',
    category: 'Structural Integrity',
    question: 'Is the hull structure free from visible damage?',
    required: true
  }
];
