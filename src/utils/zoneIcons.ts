
export const ZONE_ICONS = {
  cabin: '🛏️',
  galley: '🍳',
  corridor: '↔️',
  office: '🖥️',
  lounge: '🛋️',
  'wet-unit': '🚿',
  area: '📐',
  restaurant: '🍽️',
  bar: '🍸',
  technical: '⚙️',
  service: '🔧',
  circulation: '🚶',
  entertainment: '🎭',
  spa: '🧖‍♀️',
  shop: '🛍️',
  medical: '🏥',
  crew: '👥',
  bridge: '🧭',
  public_zone: '🏛️',
  other: '📍'
};

export const getZoneIcon = (zoneType: string): string => {
  return ZONE_ICONS[zoneType as keyof typeof ZONE_ICONS] || ZONE_ICONS.other;
};

export const getZoneDisplayName = (zoneType: string, zoneName: string): string => {
  const icon = getZoneIcon(zoneType);
  return `${icon} ${zoneName}`;
};
