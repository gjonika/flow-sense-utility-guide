
// List of suppliers per utility type
export const suppliersByType = {
  electricity: [{ id: 'elektrum', name: 'Elektrum', requiresReading: true, unit: 'kWh' }],
  gas: [{ id: 'ignitis', name: 'Ignitis', requiresReading: true, unit: 'm³' }],
  hotWater: [{ id: 'klaipedosEnergija', name: 'Klaipėdos Energija', requiresReading: true, unit: 'm³' }],
  water: [{ id: 'klaipedosVanduo', name: 'Klaipėdos Vanduo', requiresReading: true, unit: 'm³' }],
  housing: [{ id: 'paslauga', name: 'Paslaugos Būstui', requiresReading: false }],
  internet: [{ id: 'telia', name: 'Telia', requiresReading: false, unit: 'GB' }],
  phone: [{ id: 'arvilas', name: 'Arvilas', requiresReading: false }],
  renovation: [{ id: 'paslauga', name: 'Paslaugos Būstui', requiresReading: false }],
  loan: [{ id: 'bank', name: 'Bank', requiresReading: false }],
  interest: [{ id: 'bank', name: 'Bank', requiresReading: false }],
  insurance: [{ id: 'various', name: 'Various', requiresReading: false }],
  waste: [{ id: 'kratc', name: 'KRATC', requiresReading: false }],
};

export type SupplierType = keyof typeof suppliersByType;

export interface Supplier {
  id: string;
  name: string;
  requiresReading: boolean;
  unit?: string;
}
