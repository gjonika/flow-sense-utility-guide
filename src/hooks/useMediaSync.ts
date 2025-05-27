
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { SurveyMedia } from '@/types/survey';
import { useToast } from '@/hooks/use-toast';
import { mediaStorageService } from '@/services/mediaStorageService';

export const useMediaSync = () => {
  const [syncingMedia, setSyncingMedia] = useState<string[]>([]);
  const { toast } = useToast();

  // Save media file online
  const saveMediaOffline = useCallback(async (
    surveyId: string,
    file: File,
    zoneId?: string
  ): Promise<string> => {
    try {
      console.log('[useMediaSync] Starting media upload:', { surveyId, fileName: file.name, zoneId });
      
      // Upload file to storage
      const uploadResult = await mediaStorageService.uploadFile(surveyId, file, zoneId);
      
      if (!uploadResult.success) {
        throw new Error(uploadResult.error || 'Upload failed');
      }

      // Save metadata to database
      const mediaId = await mediaStorageService.saveMediaRecord(
        surveyId,
        file.name,
        file.type,
        file.size,
        uploadResult.filePath!,
        zoneId
      );

      console.log('[useMediaSync] Media saved successfully:', mediaId);
      toast({
        title: "Upload Successful",
        description: `${file.name} uploaded successfully`,
      });
      
      return mediaId;
    } catch (error) {
      console.error('[useMediaSync] Failed to save media:', error);
      toast({
        title: "Upload Failed",
        description: `Failed to upload ${file.name}: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
      throw error;
    }
  }, [toast]);

  // Sync all pending media files (no-op in online-only mode)
  const syncAllPendingMedia = useCallback(async (): Promise<SurveyMedia[]> => {
    console.log('[useMediaSync] No pending media to sync in online-only mode');
    toast({
      title: "No Sync Needed",
      description: "All media files are already stored online.",
    });
    return [];
  }, [toast]);

  // Get media for a survey
  const getOfflineMediaForSurvey = useCallback(async (surveyId: string): Promise<SurveyMedia[]> => {
    try {
      return await mediaStorageService.getMediaForSurvey(surveyId);
    } catch (error) {
      console.error('Failed to get media for survey:', error);
      return [];
    }
  }, []);

  return {
    syncingMedia,
    saveMediaOffline,
    syncAllPendingMedia,
    getOfflineMediaForSurvey,
  };
};
