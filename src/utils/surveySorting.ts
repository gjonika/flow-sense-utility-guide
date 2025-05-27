
import { Survey } from '@/types/survey';
import { StoredSurvey } from '@/types/storage';

export type SortOption = 'upcoming_first' | 'oldest_created' | 'newest_created' | 'completed_first' | 'sync_status';

export interface SortConfig {
  value: SortOption;
  label: string;
  description: string;
}

export const SORT_OPTIONS: SortConfig[] = [
  {
    value: 'upcoming_first',
    label: 'Upcoming First',
    description: 'Sort by survey date (soonest first)'
  },
  {
    value: 'oldest_created', 
    label: 'Oldest Created',
    description: 'Sort by creation date (oldest first)'
  },
  {
    value: 'newest_created',
    label: 'Newest Created', 
    description: 'Sort by creation date (newest first)'
  },
  {
    value: 'completed_first',
    label: 'Completed First',
    description: 'Completed → In Progress → Draft'
  },
  {
    value: 'sync_status',
    label: 'Sync Status',
    description: 'Pending sync → Synced'
  }
];

const STATUS_PRIORITY = {
  'completed': 1,
  'in-progress': 2,
  'draft': 3
};

export function sortSurveys(surveys: (Survey | StoredSurvey)[], sortBy: SortOption): (Survey | StoredSurvey)[] {
  const sortedSurveys = [...surveys];

  switch (sortBy) {
    case 'upcoming_first':
      return sortedSurveys.sort((a, b) => {
        // First: Sort by survey date (soonest first)
        const dateA = a.survey_date ? new Date(a.survey_date) : new Date('9999-12-31');
        const dateB = b.survey_date ? new Date(b.survey_date) : new Date('9999-12-31');
        const dateDiff = dateA.getTime() - dateB.getTime();
        if (dateDiff !== 0) return dateDiff;

        // Then: Sort by sync status (unsynced first)
        const syncA = ('needs_sync' in a && a.needs_sync) ? 0 : 1;
        const syncB = ('needs_sync' in b && b.needs_sync) ? 0 : 1;
        const syncDiff = syncA - syncB;
        if (syncDiff !== 0) return syncDiff;

        // Finally: Sort by creation date (oldest first)
        const createdA = new Date(a.created_at || '1970-01-01');
        const createdB = new Date(b.created_at || '1970-01-01');
        return createdA.getTime() - createdB.getTime();
      });

    case 'oldest_created':
      return sortedSurveys.sort((a, b) => {
        const createdA = new Date(a.created_at || '1970-01-01');
        const createdB = new Date(b.created_at || '1970-01-01');
        return createdA.getTime() - createdB.getTime();
      });

    case 'newest_created':
      return sortedSurveys.sort((a, b) => {
        const createdA = new Date(a.created_at || '1970-01-01');
        const createdB = new Date(b.created_at || '1970-01-01');
        return createdB.getTime() - createdA.getTime();
      });

    case 'completed_first':
      return sortedSurveys.sort((a, b) => {
        const priorityA = STATUS_PRIORITY[a.status as keyof typeof STATUS_PRIORITY] || 4;
        const priorityB = STATUS_PRIORITY[b.status as keyof typeof STATUS_PRIORITY] || 4;
        return priorityA - priorityB;
      });

    case 'sync_status':
      return sortedSurveys.sort((a, b) => {
        const syncA = ('needs_sync' in a && a.needs_sync) ? 0 : 1;
        const syncB = ('needs_sync' in b && b.needs_sync) ? 0 : 1;
        return syncA - syncB;
      });

    default:
      return sortedSurveys;
  }
}

export function getSortFromQuery(searchParams: URLSearchParams): SortOption {
  const sortParam = searchParams.get('sort');
  const isValidSort = SORT_OPTIONS.some(option => option.value === sortParam);
  return isValidSort ? (sortParam as SortOption) : 'upcoming_first';
}

export function getSavedSortPreference(): SortOption {
  const saved = localStorage.getItem('survey-sort-preference');
  const isValidSort = SORT_OPTIONS.some(option => option.value === saved);
  return isValidSort ? (saved as SortOption) : 'upcoming_first';
}

export function saveSortPreference(sortBy: SortOption): void {
  localStorage.setItem('survey-sort-preference', sortBy);
}
