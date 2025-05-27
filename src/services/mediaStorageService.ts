
import { supabase } from '@/integrations/supabase/client';

export interface MediaUploadResult {
  success: boolean;
  storageUrl?: string;
  publicUrl?: string;
  filePath?: string;
  error?: string;
}

class MediaStorageService {
  private bucketName = 'survey-media';

  async uploadFile(
    surveyId: string, 
    file: File, 
    zoneId?: string
  ): Promise<MediaUploadResult> {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${surveyId}/${zoneId || 'general'}/${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
      
      console.log(`[MediaStorage] Uploading file: ${fileName}`);
      
      const { data, error } = await supabase.storage
        .from(this.bucketName)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('[MediaStorage] Upload failed:', error);
        return { success: false, error: error.message };
      }

      const { data: urlData } = supabase.storage
        .from(this.bucketName)
        .getPublicUrl(fileName);

      console.log(`[MediaStorage] Upload successful: ${fileName}`);
      return { 
        success: true, 
        storageUrl: data.path,
        publicUrl: urlData.publicUrl,
        filePath: fileName
      };
    } catch (error) {
      console.error('[MediaStorage] Upload error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  async saveMediaRecord(
    surveyId: string,
    fileName: string,
    fileType: string,
    fileSize: number,
    storagePath: string,
    zoneId?: string
  ): Promise<string> {
    const { data, error } = await supabase
      .from('survey_media')
      .insert({
        survey_id: surveyId,
        zone_id: zoneId,
        file_name: fileName,
        file_type: fileType,
        file_size: fileSize,
        storage_path: storagePath
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to save media record: ${error.message}`);
    }

    return data.id;
  }

  async deleteFile(filePath: string): Promise<boolean> {
    try {
      const { error } = await supabase.storage
        .from(this.bucketName)
        .remove([filePath]);

      if (error) {
        console.error('[MediaStorage] Delete failed:', error);
        return false;
      }

      console.log(`[MediaStorage] File deleted: ${filePath}`);
      return true;
    } catch (error) {
      console.error('[MediaStorage] Delete error:', error);
      return false;
    }
  }

  async getMediaForSurvey(surveyId: string) {
    const { data, error } = await supabase
      .from('survey_media')
      .select('*')
      .eq('survey_id', surveyId);

    if (error) {
      console.error('[MediaStorage] Failed to get media:', error);
      return [];
    }

    return data || [];
  }
}

export const mediaStorageService = new MediaStorageService();
