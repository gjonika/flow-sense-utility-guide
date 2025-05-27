
import { useEffect } from 'react';
import { useOnlineStatus } from './useOnlineStatus';
import { useZoneData } from './useZoneData';

export const useZoneManager = (surveyId: string) => {
  const isOnline = useOnlineStatus();
  const { zones, notes, loading, createZone, createNote, loadData } = useZoneData(surveyId, isOnline);

  // Load data when surveyId or online status changes
  useEffect(() => {
    if (surveyId) {
      loadData();
    }
  }, [surveyId, isOnline, loadData]);

  return {
    zones,
    notes,
    loading,
    isOnline,
    createZone,
    createNote,
    refetch: loadData,
  };
};
