
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
      // Map response types to match database expectations
      const dbResponseType = responseType === 'yes' ? 'compliant' : 
                           responseType === 'no' ? 'non_compliant' : 'na';

      const { data, error } = await supabase
        .from('checklist_responses') // Use correct table name
        .insert([{
          id: responseId,
          survey_id: surveyId,
          zone_id: zoneId,
          question_id: questionId,
          question_category: questionCategory,
          question_text: questionText,
          response_type: dbResponseType,
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
        .from('checklist_responses') // Use correct table name
        .select('*')
        .eq('survey_id', surveyId);

      if (error) throw error;

      return (data || []).map(response => ({
        ...response,
        response_type: response.response_type === 'compliant' ? 'yes' as const :
                      response.response_type === 'non_compliant' ? 'no' as const : 'na' as const,
        needs_sync: false
      }));
    } catch (error) {
      console.error('Error getting responses:', error);
      return [];
    }
  }
}

export const checklistResponseService = new ChecklistResponseService();
