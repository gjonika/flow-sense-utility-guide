
import { useState, useEffect } from 'react';
import { Survey } from '@/types/survey';
import { surveyStorageService } from '@/services/surveyStorageService';

export const useSurveyStatus = (surveyId?: string) => {
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadSurvey = async (id: string) => {
    if (!id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Fetch from online storage
      const surveys = await surveyStorageService.getAllSurveys();
      const foundSurvey = surveys.find(s => s.id === id);
      
      if (foundSurvey) {
        setSurvey(foundSurvey);
      } else {
        setError('Survey not found');
      }
    } catch (err) {
      console.error('[useSurveyStatus] Failed to load survey:', err);
      setError(err instanceof Error ? err.message : 'Failed to load survey');
    } finally {
      setLoading(false);
    }
  };

  const saveSurvey = async (surveyData: Omit<Survey, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'last_synced_at' | 'needs_sync'>) => {
    if (!surveyId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const updatedSurvey = await surveyStorageService.saveOnline(surveyData, surveyId);
      setSurvey(updatedSurvey);
    } catch (err) {
      console.error('[useSurveyStatus] Failed to save survey:', err);
      setError(err instanceof Error ? err.message : 'Failed to save survey');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteSurvey = async () => {
    if (!surveyId) return false;
    
    setLoading(true);
    setError(null);
    
    try {
      await surveyStorageService.deleteSurvey(surveyId);
      setSurvey(null);
      return true;
    } catch (err) {
      console.error('[useSurveyStatus] Failed to delete survey:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete survey');
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (surveyId) {
      loadSurvey(surveyId);
    }
  }, [surveyId]);

  return {
    survey,
    loading,
    error,
    saveSurvey,
    deleteSurvey,
    refetch: () => surveyId ? loadSurvey(surveyId) : Promise.resolve(),
  };
};
