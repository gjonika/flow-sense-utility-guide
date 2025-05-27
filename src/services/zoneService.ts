
import { supabase } from '@/integrations/supabase/client';
import { SurveyZone } from '@/types/survey';

export class ZoneService {
  async fetchZones(surveyId: string): Promise<SurveyZone[]> {
    try {
      console.log('[ZoneService] Fetching zones for survey:', surveyId);
      
      const { data, error } = await supabase
        .from('survey_zones')
        .select('*')
        .eq('survey_id', surveyId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('[ZoneService] Error fetching zones:', error);
        throw error;
      }
      
      console.log('[ZoneService] Fetched zones:', data);
      
      return (data || []).map(zone => ({
        ...zone,
        zone_type: zone.zone_type as SurveyZone['zone_type'],
        zone_subtype: zone.zone_subtype || undefined,
        zone_description: zone.zone_description || undefined,
        zone_metadata: (zone.zone_metadata as any) || {
          capacity: undefined,
          specialRequirements: undefined,
          lastUpdated: undefined
        }
      }));
    } catch (error) {
      console.error('[ZoneService] Failed to fetch zones:', error);
      return [];
    }
  }

  async createZone(surveyId: string, zoneName: string, zoneType: SurveyZone['zone_type']): Promise<SurveyZone> {
    try {
      console.log('[ZoneService] Creating zone:', { surveyId, zoneName, zoneType });
      
      // Ensure we have valid inputs
      if (!surveyId || !zoneName || !zoneType) {
        throw new Error('Missing required parameters for zone creation');
      }

      const { data, error } = await supabase
        .from('survey_zones')
        .insert([{
          survey_id: surveyId,
          zone_name: zoneName.trim(),
          zone_type: zoneType,
        }])
        .select()
        .single();

      if (error) {
        console.error('[ZoneService] Error creating zone:', error);
        throw new Error(`Failed to create zone: ${error.message}`);
      }

      if (!data) {
        throw new Error('No data returned from zone creation');
      }

      console.log('[ZoneService] Zone created successfully:', data);

      return {
        ...data,
        zone_type: data.zone_type as SurveyZone['zone_type'],
        zone_subtype: data.zone_subtype || undefined,
        zone_description: data.zone_description || undefined,
        zone_metadata: (data.zone_metadata as any) || {
          capacity: undefined,
          specialRequirements: undefined,
          lastUpdated: undefined
        }
      };
    } catch (error) {
      console.error('[ZoneService] Failed to create zone:', error);
      throw error instanceof Error ? error : new Error('Unknown error creating zone');
    }
  }

  async updateZone(zoneId: string, updates: Partial<SurveyZone>): Promise<SurveyZone> {
    try {
      console.log('[ZoneService] Updating zone:', { zoneId, updates });
      
      const { data, error } = await supabase
        .from('survey_zones')
        .update(updates)
        .eq('id', zoneId)
        .select()
        .single();

      if (error) {
        console.error('[ZoneService] Error updating zone:', error);
        throw error;
      }

      console.log('[ZoneService] Zone updated successfully:', data);

      return {
        ...data,
        zone_type: data.zone_type as SurveyZone['zone_type'],
        zone_subtype: data.zone_subtype || undefined,
        zone_description: data.zone_description || undefined,
        zone_metadata: (data.zone_metadata as any) || {
          capacity: undefined,
          specialRequirements: undefined,
          lastUpdated: undefined
        }
      };
    } catch (error) {
      console.error('[ZoneService] Failed to update zone:', error);
      throw error;
    }
  }
}

export const zoneService = new ZoneService();
