
import { useState, useCallback } from 'react';
import { Survey } from '@/types/survey';
import { supabase } from '@/integrations/supabase/client';
import { transformSupabaseSurveyToSurvey, transformSurveyToSupabaseData } from '@/utils/surveyTransformations';

export const useRemoteSurveys = (isOnline: boolean) => {
  const [remoteSurveys, setRemoteSurveys] = useState<Survey[]>([]);

  const fetchRemoteSurveys = useCallback(async () => {
    if (!isOnline) {
      setRemoteSurveys([]);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('surveys')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Failed to fetch remote surveys:', error);
        setRemoteSurveys([]);
      } else {
        const formattedSurveys: Survey[] = (data || []).map(transformSupabaseSurveyToSurvey);
        setRemoteSurveys(formattedSurveys);
      }
    } catch (error) {
      console.warn('Error fetching remote surveys:', error);
      setRemoteSurveys([]);
    }
  }, [isOnline]);

  const saveOnline = useCallback(async (surveyData: Omit<Survey, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'last_synced_at' | 'needs_sync'>, existingId?: string) => {
    const supabaseData = {
      ...transformSurveyToSupabaseData(surveyData),
      user_id: null, // No user authentication required
    };

    if (existingId) {
      const { data, error } = await supabase
        .from('surveys')
        .update(supabaseData)
        .eq('id', existingId)
        .select()
        .single();
      
      if (error) throw error;
      return transformSupabaseSurveyToSurvey(data);
    } else {
      const { data, error } = await supabase
        .from('surveys')
        .insert([supabaseData])
        .select()
        .single();
      
      if (error) throw error;
      return transformSupabaseSurveyToSurvey(data);
    }
  }, []);

  return {
    remoteSurveys,
    fetchRemoteSurveys,
    saveOnline,
  };
};
