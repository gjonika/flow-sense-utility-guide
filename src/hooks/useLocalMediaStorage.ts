
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { offlineDB } from '@/lib/offlineStorage';

interface LocalMediaFile {
  id: string;
  file: File;
  surveyId: string;
  zoneId?: string;
  sectionName?: string;
  evidenceType?: 'defect' | 'compliance' | 'reference';
  thumbnail?: string;
  createdAt: string;
}

export const useLocalMediaStorage = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  // Generate thumbnail for image files
  const generateThumbnail = useCallback(async (file: File): Promise<string> => {
    return new Promise((resolve) => {
      if (!file.type.startsWith('image/')) {
        resolve(''); // No thumbnail for non-images
        return;
      }

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        const maxSize = 150;
        const ratio = Math.min(maxSize / img.width, maxSize / img.height);
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;

        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.7));
      };

      img.onerror = () => resolve('');
      img.src = URL.createObjectURL(file);
    });
  }, []);

  // Save media file locally
  const saveMediaFile = useCallback(async (
    file: File,
    surveyId: string,
    zoneId?: string,
    sectionName?: string,
    evidenceType?: 'defect' | 'compliance' | 'reference'
  ): Promise<string> => {
    setIsProcessing(true);
    try {
      const mediaId = crypto.randomUUID();
      const thumbnail = await generateThumbnail(file);
      const now = new Date().toISOString();

      // Store in IndexedDB with blob data
      await offlineDB.media.add({
        id: mediaId,
        survey_id: surveyId,
        zone_id: zoneId,
        file_name: file.name,
        file_type: file.type,
        file_size: file.size,
        storage_path: `offline/${mediaId}`,
        thumbnail_path: thumbnail ? `offline/${mediaId}_thumb` : undefined,
        created_at: now,
        needs_sync: true,
        offline_created: true,
        version: 1,
        blob_data: file,
        file_data: evidenceType || 'reference',
        local_file_data: thumbnail
      });

      console.log(`[LocalMediaStorage] Saved media file: ${file.name} (${mediaId})`);
      
      toast({
        title: "Media Saved",
        description: `${file.name} has been saved locally and will sync when online.`,
      });

      return mediaId;
    } catch (error) {
      console.error('[LocalMediaStorage] Failed to save media:', error);
      toast({
        title: "Save Failed",
        description: "Failed to save media file locally. Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, [generateThumbnail, toast]);

  // Get local media files for a survey
  const getMediaForSurvey = useCallback(async (surveyId: string) => {
    try {
      const mediaFiles = await offlineDB.media
        .where('survey_id')
        .equals(surveyId)
        .toArray();

      return mediaFiles.map(media => ({
        id: media.id,
        fileName: media.file_name,
        fileType: media.file_type,
        fileSize: media.file_size,
        thumbnail: media.local_file_data,
        zoneId: media.zone_id,
        createdAt: media.created_at,
        needsSync: media.needs_sync,
        blob: media.blob_data
      }));
    } catch (error) {
      console.error('[LocalMediaStorage] Failed to get media for survey:', error);
      return [];
    }
  }, []);

  // Get media file blob for viewing
  const getMediaBlob = useCallback(async (mediaId: string): Promise<Blob | null> => {
    try {
      const media = await offlineDB.media.get(mediaId);
      return media?.blob_data || null;
    } catch (error) {
      console.error('[LocalMediaStorage] Failed to get media blob:', error);
      return null;
    }
  }, []);

  // Delete local media file
  const deleteMediaFile = useCallback(async (mediaId: string): Promise<void> => {
    try {
      await offlineDB.media.delete(mediaId);
      toast({
        title: "Media Deleted",
        description: "Media file has been removed from local storage.",
      });
    } catch (error) {
      console.error('[LocalMediaStorage] Failed to delete media:', error);
      toast({
        title: "Delete Failed",
        description: "Failed to delete media file. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  }, [toast]);

  // Camera capture helper
  const captureFromCamera = useCallback(async (
    surveyId: string,
    zoneId?: string,
    sectionName?: string,
    evidenceType: 'defect' | 'compliance' | 'reference' = 'reference'
  ): Promise<string | null> => {
    try {
      // Check if we can access the camera
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        toast({
          title: "Camera Not Available",
          description: "Camera access is not available on this device.",
          variant: "destructive",
        });
        return null;
      }

      // For now, we'll use a file input as a fallback
      // In a real mobile app, this would integrate with Capacitor Camera plugin
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.capture = 'environment'; // Use rear camera if available

      return new Promise((resolve) => {
        input.onchange = async (e) => {
          const file = (e.target as HTMLInputElement).files?.[0];
          if (file) {
            try {
              const mediaId = await saveMediaFile(file, surveyId, zoneId, sectionName, evidenceType);
              resolve(mediaId);
            } catch (error) {
              resolve(null);
            }
          } else {
            resolve(null);
          }
        };

        input.oncancel = () => resolve(null);
        input.click();
      });
    } catch (error) {
      console.error('[LocalMediaStorage] Camera capture failed:', error);
      toast({
        title: "Capture Failed",
        description: "Failed to capture media. Please try again.",
        variant: "destructive",
      });
      return null;
    }
  }, [saveMediaFile, toast]);

  return {
    isProcessing,
    saveMediaFile,
    getMediaForSurvey,
    getMediaBlob,
    deleteMediaFile,
    captureFromCamera
  };
};
