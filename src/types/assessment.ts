
export interface AssessmentItem {
  id: string;
  category: string;
  question: string;
  status: 'pending' | 'noted' | 'requires_attention' | 'not_applicable';
  notes: string;
  isPriority: boolean;
  
  // Enhanced fields for material assessment
  plannedMaterial?: string;
  conditionNotes?: string;
  installationNotes?: string;
  levelingPrepEstimate?: string;
  actionRequired?: 'reuse' | 'refurbish' | 'replace';
  markForEarlyProcurement?: boolean;
  
  // New dimension and quantity fields
  dimensions?: {
    width?: number; // cm
    height?: number; // cm
    length?: number; // cm
    area?: number; // m² (auto-calculated or manual)
  };
  quantity?: number;
  positionCode?: string; // Optional position/area identifier
  
  // Quantity fields for all assessments
  quantities?: {
    surfaceArea?: number; // m²
    linearMeters?: number; // lm
    unitCount?: number; // pieces
    sets?: number; // sets of items
  };
  
  // Category-specific fields for detailed assessment
  wallsAndCeilings?: {
    wallMaterial?: string;
    surfaceCondition?: string;
    ceilingType?: string;
    integratedSystems?: string;
    fireproofingInsulationNeeds?: string;
    // Insulation fields for walls/bulkheads
    insulation?: {
      existingType?: string;
      plannedType?: string;
      thickness?: number; // mm
      fireproofingRequired?: boolean;
      moistureBarrierRequired?: boolean;
      function?: 'thermal' | 'acoustic' | 'both';
      action?: 'keep' | 'replace' | 'add_new';
      insulationNotes?: string;
    };
  };
  
  flooring?: {
    topCovering?: string;
    topLayerCondition?: string;
    subfloorType?: string;
    subfloorCondition?: string;
    levelingNeeded?: boolean;
    levelingMm?: number;
    waterproofingSlopeNotes?: string;
    // Insulation fields for decks/floors
    insulation?: {
      underdeckType?: string;
      soundproofingType?: string;
      thickness?: number; // mm
      function?: 'thermal' | 'acoustic' | 'both';
      action?: 'keep' | 'replace' | 'add_new';
      insulationNotes?: string;
    };
  };
  
  furniture?: {
    fixedFurnitureTypes?: string;
    keepReplaceRefurbish?: 'keep' | 'replace' | 'refurbish';
    looseFurnitureEstimate?: string;
    upholsteryCondition?: string;
    hardwareNotes?: string;
  };
  
  wetAreas?: {
    unitType?: 'prefab' | 'custom';
    surfaceFinish?: string;
    plumbingStatus?: string;
    drainageSlopeNotes?: string;
    ventilationComments?: string;
  };
  
  lightingElectrical?: {
    ceilingLightType?: string;
    switchesControls?: boolean;
    socketLayout?: string;
    emergencyLightingStatus?: string;
  };
  
  hvacMepAccess?: {
    visibleSystems?: string;
    obstructionsForWorks?: string;
    accessPanelsNeeded?: string;
    relocationForeseen?: boolean;
  };
  
  publicDiningZones?: {
    finishTypes?: string;
    furnitureNotes?: string;
    layoutModificationRequired?: boolean;
    reusabilityOfItems?: string;
  };
  
  additionalNotes?: {
    specialConditions?: string;
    earlyProcurementNeeds?: string;
    observations?: string;
  };
  
  // Legacy fields for insulation items
  thermalRating?: string;
  fireRating?: string;
  moistureProtection?: boolean;
  accessibilityNotes?: string;
  estimatedHours?: number;
  item?: string;
  description?: string;
}

export interface PreRefurbishmentChecklistProps {
  surveyId: string;
  onSave?: (checklist: AssessmentItem[]) => void;
}

export interface GeneralInformation {
  vesselName?: string;
  shipName?: string;
  clientName?: string;
  location?: string;
  projectScope?: string;
  imoNumber?: string;
  inspectionDate?: string;
  inspectorName?: string;
  inspectorCompany?: string;
  portOfInspection?: string;
  shipType?: string;
  lastDryDock?: string;
  lastMajorRefurbishment?: string;
}

export interface AccordionSection {
  id: string;
  title: string;
  description: string;
  colorClass: string;
  categories: string[];
}
