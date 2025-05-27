
import { supabase } from '@/integrations/supabase/client';
import { Survey } from '@/types/survey';
import { CompleteSurveyData } from '@/types/storage';

class OnlineStorageService {
  private validateChecklistData(checklist: any[]): boolean {
    if (!Array.isArray(checklist)) return false;
    
    return checklist.every(item => 
      item && 
      typeof item === 'object' &&
      typeof item.id === 'string' &&
      typeof item.survey_id === 'string' &&
      typeof item.question_id === 'string' &&
      typeof item.question_category === 'string'
    );
  }

  async save(surveyData: CompleteSurveyData, existingId?: string): Promise<Survey> {
    try {
      // Validate checklist data if present
      if (surveyData.checklist_responses) {
        if (!this.validateChecklistData(surveyData.checklist_responses)) {
          console.warn('[OnlineStorage] Invalid checklist data detected, skipping checklist sync');
          surveyData.checklist_responses = undefined;
        }
      }

      // Prepare data for Supabase (no user_id required)
      const supabaseData = {
        client_name: surveyData.client_name,
        client_country: surveyData.client_country,
        client_contacts: surveyData.client_contacts as any,
        ship_name: surveyData.ship_name,
        survey_location: surveyData.survey_location,
        survey_date: surveyData.survey_date,
        project_scope: surveyData.project_scope,
        duration: surveyData.duration,
        tools: surveyData.tools,
        custom_fields: surveyData.custom_fields as any,
        flight_details: surveyData.flight_details as any,
        hotel_details: surveyData.hotel_details as any,
        status: surveyData.status,
        user_id: null, // No user authentication required
      };

      let result;
      if (existingId && !existingId.includes('_')) {
        // Update existing survey
        const { data, error } = await supabase
          .from('surveys')
          .update(supabaseData)
          .eq('id', existingId)
          .select()
          .single();
        
        if (error) throw error;
        result = data;
      } else {
        // Create new survey
        const { data, error } = await supabase
          .from('surveys')
          .insert([supabaseData])
          .select()
          .single();
        
        if (error) throw error;
        result = data;
      }

      console.log(`[OnlineStorage] Saved survey online: ${result.id}`);
      return result as Survey;
    } catch (error) {
      console.error(`[OnlineStorage] Failed to save survey online:`, error);
      throw error;
    }
  }
}

export const onlineStorageService = new OnlineStorageService();
