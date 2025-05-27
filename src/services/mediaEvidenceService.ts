
import { supabase } from '@/integrations/supabase/client';

export class MediaEvidenceService {
  async saveMediaEvidence(
    responseId: string,
    surveyId: string,
    file: File,
    evidenceType: 'defect' | 'compliance' | 'reference'
  ): Promise<string> {
    const mediaId = crypto.randomUUID();
    const fileName = `${evidenceType}_${Date.now()}_${file.name}`;
    const storagePath = `checklist/${surveyId}/${mediaId}/${fileName}`;

    try {
      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('survey-media')
        .upload(storagePath, file);

      if (uploadError) throw uploadError;

      // Save metadata to database
      const { data, error: dbError } = await supabase
        .from('survey_checklist_media')
        .insert([{
          id: mediaId,
          response_id: responseId,
          survey_id: surveyId,
          file_name: fileName,
          file_type: file.type,
          file_size: file.size,
          storage_path: storagePath,
          evidence_type: evidenceType,
          created_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (dbError) throw dbError;

      console.log('[MediaEvidenceService] Media evidence saved successfully:', mediaId);
      return mediaId;
    } catch (error) {
      console.error('Error saving media evidence:', error);
      throw error;
    }
  }
}

export const mediaEvidenceService = new MediaEvidenceService();
