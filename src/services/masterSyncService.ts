
import { supabase } from '@/integrations/supabase/client';

export interface SyncResult {
  surveyId: string;
  success: boolean;
  error?: string;
}

export interface SyncProgress {
  current: number;
  total: number;
  currentSurvey?: string;
  currentPhase?: string;
}

class MasterSyncService {
  async forceSyncAll(): Promise<SyncResult[]> {
    console.log('[MasterSync] Force sync not needed in online-only mode');
    return [];
  }

  async deleteSurvey(surveyId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('surveys')
        .delete()
        .eq('id', surveyId);

      if (error) {
        throw error;
      }

      return true;
    } catch (error) {
      console.error('[MasterSync] Failed to delete survey:', error);
      return false;
    }
  }

  async getSyncStatus(): Promise<{ needsSync: number; total: number }> {
    // In online-only mode, no surveys need sync
    return { needsSync: 0, total: 0 };
  }

  getCurrentProgress(): SyncProgress {
    // In online-only mode, no sync progress needed
    return { current: 0, total: 0 };
  }
}

export const masterSyncService = new MasterSyncService();
