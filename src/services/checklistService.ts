
import { DEFAULT_COMPLIANCE_CHECKLIST, ChecklistQuestion } from '@/checklists/template';
import { supabase } from '@/integrations/supabase/client';

class ChecklistService {
  async getTemplate(): Promise<ChecklistQuestion[]> {
    try {
      // Try to get user's custom template from Supabase
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from('user_settings')
          .select('value')
          .eq('user_id', user.id)
          .eq('key_name', 'checklist_template')
          .single();

        if (!error && data && data.value) {
          try {
            const template = JSON.parse(data.value);
            if (Array.isArray(template) && template.length > 0) {
              console.log('[ChecklistService] Using custom template from database');
              return template;
            }
          } catch (parseError) {
            console.warn('[ChecklistService] Failed to parse custom template:', parseError);
          }
        }
      }

      console.log('[ChecklistService] Using default template');
      return DEFAULT_COMPLIANCE_CHECKLIST;
    } catch (error) {
      console.error('[ChecklistService] Failed to get template:', error);
      return DEFAULT_COMPLIANCE_CHECKLIST;
    }
  }

  async saveTemplate(template: ChecklistQuestion[]): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { error } = await supabase
        .from('user_settings')
        .upsert([{
          user_id: user.id,
          key_name: 'checklist_template',
          value: JSON.stringify(template)
        }]);

      if (error) throw error;
      console.log('[ChecklistService] Template saved successfully');
    } catch (error) {
      console.error('[ChecklistService] Failed to save template:', error);
      throw error;
    }
  }

  async restoreDefaultTemplate(): Promise<void> {
    try {
      await this.saveTemplate(DEFAULT_COMPLIANCE_CHECKLIST);
      console.log('[ChecklistService] Default template restored');
    } catch (error) {
      console.error('[ChecklistService] Failed to restore default template:', error);
      throw error;
    }
  }

  createSurveyChecklist(surveyId: string): ChecklistQuestion[] {
    // Deep clone the template for the survey
    return DEFAULT_COMPLIANCE_CHECKLIST.map(question => ({
      ...question,
      id: `${surveyId}_${question.id}`, // Make unique per survey
      answer: undefined,
      note: '',
      media: []
    }));
  }

  validateTemplate(template: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!Array.isArray(template)) {
      errors.push('Template must be an array');
      return { isValid: false, errors };
    }
    
    if (template.length === 0) {
      errors.push('Template cannot be empty');
    }
    
    template.forEach((question, index) => {
      if (!question.id) {
        errors.push(`Question ${index + 1}: Missing ID`);
      }
      if (!question.category) {
        errors.push(`Question ${index + 1}: Missing category`);
      }
      if (!question.question) {
        errors.push(`Question ${index + 1}: Missing question text`);
      }
      if (typeof question.required !== 'boolean') {
        errors.push(`Question ${index + 1}: Required field must be boolean`);
      }
    });
    
    return { isValid: errors.length === 0, errors };
  }
}

export const checklistService = new ChecklistService();
