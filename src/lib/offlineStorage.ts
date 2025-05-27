
import Dexie, { Table } from 'dexie';
import { Survey, SurveyZone, SurveyNote, SurveyMedia } from '@/types/survey';
import { ChecklistResponse } from '@/types/checklist';

// Offline data schemas that mirror Supabase structures
export interface OfflineSurvey extends Omit<Survey, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'last_synced_at'> {
  id: string;
  user_id?: string;
  created_at: string;
  updated_at: string;
  last_synced_at?: string;
  needs_sync: boolean;
  offline_created: boolean;
  version: number;
}

export interface OfflineZone extends Omit<SurveyZone, 'created_at'> {
  created_at: string;
  needs_sync: boolean;
  offline_created: boolean;
  version: number;
}

export interface OfflineNote extends Omit<SurveyNote, 'created_at' | 'updated_at' | 'last_synced_at'> {
  created_at: string;
  updated_at: string;
  last_synced_at?: string;
  needs_sync: boolean;
  offline_created: boolean;
  version: number;
}

export interface OfflineMedia extends Omit<SurveyMedia, 'created_at' | 'last_synced_at'> {
  created_at: string;
  last_synced_at?: string;
  needs_sync: boolean;
  offline_created: boolean;
  version: number;
  blob_data?: Blob; // For storing actual file data offline
}

export interface OfflineChecklistResponse extends Omit<ChecklistResponse, 'created_at' | 'updated_at'> {
  created_at: string;
  updated_at: string;
  needs_sync: boolean;
  offline_created: boolean;
  version: number;
}

export interface SyncQueueItem {
  id: string;
  type: 'survey' | 'zone' | 'note' | 'media' | 'checklist_response';
  data_id: string;
  action: 'create' | 'update' | 'delete';
  created_at: string;
  retry_count: number;
  last_error?: string;
  priority: number; // Higher number = higher priority
}

class OfflineDatabase extends Dexie {
  surveys!: Table<OfflineSurvey>;
  zones!: Table<OfflineZone>;
  notes!: Table<OfflineNote>;
  media!: Table<OfflineMedia>;
  checklist_responses!: Table<OfflineChecklistResponse>;
  sync_queue!: Table<SyncQueueItem>;

  constructor() {
    super('ShipSurveyOfflineDB');
    
    this.version(1).stores({
      surveys: 'id, needs_sync, offline_created, status, client_name, ship_name',
      zones: 'id, survey_id, needs_sync, offline_created, zone_name, zone_type',
      notes: 'id, survey_id, zone_id, needs_sync, offline_created',
      media: 'id, survey_id, zone_id, needs_sync, offline_created, file_name',
      checklist_responses: 'id, survey_id, zone_id, question_id, needs_sync, offline_created',
      sync_queue: 'id, type, data_id, priority, created_at, retry_count'
    });
  }
}

export const offlineDB = new OfflineDatabase();

// Storage size management
export const getStorageUsage = async (): Promise<{ used: number; available: number }> => {
  if ('storage' in navigator && 'estimate' in navigator.storage) {
    const estimate = await navigator.storage.estimate();
    return {
      used: estimate.usage || 0,
      available: estimate.quota || 0
    };
  }
  return { used: 0, available: 0 };
};

// Cleanup old offline data
export const cleanupOldData = async (daysOld: number = 30): Promise<void> => {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysOld);
  const cutoffISO = cutoffDate.toISOString();

  await offlineDB.transaction('rw', [offlineDB.surveys, offlineDB.zones, offlineDB.notes, offlineDB.media, offlineDB.checklist_responses], async () => {
    // Only delete synced data that's old
    await offlineDB.surveys.where('last_synced_at').below(cutoffISO).and(item => !item.needs_sync).delete();
    await offlineDB.zones.where('created_at').below(cutoffISO).and(item => !item.needs_sync).delete();
    await offlineDB.notes.where('updated_at').below(cutoffISO).and(item => !item.needs_sync).delete();
    await offlineDB.media.where('created_at').below(cutoffISO).and(item => !item.needs_sync).delete();
    await offlineDB.checklist_responses.where('updated_at').below(cutoffISO).and(item => !item.needs_sync).delete();
  });

  console.log(`[OfflineStorage] Cleaned up data older than ${daysOld} days`);
};
