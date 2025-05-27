
import { supabase } from '@/integrations/supabase/client';
import { ChecklistResponse } from '@/types/checklist';

export class ChecklistResponseService {
  async saveResponse(
    surveyId: string,
    questionId: string,
    questionCategory: string,
    questionText: string,
    responseType: 'yes' | 'no' | 'na' | 'skipped',
    isMandatory: boolean,
    notes?: string,
    zoneId?: string,
    assetTag?: string,
    qrCode?: string,
    rfidTag?: string
  ): Promise<string> {
    const responseId = crypto.randomUUID();
    const now = new Date().toISOString();

    try {
      const { data, error } = await supabase
        .from('survey_checklist_responses')
        .insert([{
          id: responseId,
          survey_id: surveyId,
          zone_id: zoneId,
          question_id: questionId,
          question_category: questionCategory,
          question_text: questionText,
          response_type: responseType,
          is_mandatory: isMandatory,
          notes: notes || '',
          asset_tag: assetTag || '',
          qr_code: qrCode || '',
          rfid_tag: rfidTag || '',
          created_at: now,
          updated_at: now
        }])
        .select()
        .single();

      if (error) throw error;
      
      console.log('[ChecklistResponseService] Response saved successfully:', responseId);
      return responseId;
    } catch (error) {
      console.error('Error saving response:', error);
      throw error;
    }
  }

  async getResponsesForSurvey(surveyId: string): Promise<ChecklistResponse[]> {
    try {
      const { data, error } = await supabase
        .from('survey_checklist_responses')
        .select('*')
        .eq('survey_id', surveyId);

      if (error) throw error;

      return (data || []).map(response => ({
        ...response,
        response_type: response.response_type as 'yes' | 'no' | 'na' | 'skipped',
        needs_sync: false
      }));
    } catch (error) {
      console.error('Error getting responses:', error);
      return [];
    }
  }
}

export const checklistResponseService = new ChecklistResponseService();
