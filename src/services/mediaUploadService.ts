
import { supabase } from '@/integrations/supabase/client';

export interface MediaUploadResult {
  success: boolean;
  storageUrl?: string;
  error?: string;
}

class MediaUploadService {
  private bucketName = 'survey-media';

  async ensureBucketExists(): Promise<void> {
    try {
      const { data: buckets } = await supabase.storage.listBuckets();
      const bucketExists = buckets?.some(bucket => bucket.name === this.bucketName);
      
      if (!bucketExists) {
        console.log('[MediaUpload] Creating survey-media bucket');
        // Bucket will be created via SQL migration
      }
    } catch (error) {
      console.error('[MediaUpload] Error checking bucket:', error);
    }
  }

  async uploadFile(
    surveyId: string, 
    file: File, 
    zoneId?: string
  ): Promise<MediaUploadResult> {
    try {
      await this.ensureBucketExists();
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${surveyId}/${zoneId || 'general'}/${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
      
      console.log(`[MediaUpload] Uploading file: ${fileName}`);
      
      const { data, error } = await supabase.storage
        .from(this.bucketName)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('[MediaUpload] Upload failed:', error);
        return { success: false, error: error.message };
      }

      const { data: urlData } = supabase.storage
        .from(this.bucketName)
        .getPublicUrl(fileName);

      console.log(`[MediaUpload] Upload successful: ${fileName}`);
      return { 
        success: true, 
        storageUrl: urlData.publicUrl 
      };
    } catch (error) {
      console.error('[MediaUpload] Upload error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  async uploadBase64File(
    surveyId: string,
    base64Data: string,
    fileName: string,
    fileType: string,
    zoneId?: string
  ): Promise<MediaUploadResult> {
    try {
      // Convert base64 to blob
      const response = await fetch(base64Data);
      const blob = await response.blob();
      const file = new File([blob], fileName, { type: fileType });
      
      return await this.uploadFile(surveyId, file, zoneId);
    } catch (error) {
      console.error('[MediaUpload] Base64 upload error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to convert base64' 
      };
    }
  }
}

export const mediaUploadService = new MediaUploadService();
