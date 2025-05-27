
import { Survey } from '@/types/survey';
import { onlineStorageService } from '@/services/onlineStorageService';

export type SurveyPersistenceResult = {
  success: boolean;
  survey?: Survey;
  error?: string;
};

export const saveSurvey = async (
  surveyData: Omit<Survey, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'last_synced_at' | 'needs_sync'>,
  existingSurveyId?: string
): Promise<SurveyPersistenceResult> => {
  try {
    console.log(`[saveSurvey] Saving survey online. Existing ID: ${existingSurveyId}`);

    // Convert to complete survey data format
    const completeSurveyData = {
      client_name: surveyData.client_name,
      client_country: surveyData.client_country,
      client_contacts: surveyData.client_contacts,
      ship_name: surveyData.ship_name,
      survey_location: surveyData.survey_location,
      survey_date: surveyData.survey_date,
      project_scope: surveyData.project_scope,
      duration: surveyData.duration,
      tools: surveyData.tools,
      custom_fields: surveyData.custom_fields,
      flight_details: surveyData.flight_details,
      hotel_details: surveyData.hotel_details,
      status: surveyData.status,
    };

    const result = await onlineStorageService.save(completeSurveyData, existingSurveyId);
    
    console.log(`[saveSurvey] Successfully saved survey online: ${result.id}`);
    
    return {
      success: true,
      survey: result,
    };
  } catch (error) {
    console.error('[saveSurvey] Failed to save survey:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};
