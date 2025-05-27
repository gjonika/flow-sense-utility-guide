
import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { AssessmentItem } from '@/types/assessment';
import { SurveyZone, SurveyNote } from '@/types/survey';
import { AccordionSection } from '@/types/assessment';
import EstimatorAssessmentItem from './EstimatorAssessmentItem';

interface AccordionAssessmentSectionProps {
  section: AccordionSection;
  items: AssessmentItem[];
  surveyId: string;
  zones: SurveyZone[];
  notes: SurveyNote[];
  onItemUpdate: (itemId: string, updates: Partial<AssessmentItem>) => void;
  onAddItem: (category: string) => void;
  onDeleteItem: (itemId: string) => void;
  onCreateNote: (zoneId: string, content: string, section?: string) => Promise<void>;
  onUpdateNote: (noteId: string, content: string) => Promise<void>;
  onDeleteNote: (noteId: string) => Promise<void>;
  onCreateZone: (zoneName: string, zoneType: SurveyZone['zone_type']) => Promise<SurveyZone>;
  expandedCategories: string[];
  onCategoryToggle: (category: string) => void;
}

const AccordionAssessmentSection = ({
  section,
  items,
  surveyId,
  zones,
  notes,
  onItemUpdate,
  onAddItem,
  onDeleteItem,
  onCreateNote,
  onUpdateNote,
  onDeleteNote,
  onCreateZone,
  expandedCategories,
  onCategoryToggle
}: AccordionAssessmentSectionProps) => {
  const sectionItems = items.filter(item => 
    section.categories.includes(item.category)
  );

  const getStatusCounts = () => {
    const noted = sectionItems.filter(item => item.status === 'noted').length;
    const attention = sectionItems.filter(item => item.status === 'requires_attention').length;
    const pending = sectionItems.filter(item => item.status === 'pending').length;
    const na = sectionItems.filter(item => item.status === 'not_applicable').length;
    
    return { noted, attention, pending, na };
  };

  const { noted, attention, pending, na } = getStatusCounts();

  const isExpanded = expandedCategories.includes(section.id);

  return (
    <div className={`border rounded-lg ${section.colorClass} bg-white shadow-sm`}>
      <Accordion 
        type="single" 
        value={isExpanded ? section.id : undefined} 
        onValueChange={(value) => {
          // Toggle the section when accordion value changes
          onCategoryToggle(section.id);
        }}
        collapsible
      >
        <AccordionItem value={section.id} className="border-none">
          <AccordionTrigger className="px-6 py-4 hover:no-underline">
            <div className="flex items-center justify-between w-full mr-4">
              <div className="text-left">
                <h3 className="text-lg font-semibold text-gray-900">{section.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{section.description}</p>
              </div>
              <div className="flex gap-2">
                {noted > 0 && (
                  <Badge className="bg-green-100 text-green-800 text-xs">
                    {noted} Noted
                  </Badge>
                )}
                {attention > 0 && (
                  <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                    {attention} Attention
                  </Badge>
                )}
                {pending > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    {pending} Pending
                  </Badge>
                )}
                {na > 0 && (
                  <Badge className="bg-gray-100 text-gray-800 text-xs">
                    {na} N/A
                  </Badge>
                )}
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-6">
            <div className="space-y-6">
              {sectionItems.length > 0 ? (
                sectionItems.map((item) => (
                  <EstimatorAssessmentItem
                    key={item.id}
                    item={item}
                    onStatusUpdate={(status) => onItemUpdate(item.id, { status })}
                    onNotesUpdate={(notes) => onItemUpdate(item.id, { notes })}
                    onItemUpdate={(updates) => onItemUpdate(item.id, updates)}
                  />
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No assessment items in this category yet.</p>
                  <p className="text-sm mt-2">Click "Add Assessment Item" to get started.</p>
                </div>
              )}
              
              {/* Add Item Button */}
              <div className="pt-4 border-t border-gray-200">
                <Button
                  variant="outline"
                  onClick={() => onAddItem(section.categories[0] || 'MISCELLANEOUS')}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Assessment Item
                </Button>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default AccordionAssessmentSection;
