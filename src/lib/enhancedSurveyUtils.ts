
import { Survey } from '@/types/survey';
import { StoredSurvey } from '@/types/storage';

export const safeIncludes = (field?: string, term = ''): boolean => {
  if (!field || !term) return true;
  return field.toLowerCase().includes(term.toLowerCase());
};

export const deduplicateSurveysEnhanced = (localSurveys: StoredSurvey[], remoteSurveys: Survey[]): Survey[] => {
  console.log(`[Deduplication] Processing ${localSurveys.length} local and ${remoteSurveys.length} remote surveys`);
  
  // Convert local surveys to Survey format
  const localAsSurvey: Survey[] = localSurveys.map(survey => ({
    id: survey.id,
    user_id: survey.user_id,
    client_name: survey.client_name,
    client_country: survey.client_country,
    client_contacts: survey.client_contacts,
    ship_name: survey.ship_name,
    survey_location: survey.survey_location,
    survey_date: survey.survey_date,
    project_scope: survey.project_scope,
    duration: survey.duration,
    tools: survey.tools,
    custom_fields: survey.custom_fields,
    flight_details: survey.flight_details,
    hotel_details: survey.hotel_details,
    status: survey.status,
    created_at: survey.created_at,
    updated_at: survey.updated_at,
    last_synced_at: survey.last_synced_at,
    needs_sync: survey.needs_sync,
  }));

  const result: Survey[] = [];
  const processedIds = new Set<string>();

  // First, add all remote surveys (they have priority)
  remoteSurveys.forEach(remoteSurvey => {
    result.push(remoteSurvey);
    processedIds.add(remoteSurvey.id);
  });

  // Then add local surveys that don't conflict with remote ones
  localAsSurvey.forEach(localSurvey => {
    // Skip if this exact ID already exists (was synced)
    if (processedIds.has(localSurvey.id)) {
      console.log(`[Deduplication] Skipping duplicate ID: ${localSurvey.id}`);
      return;
    }

    // Check for content-based duplicates only if local survey needs sync
    if (localSurvey.needs_sync) {
      const isDuplicate = remoteSurveys.some(remoteSurvey => {
        return (
          remoteSurvey.ship_name === localSurvey.ship_name &&
          remoteSurvey.client_name === localSurvey.client_name &&
          remoteSurvey.survey_date === localSurvey.survey_date &&
          Math.abs(new Date(remoteSurvey.created_at).getTime() - new Date(localSurvey.created_at).getTime()) < 60000 // Within 1 minute
        );
      });

      if (isDuplicate) {
        console.log(`[Deduplication] Skipping content duplicate: ${localSurvey.ship_name}`);
        return;
      }
    }

    // Add local survey if no conflicts
    result.push(localSurvey);
    processedIds.add(localSurvey.id);
  });

  // Sort by date (newest first), with a fallback for surveys without dates
  const sorted = result.sort((a, b) => {
    const dateA = new Date(a.created_at || a.survey_date || '1970-01-01').getTime();
    const dateB = new Date(b.created_at || b.survey_date || '1970-01-01').getTime();
    return dateB - dateA;
  });

  console.log(`[Deduplication] Result: ${sorted.length} unique surveys`);
  return sorted;
};

export const getSurveyDisplayStatus = (survey: Survey): 'synced' | 'pending' | 'error' | 'local' => {
  // Temp IDs indicate local-only surveys
  if (survey.id.startsWith('temp_') || survey.id.includes('_')) {
    return survey.needs_sync ? 'pending' : 'local';
  }
  
  // UUID format indicates server-side survey
  if (survey.needs_sync) {
    return 'pending';
  }
  
  if (survey.last_synced_at) {
    return 'synced';
  }
  
  return 'local';
};

export const validateSurveyForDisplay = (survey: Survey): boolean => {
  // Basic validation to ensure survey can be displayed safely
  return !!(
    survey.id &&
    survey.ship_name &&
    survey.client_name &&
    survey.status &&
    Array.isArray(survey.client_contacts) &&
    Array.isArray(survey.tools) &&
    typeof survey.custom_fields === 'object' &&
    typeof survey.flight_details === 'object' &&
    typeof survey.hotel_details === 'object'
  );
};
