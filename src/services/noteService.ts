
import { supabase } from '@/integrations/supabase/client';
import { SurveyNote } from '@/types/survey';

export class NoteService {
  async fetchNotes(surveyId: string): Promise<SurveyNote[]> {
    try {
      const { data, error } = await supabase
        .from('survey_notes')
        .select('*')
        .eq('survey_id', surveyId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Failed to fetch notes:', error);
      return [];
    }
  }

  async createNote(surveyId: string, zoneId: string, noteContent: string, section?: string): Promise<SurveyNote> {
    const { data, error } = await supabase
      .from('survey_notes')
      .insert([{
        survey_id: surveyId,
        zone_id: zoneId,
        note_content: noteContent,
        section: section || null,
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateNote(noteId: string, noteContent: string): Promise<SurveyNote> {
    const { data, error } = await supabase
      .from('survey_notes')
      .update({
        note_content: noteContent,
        updated_at: new Date().toISOString(),
      })
      .eq('id', noteId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteNote(noteId: string): Promise<void> {
    const { error } = await supabase
      .from('survey_notes')
      .delete()
      .eq('id', noteId);

    if (error) throw error;
  }
}

export const noteService = new NoteService();
