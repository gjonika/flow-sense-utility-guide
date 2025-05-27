
import { AssessmentItem } from '@/types/assessment';

export const MATERIAL_ASSESSMENT_CHECKLIST: AssessmentItem[] = [
  // 1. Surfaces & Structure (includes insulation as sub-fields)
  {
    id: 'surfaces-001',
    category: 'Wall Materials',
    question: 'Wall Material & Insulation Assessment',
    isPriority: true,
    status: 'pending',
    notes: '',
    wallsAndCeilings: {}
  },
  {
    id: 'surfaces-002',
    category: 'Wall Materials',
    question: 'Bulkhead Structure & Fireproofing',
    isPriority: true,
    status: 'pending',
    notes: '',
    wallsAndCeilings: {}
  },
  // Add Wall Insulation Items
  {
    id: 'insulation-wall-existing',
    category: 'Wall Materials',
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
    id: 'surfaces-003',
    category: 'Ceiling Materials', 
    question: 'Ceiling Systems & Overhead Insulation',
    isPriority: true,
    status: 'pending',
    notes: '',
    wallsAndCeilings: {}
  },
  {
    id: 'surfaces-004',
    category: 'Ceiling Materials',
    question: 'Deckhead Finishes & Acoustic Treatment',
    isPriority: false,
    status: 'pending',
    notes: '',
    wallsAndCeilings: {}
  },
  // Add Ceiling Insulation Items
  {
    id: 'insulation-ceiling-existing',
    category: 'Ceiling Materials',
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
    id: 'surfaces-005',
    category: 'Flooring Systems',
    question: 'Top Covering & Deck Insulation Assessment',
    isPriority: true,
    status: 'pending',
    notes: '',
    flooring: {}
  },
  {
    id: 'surfaces-006',
    category: 'Flooring Systems',
    question: 'Subfloor Structure & Soundproofing',
    isPriority: true,
    status: 'pending',
    notes: '',
    flooring: {}
  },
  {
    id: 'surfaces-007',
    category: 'Flooring Systems',
    question: 'Leveling & Waterproofing Requirements',
    isPriority: false,
    status: 'pending',
    notes: '',
    flooring: {}
  },
  // Add Floor Insulation Items
  {
    id: 'insulation-floor-existing',
    category: 'Flooring Systems',
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
    id: 'insulation-sound-dampening',
    category: 'Flooring Systems',
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
    id: 'surfaces-008',
    category: 'Structural Elements',
    question: 'Load-bearing Elements Assessment',
    isPriority: false,
    status: 'pending',
    notes: '',
    wallsAndCeilings: {}
  },
  // Add Thermal Performance Item
  {
    id: 'insulation-thermal-bridging',
    category: 'Structural Elements',
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
    id: 'surfaces-009',
    category: 'Partitions',
    question: 'Movable Partitions & Room Dividers',
    isPriority: false,
    status: 'pending',
    notes: '',
    wallsAndCeilings: {}
  },

  // 2. Furniture & Fixtures
  {
    id: 'furniture-001',
    category: 'Fixed Furniture',
    question: 'Built-in Furniture Assessment',
    isPriority: false,
    status: 'pending',
    notes: '',
    furniture: {}
  },
  {
    id: 'furniture-002',
    category: 'Loose Furniture',
    question: 'Movable Furniture Inventory',
    isPriority: false,
    status: 'pending',
    notes: '',
    furniture: {}
  },
  {
    id: 'furniture-003',
    category: 'Built-in Storage',
    question: 'Cabinets & Storage Systems',
    isPriority: false,
    status: 'pending',
    notes: '',
    furniture: {}
  },
  {
    id: 'furniture-004',
    category: 'Upholstery & Soft Furnishings',
    question: 'Fabric & Hardware Condition',
    isPriority: false,
    status: 'pending',
    notes: '',
    furniture: {}
  },
  {
    id: 'furniture-005',
    category: 'Decorative Elements',
    question: 'Artwork & Decorative Fixtures',
    isPriority: false,
    status: 'pending',
    notes: '',
    furniture: {}
  },

  // 3. Wet Areas & Sanitary
  {
    id: 'wet-001',
    category: 'Wet Unit Systems',
    question: 'Bathroom Unit Configuration',
    isPriority: true,
    status: 'pending',
    notes: '',
    wetAreas: {}
  },
  {
    id: 'wet-002',
    category: 'Sanitary Fixtures',
    question: 'Toilets, Sinks & Shower Equipment',
    isPriority: true,
    status: 'pending',
    notes: '',
    wetAreas: {}
  },
  {
    id: 'wet-003',
    category: 'Waterproofing',
    question: 'Surface Finishes & Sealing',
    isPriority: true,
    status: 'pending',
    notes: '',
    wetAreas: {}
  },
  {
    id: 'wet-004',
    category: 'Drainage Systems',
    question: 'Plumbing & Slope Analysis',
    isPriority: true,
    status: 'pending',
    notes: '',
    wetAreas: {}
  },
  {
    id: 'wet-005',
    category: 'Ventilation (Wet Areas)',
    question: 'Exhaust & Air Circulation',
    isPriority: false,
    status: 'pending',
    notes: '',
    wetAreas: {}
  },

  // 4. Electrical & Lighting
  {
    id: 'electrical-001',
    category: 'Ceiling Lighting',
    question: 'Main Lighting Systems',
    isPriority: false,
    status: 'pending',
    notes: '',
    lightingElectrical: {}
  },
  {
    id: 'electrical-002',
    category: 'Emergency Lighting',
    question: 'Safety & Emergency Systems',
    isPriority: true,
    status: 'pending',
    notes: '',
    lightingElectrical: {}
  },
  {
    id: 'electrical-003',
    category: 'Electrical Outlets',
    question: 'Socket Layout & Power Distribution',
    isPriority: false,
    status: 'pending',
    notes: '',
    lightingElectrical: {}
  },
  {
    id: 'electrical-004',
    category: 'Switches & Controls',
    question: 'Control Systems Assessment',
    isPriority: false,
    status: 'pending',
    notes: '',
    lightingElectrical: {}
  },
  {
    id: 'electrical-005',
    category: 'Safety & Security Systems',
    question: 'Fire Detection & Security',
    isPriority: true,
    status: 'pending',
    notes: '',
    lightingElectrical: {}
  },
  // Add Fire Protection Insulation Item
  {
    id: 'insulation-fire-protection',
    category: 'Safety & Security Systems',
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
  },

  // 5. MEP Systems
  {
    id: 'mep-001',
    category: 'HVAC Systems',
    question: 'Air Conditioning & Ventilation',
    isPriority: false,
    status: 'pending',
    notes: '',
    hvacMepAccess: {}
  },
  {
    id: 'mep-002',
    category: 'Piping & Plumbing',
    question: 'Water Supply & Waste Systems',
    isPriority: true,
    status: 'pending',
    notes: '',
    hvacMepAccess: {}
  },
  {
    id: 'mep-003',
    category: 'Ventilation',
    question: 'Air Flow & Duct Systems',
    isPriority: false,
    status: 'pending',
    notes: '',
    hvacMepAccess: {}
  },
  {
    id: 'mep-004',
    category: 'Access Panels',
    question: 'Maintenance Access Requirements',
    isPriority: false,
    status: 'pending',
    notes: '',
    hvacMepAccess: {}
  },
  {
    id: 'mep-005',
    category: 'Mechanical Fixtures',
    question: 'Equipment & Machinery Assessment',
    isPriority: false,
    status: 'pending',
    notes: '',
    hvacMepAccess: {}
  },

  // 6. Public & Common Areas
  {
    id: 'public-001',
    category: 'Restaurant Areas',
    question: 'Dining Space Finishes',
    isPriority: false,
    status: 'pending',
    notes: '',
    publicDiningZones: {}
  },
  {
    id: 'public-002',
    category: 'Lounge & Bar Areas',
    question: 'Entertainment Space Assessment',
    isPriority: false,
    status: 'pending',
    notes: '',
    publicDiningZones: {}
  },
  {
    id: 'public-003',
    category: 'Entertainment Spaces',
    question: 'Recreation Area Features',
    isPriority: false,
    status: 'pending',
    notes: '',
    publicDiningZones: {}
  },
  {
    id: 'public-004',
    category: 'Circulation Areas',
    question: 'Corridors & Walkways',
    isPriority: false,
    status: 'pending',
    notes: '',
    publicDiningZones: {}
  },
  {
    id: 'public-005',
    category: 'Service Areas',
    question: 'Back-of-house Facilities',
    isPriority: false,
    status: 'pending',
    notes: '',
    publicDiningZones: {}
  },

  // 7. Special Conditions
  {
    id: 'special-001',
    category: 'Access Constraints',
    question: 'Physical Access Limitations',
    isPriority: true,
    status: 'pending',
    notes: '',
    additionalNotes: {}
  },
  {
    id: 'special-002',
    category: 'Special Materials',
    question: 'Hazardous Materials Assessment',
    isPriority: true,
    status: 'pending',
    notes: '',
    additionalNotes: {}
  },
  {
    id: 'special-003',
    category: 'Safety Considerations',
    question: 'Safety Protocols & Restrictions',
    isPriority: true,
    status: 'pending',
    notes: '',
    additionalNotes: {}
  },
  {
    id: 'special-004',
    category: 'Custom Requirements',
    question: 'Client-specific Needs',
    isPriority: false,
    status: 'pending',
    notes: '',
    additionalNotes: {}
  },
  {
    id: 'special-005',
    category: 'Compliance & Standards',
    question: 'Regulatory Compliance Check',
    isPriority: true,
    status: 'pending',
    notes: '',
    additionalNotes: {}
  }
];

// Dropdown options for various fields
export const MATERIAL_OPTIONS = {
  wallMaterial: [
    'Steel Panels',
    'Aluminum Panels', 
    'Composite Panels',
    'Laminate',
    'Vinyl',
    'Painted Steel',
    'Stainless Steel',
    'Wood Veneer',
    'Other'
  ],
  ceilingType: [
    'Suspended Ceiling',
    'Direct Mount',
    'Open Ceiling',
    'Acoustic Tiles',
    'Metal Grid',
    'Integrated Systems',
    'Other'
  ],
  topCovering: [
    'Carpet',
    'Vinyl Sheet',
    'Vinyl Tiles',
    'Rubber Flooring',
    'Linoleum',
    'Ceramic Tiles',
    'Wood Flooring',
    'Safety Flooring',
    'Other'
  ],
  subfloorType: [
    'Steel Deck',
    'Plywood',
    'Particle Board',
    'Concrete',
    'Raised Floor',
    'Other'
  ],
  surfaceFinish: [
    'Ceramic Tiles',
    'Vinyl',
    'Fiberglass',
    'Stainless Steel',
    'Composite',
    'Other'
  ]
};
