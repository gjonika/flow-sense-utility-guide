
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ChecklistTemplate } from '@/types/checklist';
import { useToast } from '@/hooks/use-toast';

// Helper function to safely parse questions from JSON
const parseQuestions = (data: any): ChecklistTemplate['questions'] => {
  if (!data) return [];
  if (Array.isArray(data)) {
    return data.filter(question => 
      question && 
      typeof question === 'object' && 
      typeof question.id === 'string' &&
      typeof question.text === 'string'
    );
  }
  return [];
};

export const useChecklistTemplates = () => {
  const [templates, setTemplates] = useState<ChecklistTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from('survey_templates')
        .select('*')
        .order('is_default', { ascending: false })
        .order('name');

      if (error) throw error;
      
      // Transform the data to match our TypeScript types
      const typedTemplates: ChecklistTemplate[] = (data || []).map(template => ({
        ...template,
        questions: parseQuestions(template.questions),
      }));
      
      setTemplates(typedTemplates);
    } catch (error) {
      console.error('Error fetching templates:', error);
      toast({
        title: "Error",
        description: "Failed to load checklist templates",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  return {
    templates,
    loading,
    refetch: fetchTemplates,
  };
};
