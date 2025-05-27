
import { useState } from 'react';
import { ChecklistResponse } from '@/types/checklist';
import { useChecklistResponses } from '@/hooks/useChecklistResponses';
import { useToast } from '@/hooks/use-toast';

interface UseChecklistQuestionLogicProps {
  surveyId: string;
  questionId: string;
  questionCategory: string;
  questionText: string;
  isMandatory: boolean;
  zoneId?: string;
  existingResponse?: ChecklistResponse;
  onResponseSaved: (questionId: string, response: ChecklistResponse) => void;
}

export const useChecklistQuestionLogic = ({
  surveyId,
  questionId,
  questionCategory,
  questionText,
  isMandatory,
  zoneId,
  existingResponse,
  onResponseSaved,
}: UseChecklistQuestionLogicProps) => {
  const [selectedResponse, setSelectedResponse] = useState<'yes' | 'no' | 'na' | 'skipped' | null>(
    existingResponse?.response_type || null
  );
  const [notes, setNotes] = useState(existingResponse?.notes || '');
  const [assetTag, setAssetTag] = useState(existingResponse?.asset_tag || '');
  const [qrCode, setQrCode] = useState(existingResponse?.qr_code || '');
  const [rfidTag, setRfidTag] = useState(existingResponse?.rfid_tag || '');
  const [showSkipConfirm, setShowSkipConfirm] = useState(false);
  const [attachingMedia, setAttachingMedia] = useState(false);
  
  const { saveResponse, saveMediaEvidence } = useChecklistResponses();
  const { toast } = useToast();

  const handleResponseSelect = async (responseType: 'yes' | 'no' | 'na' | 'skipped') => {
    if (responseType === 'skipped' && isMandatory && !showSkipConfirm) {
      setShowSkipConfirm(true);
      return;
    }

    try {
      const responseId = await saveResponse(
        surveyId,
        questionId,
        questionCategory,
        questionText,
        responseType,
        isMandatory,
        notes,
        zoneId,
        assetTag,
        qrCode,
        rfidTag
      );

      const newResponse: ChecklistResponse = {
        id: responseId,
        survey_id: surveyId,
        zone_id: zoneId,
        question_id: questionId,
        question_category: questionCategory,
        question_text: questionText,
        response_type: responseType,
        is_mandatory: isMandatory,
        notes,
        asset_tag: assetTag,
        qr_code: qrCode,
        rfid_tag: rfidTag,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        needs_sync: true,
      };

      setSelectedResponse(responseType);
      setShowSkipConfirm(false);
      onResponseSaved(questionId, newResponse);
      
    } catch (error) {
      console.error('Error saving response:', error);
      toast({
        title: "Error",
        description: "Failed to save response",
        variant: "destructive",
      });
    }
  };

  const handleMediaCapture = async (file: File, evidenceType: 'defect' | 'compliance' | 'reference') => {
    if (!selectedResponse) {
      toast({
        title: "Response Required",
        description: "Please answer the question before adding evidence",
        variant: "destructive",
      });
      return;
    }

    setAttachingMedia(true);
    try {
      await saveMediaEvidence(
        existingResponse?.id || 'temp_response_id',
        surveyId,
        file,
        evidenceType
      );
      
      toast({
        title: "Evidence Added",
        description: "Media evidence attached successfully",
      });
    } catch (error) {
      console.error('Error saving media:', error);
      toast({
        title: "Error",
        description: "Failed to attach evidence",
        variant: "destructive",
      });
    } finally {
      setAttachingMedia(false);
    }
  };

  const handleFileSelect = (evidenceType: 'defect' | 'compliance' | 'reference') => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*,video/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        handleMediaCapture(file, evidenceType);
      }
    };
    input.click();
  };

  const handleCameraCapture = (evidenceType: 'defect' | 'compliance' | 'reference') => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'environment';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        handleMediaCapture(file, evidenceType);
      }
    };
    input.click();
  };

  return {
    selectedResponse,
    notes,
    assetTag,
    qrCode,
    rfidTag,
    showSkipConfirm,
    attachingMedia,
    setNotes,
    setAssetTag,
    setQrCode,
    setRfidTag,
    setShowSkipConfirm,
    handleResponseSelect,
    handleCameraCapture,
    handleFileSelect,
  };
};
