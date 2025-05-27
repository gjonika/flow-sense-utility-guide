
import { useState, useEffect, useCallback } from 'react';
import { offlineDB, SyncQueueItem } from '@/lib/offlineStorage';
import { useToast } from '@/hooks/use-toast';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';

interface SyncProgress {
  current: number;
  total: number;
  currentItem?: string;
  isActive: boolean;
}

export const useSyncQueue = () => {
  const [syncing, setSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState<SyncProgress>({ current: 0, total: 0, isActive: false });
  const [queuedItems, setQueuedItems] = useState<SyncQueueItem[]>([]);
  const [errorTracker, setErrorTracker] = useState<Record<string, string>>({});
  const { toast } = useToast();
  const isOnline = useOnlineStatus();

  // Load queued items
  const loadQueuedItems = useCallback(async () => {
    try {
      const items = await offlineDB.sync_queue
        .orderBy('priority')
        .reverse()
        .toArray();
      setQueuedItems(items);
    } catch (error) {
      console.error('[SyncQueue] Failed to load queued items:', error);
    }
  }, []);

  useEffect(() => {
    loadQueuedItems();
    // Refresh queue every 10 seconds
    const interval = setInterval(loadQueuedItems, 10000);
    return () => clearInterval(interval);
  }, [loadQueuedItems]);

  // Add item to sync queue
  const addToSyncQueue = useCallback(async (
    type: SyncQueueItem['type'],
    dataId: string,
    action: SyncQueueItem['action'],
    priority: number = 1
  ): Promise<void> => {
    const queueItem: SyncQueueItem = {
      id: crypto.randomUUID(),
      type,
      data_id: dataId,
      action,
      created_at: new Date().toISOString(),
      retry_count: 0,
      priority
    };

    await offlineDB.sync_queue.add(queueItem);
    await loadQueuedItems();
    console.log(`[SyncQueue] Added ${type} ${dataId} to sync queue`);
  }, [loadQueuedItems]);

  // Remove item from sync queue
  const removeFromSyncQueue = useCallback(async (queueItemId: string): Promise<void> => {
    await offlineDB.sync_queue.delete(queueItemId);
    await loadQueuedItems();
  }, [loadQueuedItems]);

  // Process sync queue (placeholder for actual sync logic)
  const processSyncQueue = useCallback(async (): Promise<void> => {
    if (!isOnline || syncing) {
      console.log('[SyncQueue] Cannot sync: offline or already syncing');
      return;
    }

    const items = await offlineDB.sync_queue
      .orderBy('priority')
      .reverse()
      .limit(50) // Process in batches
      .toArray();

    if (items.length === 0) {
      console.log('[SyncQueue] No items to sync');
      return;
    }

    setSyncing(true);
    setSyncProgress({ current: 0, total: items.length, isActive: true });

    try {
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        setSyncProgress(prev => ({ 
          ...prev, 
          current: i + 1,
          currentItem: `${item.type}: ${item.data_id.substring(0, 8)}...`
        }));

        try {
          // TODO: Implement actual sync logic here
          // This is where we'll call the appropriate service methods
          console.log(`[SyncQueue] Processing ${item.type} ${item.data_id}`);
          
          // Simulate sync delay
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // Remove successful item from queue
          await removeFromSyncQueue(item.id);
          
          // Clear any previous errors for this item
          setErrorTracker(prev => {
            const updated = { ...prev };
            delete updated[item.id];
            return updated;
          });

        } catch (error) {
          console.error(`[SyncQueue] Failed to sync ${item.type} ${item.data_id}:`, error);
          
          // Update retry count and error
          await offlineDB.sync_queue.update(item.id, {
            retry_count: item.retry_count + 1,
            last_error: error instanceof Error ? error.message : 'Unknown error'
          });

          setErrorTracker(prev => ({
            ...prev,
            [item.id]: error instanceof Error ? error.message : 'Unknown error'
          }));

          // Remove item if too many retries
          if (item.retry_count >= 3) {
            await removeFromSyncQueue(item.id);
            toast({
              title: "Sync Failed",
              description: `Failed to sync ${item.type} after 3 attempts. Item removed from queue.`,
              variant: "destructive",
            });
          }
        }
      }

      const remainingItems = await offlineDB.sync_queue.count();
      if (remainingItems === 0) {
        toast({
          title: "Sync Complete",
          description: "All items have been synchronized successfully.",
        });
      }

    } finally {
      setSyncing(false);
      setSyncProgress({ current: 0, total: 0, isActive: false });
      await loadQueuedItems();
    }
  }, [isOnline, syncing, removeFromSyncQueue, toast]);

  // Auto-sync when coming online
  useEffect(() => {
    if (isOnline && queuedItems.length > 0 && !syncing) {
      console.log('[SyncQueue] Device came online, starting auto-sync');
      const timer = setTimeout(() => {
        processSyncQueue();
      }, 2000); // Small delay to ensure connection is stable
      return () => clearTimeout(timer);
    }
  }, [isOnline, queuedItems.length, syncing, processSyncQueue]);

  const failedSurveys = queuedItems.filter(item => item.type === 'survey' && item.retry_count > 0);
  const errorSurveys = queuedItems.filter(item => errorTracker[item.id]);

  return {
    syncing,
    syncProgress,
    isOnline,
    queuedItems,
    errorTracker,
    failedSurveys,
    errorSurveys,
    addToSyncQueue,
    removeFromSyncQueue,
    processSyncQueue,
    retryFailedSurvey: processSyncQueue, // Alias for backward compatibility
    forceSyncAll: processSyncQueue,
    syncAllPending: processSyncQueue
  };
};
