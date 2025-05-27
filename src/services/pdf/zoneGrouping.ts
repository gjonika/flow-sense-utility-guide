
import { SurveyZone } from '@/types/survey';
import { HierarchicalZones } from './types';

export class ZoneGroupingService {
  static groupZonesHierarchically(zones: SurveyZone[]): HierarchicalZones {
    const hierarchy: HierarchicalZones = {};
    
    zones.forEach(zone => {
      const deck = zone.zone_metadata?.floorLevel || 'Unknown Deck';
      const zoneType = zone.zone_type || 'other';
      
      if (!hierarchy[deck]) hierarchy[deck] = {};
      if (!hierarchy[deck][zoneType]) hierarchy[deck][zoneType] = [];
      
      hierarchy[deck][zoneType].push(zone);
    });

    // Sort zones within each group by name
    Object.keys(hierarchy).forEach(deck => {
      Object.keys(hierarchy[deck]).forEach(zoneType => {
        hierarchy[deck][zoneType].sort((a, b) => a.zone_name.localeCompare(b.zone_name));
      });
    });

    return hierarchy;
  }
}
