
import { AssessmentItem } from '@/types/assessment';

export const INSULATION_ASSESSMENT_ITEMS: AssessmentItem[] = [
  {
    id: 'insulation-wall-existing',
    category: 'Wall Insulation',
    item: 'Wall insulation type and condition',
    question: 'Wall insulation type and condition',
    description: 'Assess existing wall insulation material, thickness, and condition',
    isPriority: false,
    estimatedHours: 0.5,
    status: 'pending',
    notes: '',
    plannedMaterial: '',
    actionRequired: 'replace',
    installationNotes: '',
    levelingPrepEstimate: '',
    markForEarlyProcurement: false,
    thermalRating: '',
    fireRating: '',
    moistureProtection: false,
    accessibilityNotes: ''
  },
  {
    id: 'insulation-ceiling-existing',
    category: 'Ceiling Insulation',
    item: 'Ceiling insulation assessment',
    question: 'Ceiling insulation assessment',
    description: 'Evaluate ceiling insulation type, thickness, and thermal performance',
    isPriority: false,
    estimatedHours: 0.5,
    status: 'pending',
    notes: '',
    plannedMaterial: '',
    actionRequired: 'replace',
    installationNotes: '',
    levelingPrepEstimate: '',
    markForEarlyProcurement: false,
    thermalRating: '',
    fireRating: '',
    moistureProtection: false,
    accessibilityNotes: ''
  },
  {
    id: 'insulation-floor-existing',
    category: 'Floor Insulation',
    item: 'Floor/subfloor insulation evaluation',
    question: 'Floor/subfloor insulation evaluation',
    description: 'Check floor insulation materials and soundproofing effectiveness',
    isPriority: false,
    estimatedHours: 0.5,
    status: 'pending',
    notes: '',
    plannedMaterial: '',
    actionRequired: 'replace',
    installationNotes: '',
    levelingPrepEstimate: '',
    markForEarlyProcurement: false,
    thermalRating: '',
    fireRating: '',
    moistureProtection: false,
    accessibilityNotes: ''
  },
  {
    id: 'insulation-thermal-bridging',
    category: 'Thermal Performance',
    item: 'Thermal bridging assessment',
    question: 'Thermal bridging assessment',
    description: 'Identify thermal bridges and heat loss areas',
    isPriority: true,
    estimatedHours: 1,
    status: 'pending',
    notes: '',
    plannedMaterial: '',
    actionRequired: 'replace',
    installationNotes: '',
    levelingPrepEstimate: '',
    markForEarlyProcurement: false,
    thermalRating: '',
    fireRating: '',
    moistureProtection: false,
    accessibilityNotes: ''
  },
  {
    id: 'insulation-sound-dampening',
    category: 'Acoustic Insulation',
    item: 'Sound dampening materials',
    question: 'Sound dampening materials',
    description: 'Evaluate acoustic insulation for noise control between spaces',
    isPriority: false,
    estimatedHours: 0.75,
    status: 'pending',
    notes: '',
    plannedMaterial: '',
    actionRequired: 'replace',
    installationNotes: '',
    levelingPrepEstimate: '',
    markForEarlyProcurement: false,
    thermalRating: '',
    fireRating: '',
    moistureProtection: false,
    accessibilityNotes: ''
  },
  {
    id: 'insulation-fire-protection',
    category: 'Fire Protection',
    item: 'Fire-rated insulation compliance',
    question: 'Fire-rated insulation compliance',
    description: 'Verify insulation meets fire safety requirements and ratings',
    isPriority: true,
    estimatedHours: 1,
    status: 'pending',
    notes: '',
    plannedMaterial: '',
    actionRequired: 'replace',
    installationNotes: '',
    levelingPrepEstimate: '',
    markForEarlyProcurement: false,
    thermalRating: '',
    fireRating: '',
    moistureProtection: false,
    accessibilityNotes: ''
  }
];
