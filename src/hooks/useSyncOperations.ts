
import { useState, useCallback } from 'react';
import { Survey } from '@/types/survey';
import { useToast } from '@/hooks/use-toast';
import { useMediaSync } from './useMediaSync';

export type SyncStatus = 'draft' | 'saved' | 'synced' | 'error' | 'pending';

export interface SurveyWithSyncStatus extends Survey {
  syncStatus: SyncStatus;
  lastSyncAttempt?: string;
  syncError?: string;
}

export const useSyncOperations = (isOnline: boolean) => {
  const [syncingCount, setSyncingCount] = useState(0);
  const { toast } = useToast();
  const { syncAllPendingMedia } = useMediaSync();

  // Sync all pending surveys (no-op in online-only mode)
  const syncAllPendingSurveys = useCallback(async (): Promise<Survey[]> => {
    if (!isOnline) {
      console.log('Cannot sync: offline');
      return [];
    }

    console.log('[useSyncOperations] No pending surveys to sync in online-only mode');
    await syncAllPendingMedia();
    
    toast({
      title: "No Sync Needed",
      description: "All surveys are already stored online.",
    });
    
    return [];
  }, [isOnline, syncAllPendingMedia, toast]);

  // Get all surveys (no offline surveys)
  const getOfflineSurveys = useCallback(async (): Promise<SurveyWithSyncStatus[]> => {
    console.log('[useSyncOperations] No offline surveys in online-only mode');
    return [];
  }, []);

  // Sync survey method (no-op in online-only mode)
  const syncSurvey = useCallback(async (offlineSurvey: SurveyWithSyncStatus): Promise<Survey | null> => {
    console.log('[useSyncOperations] Survey already stored online:', offlineSurvey.id);
    return offlineSurvey;
  }, []);

  return {
    syncingCount,
    syncAllPendingSurveys,
    getOfflineSurveys,
    syncSurvey,
  };
};
