
import { useState, useCallback } from 'react';
import { SurveyZone, SurveyNote } from '@/types/survey';
import { zoneService } from '@/services/zoneService';
import { noteService } from '@/services/noteService';
import { useToast } from '@/hooks/use-toast';

export const useZoneData = (surveyId: string, isOnline: boolean) => {
  const [zones, setZones] = useState<SurveyZone[]>([]);
  const [notes, setNotes] = useState<SurveyNote[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      
      if (isOnline) {
        const [fetchedZones, fetchedNotes] = await Promise.all([
          zoneService.fetchZones(surveyId),
          noteService.fetchNotes(surveyId)
        ]);
        
        setZones(fetchedZones);
        setNotes(fetchedNotes);
      } else {
        toast({
          title: "Offline",
          description: "Cannot load data while offline",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Failed to load data:', error);
      toast({
        title: "Error",
        description: "Failed to load zones and notes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [surveyId, isOnline, toast]);

  const createZone = async (zoneName: string, zoneType: SurveyZone['zone_type']) => {
    if (!isOnline) {
      toast({
        title: "Offline",
        description: "Cannot create zones while offline",
        variant: "destructive",
      });
      return;
    }

    try {
      const newZone = await zoneService.createZone(surveyId, zoneName, zoneType);
      setZones(prev => [...prev, newZone]);
      toast({
        title: "Success",
        description: "Zone created successfully",
      });
      return newZone;
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
    if (!isOnline) {
      toast({
        title: "Offline",
        description: "Cannot create notes while offline",
        variant: "destructive",
      });
      return;
    }

    try {
      const newNote = await noteService.createNote(surveyId, zoneId, noteContent);
      setNotes(prev => [...prev, newNote]);
      toast({
        title: "Success",
        description: "Note created successfully",
      });
      return newNote;
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

  return {
    zones,
    notes,
    loading,
    createZone,
    createNote,
    loadData,
  };
};
