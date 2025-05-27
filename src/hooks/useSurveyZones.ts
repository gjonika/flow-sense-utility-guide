
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { SurveyZone, SurveyNote } from '@/types/survey';
import { useToast } from '@/hooks/use-toast';

export const useSurveyZones = (surveyId: string) => {
  const [zones, setZones] = useState<SurveyZone[]>([]);
  const [notes, setNotes] = useState<SurveyNote[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchZones = async () => {
    if (!surveyId) return;
    
    try {
      const { data, error } = await supabase
        .from('survey_zones')
        .select('*')
        .eq('survey_id', surveyId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      
      // Cast the data to match our SurveyZone type with proper metadata handling
      const typedZones: SurveyZone[] = (data || []).map(zone => ({
        ...zone,
        zone_type: zone.zone_type as SurveyZone['zone_type'],
        zone_subtype: zone.zone_subtype || undefined,
        zone_description: zone.zone_description || undefined,
        zone_metadata: (zone.zone_metadata as any) || {
          capacity: undefined,
          specialRequirements: undefined,
          lastUpdated: undefined
        }
      }));
      
      setZones(typedZones);
    } catch (error) {
      console.error('Error fetching zones:', error);
    }
  };

  const fetchNotes = async () => {
    if (!surveyId) return;
    
    try {
      const { data, error } = await supabase
        .from('survey_notes')
        .select('*')
        .eq('survey_id', surveyId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      
      // Transform data to match SurveyNote type
      const transformedNotes: SurveyNote[] = (data || []).map(note => ({
        id: note.id,
        survey_id: note.survey_id,
        zone_id: note.zone_id,
        note_text: note.note_text,
        note_type: note.note_type,
        created_at: note.created_at,
        updated_at: note.updated_at
      }));
      
      setNotes(transformedNotes);
    } catch (error) {
      console.error('Error fetching notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const createZone = async (zoneName: string, zoneType: SurveyZone['zone_type']) => {
    try {
      const { data, error } = await supabase
        .from('survey_zones')
        .insert([{
          survey_id: surveyId,
          zone_name: zoneName,
          zone_type: zoneType,
        }])
        .select()
        .single();

      if (error) throw error;
      
      const typedZone: SurveyZone = {
        ...data,
        zone_type: data.zone_type as SurveyZone['zone_type'],
        zone_subtype: data.zone_subtype || undefined,
        zone_description: data.zone_description || undefined,
        zone_metadata: (data.zone_metadata as any) || {
          capacity: undefined,
          specialRequirements: undefined,
          lastUpdated: undefined
        }
      };
      
      setZones(prev => [...prev, typedZone]);
      toast({
        title: "Success",
        description: "Zone created successfully",
      });
      
      return typedZone;
    } catch (error) {
      console.error('Error creating zone:', error);
      toast({
        title: "Error",
        description: "Failed to create zone",
        variant: "destructive",
      });
      throw error;
    }
  };

  const createNote = async (zoneId: string, noteContent: string) => {
    try {
      const { data, error } = await supabase
        .from('survey_notes')
        .insert([{
          survey_id: surveyId,
          zone_id: zoneId,
          note_text: noteContent, // Use note_text instead of note_content
        }])
        .select()
        .single();

      if (error) throw error;
      
      // Transform to match SurveyNote type
      const transformedNote: SurveyNote = {
        id: data.id,
        survey_id: data.survey_id,
        zone_id: data.zone_id,
        note_text: data.note_text,
        note_type: data.note_type,
        created_at: data.created_at,
        updated_at: data.updated_at
      };
      
      setNotes(prev => [...prev, transformedNote]);
      toast({
        title: "Success",
        description: "Note added successfully",
      });
      
      return transformedNote;
    } catch (error) {
      console.error('Error creating note:', error);
      toast({
        title: "Error",
        description: "Failed to add note",
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    if (surveyId) {
      fetchZones();
      fetchNotes();
    }
  }, [surveyId]);

  return {
    zones,
    notes,
    loading,
    createZone,
    createNote,
    refetch: () => {
      fetchZones();
      fetchNotes();
    },
  };
};
