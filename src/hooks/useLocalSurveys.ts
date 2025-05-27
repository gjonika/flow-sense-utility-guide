
import { useState, useEffect } from 'react';
import { Survey } from '@/types/survey';
import { getAllSurveys } from '@/lib/syncService';

export const useLocalSurveys = () => {
  const [localSurveys, setLocalSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSurveys = async () => {
    try {
      setLoading(true);
      const surveys = await getAllSurveys();
      setLocalSurveys(surveys);
    } catch (error) {
      console.error('[useLocalSurveys] Failed to fetch surveys:', error);
      setLocalSurveys([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSurveys();
  }, []);

  return {
    localSurveys,
    loading,
    refetch: fetchSurveys,
  };
};
