
import { useCallback } from 'react';
import { Survey } from '@/types/survey';
import { useOnlineStatusManager } from './useOnlineStatusManager';
import { useSyncOperations, SurveyWithSyncStatus } from './useSyncOperations';
import { surveyOperationsService } from '@/services/surveyOperationsService';

export type { SyncStatus, SurveyWithSyncStatus } from './useSyncOperations';

export const useSyncManager = () => {
  const { isOnline, retryAttempts } = useOnlineStatusManager();
  const { syncingCount, syncAllPendingSurveys, getOfflineSurveys, syncSurvey } = useSyncOperations(isOnline);

  // Save survey online directly (no offline storage)
  const saveOffline = useCallback(async (survey: Omit<Survey, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'last_synced_at' | 'needs_sync'>, tempId?: string): Promise<string> => {
    return surveyOperationsService.saveSurvey(survey, tempId);
  }, []);

  return {
    isOnline,
    syncingCount,
    retryAttempts,
    saveOffline,
    syncAllPendingSurveys,
    getOfflineSurveys,
    syncSurvey,
  };
};
