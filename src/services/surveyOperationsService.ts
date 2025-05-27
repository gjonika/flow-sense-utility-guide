
import { supabase } from '@/integrations/supabase/client';
import { Survey } from '@/types/survey';

export class SurveyOperationsService {
  async saveSurvey(survey: Omit<Survey, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'last_synced_at' | 'needs_sync'>, tempId?: string): Promise<string> {
    try {
      const surveyData = {
        client_name: survey.client_name,
        client_country: survey.client_country,
        client_contacts: survey.client_contacts as any,
        ship_name: survey.ship_name,
        survey_location: survey.survey_location,
        survey_date: survey.survey_date,
        project_scope: survey.project_scope,
        duration: survey.duration,
        tools: survey.tools,
        custom_fields: survey.custom_fields as any,
        flight_details: survey.flight_details as any,
        hotel_details: survey.hotel_details as any,
        status: survey.status,
        user_id: null, // No user authentication required
      };

      if (tempId) {
        // Update existing survey
        const { data, error } = await supabase
          .from('surveys')
          .update(surveyData)
          .eq('id', tempId)
          .select()
          .single();

        if (error) throw error;
        console.log('Survey updated successfully:', tempId);
        return tempId;
      } else {
        // Create new survey
        const { data, error } = await supabase
          .from('surveys')
          .insert([surveyData])
          .select()
          .single();

        if (error) throw error;
        console.log('Survey created successfully:', data.id);
        return data.id;
      }
    } catch (error) {
      console.error('Failed to save survey:', error);
      throw error;
    }
  }
}

export const surveyOperationsService = new SurveyOperationsService();
