
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Survey } from '@/types/survey';

export const useSurveyUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0 });
  const { toast } = useToast();

  const uploadSurveys = async (surveys: Survey[]): Promise<void> => {
    if (surveys.length === 0) {
      toast({
        title: "No Surveys to Upload",
        description: "All surveys are already stored online.",
      });
      return;
    }

    console.log('[useSurveyUpload] No upload needed in online-only mode');
    toast({
      title: "Upload Complete",
      description: "All surveys are already stored online.",
    });
  };

  const uploadSurvey = async (survey: Survey): Promise<boolean> => {
    console.log('[useSurveyUpload] Survey already stored online:', survey.id);
    return true;
  };

  return {
    uploading,
    uploadProgress,
    uploadSurveys,
    uploadSurvey,
  };
};
