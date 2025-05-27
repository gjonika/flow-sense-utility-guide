
import { Survey } from '@/types/survey';
import { CompleteSurveyData } from '@/types/storage';
import { onlineStorageService } from './onlineStorageService';
import { supabase } from '@/integrations/supabase/client';
import { transformSupabaseSurveyToSurvey } from '@/utils/surveyTransformations';

class SurveyStorageService {
  // Generate unique ID for surveys (now handled by Supabase)
  generateId(): string {
    return crypto.randomUUID();
  }

  // Universal save method - now always saves online without user auth
  async save(surveyData: CompleteSurveyData, existingId?: string): Promise<{ survey: Survey; savedLocation: 'online' }> {
    try {
      console.log(`[SurveyStorage] Saving survey online. ID: ${existingId || 'new'}`);
      
      const survey = await onlineStorageService.save(surveyData, existingId);
      return { survey, savedLocation: 'online' };
    } catch (error) {
      console.error(`[SurveyStorage] Failed to save survey online:`, error);
      throw error;
    }
  }

  // Direct online save method
  async saveOnline(surveyData: CompleteSurveyData, existingId?: string): Promise<Survey> {
    return onlineStorageService.save(surveyData, existingId);
  }

  // Simple status update method that bypasses full validation
  async updateStatus(surveyId: string, status: Survey['status']): Promise<Survey> {
    try {
      console.log(`[SurveyStorage] Updating survey status. ID: ${surveyId}, Status: ${status}`);
      
      const { data, error } = await supabase
        .from('surveys')
        .update({ 
          status,
          updated_at: new Date().toISOString() 
        })
        .eq('id', surveyId)
        .select()
        .single();

      if (error) {
        throw error;
      }

      console.log(`[SurveyStorage] Status updated successfully for survey: ${surveyId}`);
      return transformSupabaseSurveyToSurvey(data);
    } catch (error) {
      console.error(`[SurveyStorage] Failed to update survey status:`, error);
      throw error;
    }
  }

  // Get all surveys from online storage (no user filtering)
  async getAllSurveys(): Promise<Survey[]> {
    try {
      const { data, error } = await supabase
        .from('surveys')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return (data || []).map(transformSupabaseSurveyToSurvey);
    } catch (error) {
      console.error('[SurveyStorage] Failed to get surveys:', error);
      throw error;
    }
  }

  // Delete survey from online storage
  async deleteSurvey(surveyId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('surveys')
        .delete()
        .eq('id', surveyId);

      if (error) {
        throw error;
      }

      console.log(`[SurveyStorage] Successfully deleted survey: ${surveyId}`);
    } catch (error) {
      console.error(`[SurveyStorage] Failed to delete survey:`, error);
      throw error;
    }
  }
}

export const surveyStorageService = new SurveyStorageService();

// Re-export types for backward compatibility
export type { CompleteSurveyData } from '@/types/storage';
