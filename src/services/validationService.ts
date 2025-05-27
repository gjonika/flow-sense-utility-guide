import { Survey } from '@/types/survey';
import { StoredSurvey } from '@/types/storage';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface SurveyValidationResult extends ValidationResult {
  canSync: boolean;
  requiresRepair: boolean;
}

class ValidationService {
  validateSurveyStructure(survey: Survey | StoredSurvey): SurveyValidationResult {
    console.log('[ValidationService] Validating survey structure:', survey);
    const errors: string[] = [];
    const warnings: string[] = [];

    // Required fields validation - more lenient for status updates
    if (!survey.client_name || survey.client_name.trim() === '') {
      console.log('[ValidationService] Missing client_name');
      errors.push('Client name is required');
    }
    
    if (!survey.ship_name || survey.ship_name.trim() === '') {
      console.log('[ValidationService] Missing ship_name');
      errors.push('Ship name is required');
    }
    
    if (!survey.survey_date || survey.survey_date === '') {
      console.log('[ValidationService] Missing survey_date');
      errors.push('Survey date is required');
    }
    
    // Enhanced status validation with detailed logging
    if (!survey.status) {
      console.log('[ValidationService] Missing status field');
      errors.push('Survey status is required');
    } else if (!['draft', 'in-progress', 'completed'].includes(survey.status)) {
      console.log('[ValidationService] Invalid status value:', survey.status);
      errors.push(`Invalid survey status: ${survey.status}. Must be 'draft', 'in-progress', or 'completed'`);
    } else {
      console.log('[ValidationService] Valid status:', survey.status);
    }

    // Data structure validation
    if (survey.client_contacts && !Array.isArray(survey.client_contacts)) {
      console.log('[ValidationService] Invalid client_contacts structure');
      errors.push('Client contacts must be an array');
    }
    
    if (survey.tools && !Array.isArray(survey.tools)) {
      console.log('[ValidationService] Invalid tools structure');
      errors.push('Tools must be an array');
    }

    // Custom fields validation
    if (survey.custom_fields && typeof survey.custom_fields !== 'object') {
      console.log('[ValidationService] Invalid custom_fields structure');
      errors.push('Custom fields must be an object');
    }

    // Travel details validation
    if (survey.flight_details && typeof survey.flight_details !== 'object') {
      warnings.push('Flight details structure may be invalid');
    }
    
    if (survey.hotel_details && typeof survey.hotel_details !== 'object') {
      warnings.push('Hotel details structure may be invalid');
    }

    const isValid = errors.length === 0;
    const canSync = isValid && !!survey.client_name && !!survey.ship_name;
    const requiresRepair = !isValid || warnings.length > 0;

    console.log('[ValidationService] Validation result:', {
      isValid,
      errors,
      warnings,
      canSync,
      requiresRepair
    });

    return {
      isValid,
      errors,
      warnings,
      canSync,
      requiresRepair
    };
  }

  // Add a simpler validation method for status updates that doesn't require all fields
  validateForStatusUpdate(survey: Survey | StoredSurvey): ValidationResult {
    console.log('[ValidationService] Validating for status update:', survey);
    const errors: string[] = [];
    const warnings: string[] = [];

    // Only validate that the status is valid for status updates
    if (!survey.status || !['draft', 'in-progress', 'completed'].includes(survey.status)) {
      console.log('[ValidationService] Invalid status for update:', survey.status);
      errors.push('Invalid survey status');
    }

    const result = {
      isValid: errors.length === 0,
      errors,
      warnings
    };

    console.log('[ValidationService] Status update validation result:', result);
    return result;
  }

  repairSurveyStructure(survey: Survey | StoredSurvey): Survey | StoredSurvey {
    console.log('[ValidationService] Repairing survey structure:', survey);
    const repaired = { ...survey };

    // Ensure arrays are arrays
    if (!Array.isArray(repaired.client_contacts)) {
      repaired.client_contacts = [];
    }
    
    if (!Array.isArray(repaired.tools)) {
      repaired.tools = [];
    }

    // Ensure objects are objects
    if (typeof repaired.custom_fields !== 'object' || repaired.custom_fields === null) {
      repaired.custom_fields = {};
    }
    
    if (typeof repaired.flight_details !== 'object' || repaired.flight_details === null) {
      repaired.flight_details = {};
    }
    
    if (typeof repaired.hotel_details !== 'object' || repaired.hotel_details === null) {
      repaired.hotel_details = {};
    }

    // Set default status if invalid - this is crucial
    if (!repaired.status || !['draft', 'in-progress', 'completed'].includes(repaired.status)) {
      console.log('[ValidationService] Setting default status to draft');
      repaired.status = 'draft';
    }

    // Set default timestamps if missing
    if (!repaired.created_at) {
      repaired.created_at = new Date().toISOString();
    }
    
    if (!repaired.updated_at) {
      repaired.updated_at = new Date().toISOString();
    }

    console.log('[ValidationService] Repaired survey:', repaired);
    return repaired;
  }

  ensureChecklistTemplate(survey: Survey | StoredSurvey): Survey | StoredSurvey {
    const repaired = { ...survey };
    
    // Add default checklist template if missing
    if (!repaired.custom_fields) {
      repaired.custom_fields = {};
    }
    
    // Ensure checklist template exists
    if (!repaired.custom_fields.checklist_template) {
      repaired.custom_fields.checklist_template = 'general';
    }
    
    return repaired;
  }

  validateSupabasePayload(data: any): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Validate JSON fields are proper objects/arrays
    try {
      if (data.client_contacts && typeof data.client_contacts === 'string') {
        JSON.parse(data.client_contacts);
      }
    } catch {
      errors.push('client_contacts contains invalid JSON');
    }

    try {
      if (data.custom_fields && typeof data.custom_fields === 'string') {
        JSON.parse(data.custom_fields);
      }
    } catch {
      errors.push('custom_fields contains invalid JSON');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }
}

export const validationService = new ValidationService();
