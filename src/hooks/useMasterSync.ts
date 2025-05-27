
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface SyncResult {
  surveyId: string;
  success: boolean;
  error?: string;
}

export interface SyncProgress {
  current: number;
  total: number;
}

export const useMasterSync = () => {
  const [syncing, setSyncing] = useState(false);
  const [progress, setProgress] = useState<SyncProgress>({ current: 0, total: 0 });
  const [syncLog, setSyncLog] = useState<SyncResult[]>([]);
  const { toast } = useToast();

  const forceSyncAll = useCallback(async () => {
    console.log('[useMasterSync] Force sync not needed in online-only mode');
    toast({
      title: "No Sync Needed",
      description: "All surveys are already stored online.",
    });
    return [];
  }, [toast]);

  const deleteSurvey = useCallback(async (surveyId: string, isOnline: boolean = true) => {
    try {
      if (!isOnline) {
        throw new Error('Cannot delete survey while offline');
      }

      const { error } = await import('@/integrations/supabase/client').then(m => 
        m.supabase
          .from('surveys')
          .delete()
          .eq('id', surveyId)
      );

      if (error) {
        throw error;
      }

      toast({
        title: "Survey Deleted",
        description: "Survey has been deleted successfully",
      });
      return true;
    } catch (error) {
      toast({
        title: "Delete Failed",
        description: "Failed to delete survey",
        variant: "destructive",
      });
      return false;
    }
  }, [toast]);

  return {
    syncing,
    progress,
    syncLog,
    forceSyncAll,
    deleteSurvey,
  };
};
