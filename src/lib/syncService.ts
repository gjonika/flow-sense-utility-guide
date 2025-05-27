
import { supabase } from '@/integrations/supabase/client';
import { Survey, ClientContact } from '@/types/survey';

// Helper functions for type conversion
const parseClientContacts = (data: any): ClientContact[] => {
  if (!data) return [];
  if (Array.isArray(data)) {
    return data.filter(contact => 
      contact && 
      typeof contact === 'object' && 
      typeof contact.name === 'string'
    ).map(contact => ({
      name: contact.name || '',
      email: contact.email || '',
      phone: contact.phone || ''
    }));
  }
  return [];
};

const parseCustomFields = (data: any): { [key: string]: string } => {
  if (!data || typeof data !== 'object') return {};
  return data;
};

const parseTools = (data: any): string[] => {
  if (!data) return [];
  if (Array.isArray(data)) return data.filter(tool => typeof tool === 'string');
  return [];
};

// Online-only mode - no sync needed
export const syncOfflineSurveys = async (): Promise<Survey[]> => {
  console.log('[syncService] No offline surveys to sync in online-only mode');
  return [];
};

// Online-only mode - redirect to online storage
export const saveOfflineSurvey = async (survey: Omit<Survey, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'last_synced_at' | 'needs_sync'>, tempId?: string): Promise<string> => {
  console.warn('[syncService] saveOfflineSurvey called in online-only mode. Use online storage instead.');
  throw new Error('Offline storage not supported. Use online storage instead.');
};

// Online-only mode - no offline surveys
export const getOfflineSurveys = async (): Promise<Survey[]> => {
  console.log('[syncService] No offline surveys in online-only mode');
  return [];
};

export const getAllSurveys = async (): Promise<Survey[]> => {
  try {
    // Fetch all surveys without user filtering
    const { data, error } = await supabase
      .from('surveys')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    // Cast the data to match our Survey type with proper parsing
    const typedSurveys: Survey[] = (data || []).map(survey => ({
      ...survey,
      client_contacts: parseClientContacts(survey.client_contacts),
      custom_fields: parseCustomFields(survey.custom_fields),
      flight_details: parseCustomFields(survey.flight_details),
      hotel_details: parseCustomFields(survey.hotel_details),
      tools: parseTools(survey.tools),
      status: survey.status as Survey['status'],
      user_id: survey.user_id || null, // Handle null user_id
      client_country: survey.client_country || '',
      project_scope: survey.project_scope || '',
      duration: survey.duration || 0, // Keep as number
      last_synced_at: survey.last_synced_at || null,
      needs_sync: survey.needs_sync || false
    }));

    console.log(`[syncService] Loaded ${typedSurveys.length} surveys from online storage`);
    return typedSurveys;
  } catch (error) {
    console.error('Error fetching surveys:', error);
    throw error;
  }
};
