
import { AccordionSection } from '@/types/assessment';

export const ACCORDION_SECTIONS: AccordionSection[] = [
  {
    id: 'demolition',
    title: '🔨 DEMOLITION',
    description: 'Removal and demolition work required before refurbishment',
    colorClass: 'bg-red-50 border-red-200',
    categories: ['Demolition']
  },
  {
    id: 'deckheads',
    title: '🏗️ DECKHEADS',
    description: 'Ceiling structures and overhead systems',
    colorClass: 'bg-slate-50 border-slate-200',
    categories: ['Deckheads']
  },
  {
    id: 'structure',
    title: '🧱 STRUCTURE, FIRE BOUNDARIES & BULKHEADS',
    description: 'Structural elements, fire safety boundaries, and partition walls',
    colorClass: 'bg-orange-50 border-orange-200',
    categories: ['Structure', 'Fire Boundaries', 'Bulkheads']
  },
  {
    id: 'doors-windows',
    title: '🚪 DOORS & WINDOWS',
    description: 'Entry points, portlights, and glazing systems',
    colorClass: 'bg-blue-50 border-blue-200',
    categories: ['Doors', 'Windows']
  },
  {
    id: 'deck-flooring',
    title: '🪜 DECK & FLOORING',
    description: 'Floor surfaces, subflooring, and deck materials',
    colorClass: 'bg-green-50 border-green-200',
    categories: ['Deck', 'Flooring']
  },
  {
    id: 'painting-finishes',
    title: '🎨 PAINTING & FINISHES',
    description: 'Surface treatments, coatings, and decorative finishes',
    colorClass: 'bg-purple-50 border-purple-200',
    categories: ['Painting', 'Finishes']
  },
  {
    id: 'electrical-lighting',
    title: '💡 ELECTRICAL & LIGHTING',
    description: 'Electrical systems, lighting fixtures, and power distribution',
    colorClass: 'bg-yellow-50 border-yellow-200',
    categories: ['Electrical', 'Lighting']
  },
  {
    id: 'hvac-mechanical',
    title: '🌬️ HVAC / MECHANICAL & PIPING',
    description: 'Climate control, ventilation, and mechanical systems',
    colorClass: 'bg-cyan-50 border-cyan-200',
    categories: ['HVAC', 'Mechanical', 'Piping']
  },
  {
    id: 'plumbing-supplies',
    title: '🚿 PLUMBING SUPPLIES & WASTEAGE',
    description: 'Water systems, sanitary facilities, and waste management',
    colorClass: 'bg-teal-50 border-teal-200',
    categories: ['Plumbing Supplies', 'Wasteage']
  },
  {
    id: 'equipment',
    title: '⚙️ EQUIPMENT',
    description: 'Mechanical equipment, appliances, and technical installations',
    colorClass: 'bg-gray-50 border-gray-200',
    categories: ['Equipment']
  },
  {
    id: 'signage',
    title: '🪧 SIGNAGE',
    description: 'Wayfinding, safety signage, and information displays',
    colorClass: 'bg-indigo-50 border-indigo-200',
    categories: ['Signage']
  },
  {
    id: 'artwork',
    title: '🖼️ ARTWORK',
    description: 'Decorative art, sculptures, and artistic installations',
    colorClass: 'bg-pink-50 border-pink-200',
    categories: ['Artwork']
  },
  {
    id: 'audio-visual',
    title: '📺 AUDIO / VISUAL',
    description: 'Entertainment systems, speakers, and display technology',
    colorClass: 'bg-violet-50 border-violet-200',
    categories: ['Audio', 'Visual']
  },
  {
    id: 'fixed-furniture',
    title: '🪑 FIXED FURNITURE',
    description: 'Built-in furniture, cabinetry, and permanent fixtures',
    colorClass: 'bg-amber-50 border-amber-200',
    categories: ['Fixed Furniture']
  },
  {
    id: 'loose-furniture',
    title: '🛋️ LOOSE FURNITURE',
    description: 'Movable furniture, chairs, tables, and storage',
    colorClass: 'bg-emerald-50 border-emerald-200',
    categories: ['Loose Furniture']
  },
  {
    id: 'soft-furnishings',
    title: '🛏️ SOFT FURNISHINGS',
    description: 'Upholstery, cushions, bedding, and textile elements',
    colorClass: 'bg-rose-50 border-rose-200',
    categories: ['Soft Furnishings']
  },
  {
    id: 'window-treatment',
    title: '🪟 WINDOW TREATMENT',
    description: 'Curtains, blinds, and window covering systems',
    colorClass: 'bg-sky-50 border-sky-200',
    categories: ['Window Treatment']
  },
  {
    id: 'miscellaneous',
    title: '📦 MISCELLANEOUS',
    description: 'Other items not categorized elsewhere',
    colorClass: 'bg-neutral-50 border-neutral-200',
    categories: ['Miscellaneous']
  }
];
