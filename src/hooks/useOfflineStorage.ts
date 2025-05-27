
import { useState, useEffect, useCallback } from 'react';
import { offlineDB, OfflineSurvey, OfflineZone, OfflineNote, OfflineMedia, OfflineChecklistResponse } from '@/lib/offlineStorage';
import { useToast } from '@/hooks/use-toast';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';

export const useOfflineStorage = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [storageInfo, setStorageInfo] = useState({ used: 0, available: 0 });
  const { toast } = useToast();
  const isOnline = useOnlineStatus();

  // Initialize offline database
  useEffect(() => {
    const init = async () => {
      try {
        await offlineDB.open();
        setIsInitialized(true);
        console.log('[OfflineStorage] Database initialized successfully');
      } catch (error) {
        console.error('[OfflineStorage] Failed to initialize database:', error);
        toast({
          title: "Offline Storage Error",
          description: "Failed to initialize offline storage. Some features may not work.",
          variant: "destructive",
        });
      }
    };
    init();
  }, [toast]);

  // Monitor storage usage
  const updateStorageInfo = useCallback(async () => {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      const estimate = await navigator.storage.estimate();
      setStorageInfo({
        used: estimate.usage || 0,
        available: estimate.quota || 0
      });
    }
  }, []);

  useEffect(() => {
    if (isInitialized) {
      updateStorageInfo();
      // Update storage info every 30 seconds
      const interval = setInterval(updateStorageInfo, 30000);
      return () => clearInterval(interval);
    }
  }, [isInitialized, updateStorageInfo]);

  // Save survey offline
  const saveSurveyOffline = useCallback(async (survey: Omit<OfflineSurvey, 'needs_sync' | 'offline_created' | 'version'>): Promise<string> => {
    if (!isInitialized) throw new Error('Offline storage not initialized');

    const now = new Date().toISOString();
    const offlineSurvey: OfflineSurvey = {
      ...survey,
      id: survey.id || crypto.randomUUID(),
      created_at: survey.created_at || now,
      updated_at: now,
      needs_sync: true,
      offline_created: !survey.id.includes('temp_') && !isOnline,
      version: 1
    };

    await offlineDB.surveys.put(offlineSurvey);
    console.log(`[OfflineStorage] Survey saved offline: ${offlineSurvey.id}`);
    return offlineSurvey.id;
  }, [isInitialized, isOnline]);

  // Save zone offline
  const saveZoneOffline = useCallback(async (zone: Omit<OfflineZone, 'needs_sync' | 'offline_created' | 'version'>): Promise<string> => {
    if (!isInitialized) throw new Error('Offline storage not initialized');

    const now = new Date().toISOString();
    const offlineZone: OfflineZone = {
      ...zone,
      id: zone.id || crypto.randomUUID(),
      created_at: zone.created_at || now,
      needs_sync: true,
      offline_created: !isOnline,
      version: 1
    };

    await offlineDB.zones.put(offlineZone);
    console.log(`[OfflineStorage] Zone saved offline: ${offlineZone.id}`);
    return offlineZone.id;
  }, [isInitialized, isOnline]);

  // Save note offline
  const saveNoteOffline = useCallback(async (note: Omit<OfflineNote, 'needs_sync' | 'offline_created' | 'version'>): Promise<string> => {
    if (!isInitialized) throw new Error('Offline storage not initialized');

    const now = new Date().toISOString();
    const offlineNote: OfflineNote = {
      ...note,
      id: note.id || crypto.randomUUID(),
      created_at: note.created_at || now,
      updated_at: now,
      needs_sync: true,
      offline_created: !isOnline,
      version: 1
    };

    await offlineDB.notes.put(offlineNote);
    console.log(`[OfflineStorage] Note saved offline: ${offlineNote.id}`);
    return offlineNote.id;
  }, [isInitialized, isOnline]);

  // Save media offline (with blob data)
  const saveMediaOffline = useCallback(async (media: Omit<OfflineMedia, 'needs_sync' | 'offline_created' | 'version'>, file?: File): Promise<string> => {
    if (!isInitialized) throw new Error('Offline storage not initialized');

    const now = new Date().toISOString();
    const offlineMedia: OfflineMedia = {
      ...media,
      id: media.id || crypto.randomUUID(),
      created_at: media.created_at || now,
      needs_sync: true,
      offline_created: !isOnline,
      version: 1,
      blob_data: file
    };

    await offlineDB.media.put(offlineMedia);
    console.log(`[OfflineStorage] Media saved offline: ${offlineMedia.id}`);
    return offlineMedia.id;
  }, [isInitialized, isOnline]);

  // Get all items that need sync
  const getItemsNeedingSync = useCallback(async () => {
    if (!isInitialized) return { surveys: [], zones: [], notes: [], media: [], checklistResponses: [] };

    const [surveys, zones, notes, media, checklistResponses] = await Promise.all([
      offlineDB.surveys.where('needs_sync').equals(1).toArray(),
      offlineDB.zones.where('needs_sync').equals(1).toArray(),
      offlineDB.notes.where('needs_sync').equals(1).toArray(),
      offlineDB.media.where('needs_sync').equals(1).toArray(),
      offlineDB.checklist_responses.where('needs_sync').equals(1).toArray()
    ]);

    return { surveys, zones, notes, media, checklistResponses };
  }, [isInitialized]);

  // Mark item as synced
  const markAsSynced = useCallback(async (type: 'survey' | 'zone' | 'note' | 'media' | 'checklist_response', id: string) => {
    if (!isInitialized) return;

    const now = new Date().toISOString();
    const table = offlineDB[type === 'checklist_response' ? 'checklist_responses' : `${type}s`];
    
    await table.update(id, {
      needs_sync: false,
      last_synced_at: now
    });

    console.log(`[OfflineStorage] Marked ${type} ${id} as synced`);
  }, [isInitialized]);

  return {
    isInitialized,
    storageInfo,
    saveSurveyOffline,
    saveZoneOffline,
    saveNoteOffline,
    saveMediaOffline,
    getItemsNeedingSync,
    markAsSynced,
    updateStorageInfo
  };
};
