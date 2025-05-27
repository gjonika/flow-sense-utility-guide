
import { useState, useCallback } from 'react';
import { ChecklistResponse } from '@/types/checklist';
import { checklistResponseService } from '@/services/checklistResponseService';
import { mediaEvidenceService } from '@/services/mediaEvidenceService';

export const useChecklistResponses = () => {
  const [loading, setLoading] = useState(false);

  const saveResponse = useCallback(async (
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
  ): Promise<string> => {
    return checklistResponseService.saveResponse(
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
  }, []);

  const saveMediaEvidence = useCallback(async (
    responseId: string,
    surveyId: string,
    file: File,
    evidenceType: 'defect' | 'compliance' | 'reference'
  ): Promise<string> => {
    return mediaEvidenceService.saveMediaEvidence(responseId, surveyId, file, evidenceType);
  }, []);

  const getResponsesForSurvey = useCallback(async (surveyId: string): Promise<ChecklistResponse[]> => {
    setLoading(true);
    try {
      return await checklistResponseService.getResponsesForSurvey(surveyId);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    saveResponse,
    saveMediaEvidence,
    getResponsesForSurvey,
    loading,
  };
};
