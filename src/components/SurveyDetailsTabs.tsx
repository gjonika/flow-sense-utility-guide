
import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Survey, SurveyZone, SurveyNote } from '@/types/survey';
import { StoredSurvey } from '@/types/storage';
import { AssessmentItem } from '@/types/assessment';
import SurveyChecklistSection from './SurveyChecklistSection';
import PreRefurbishmentContent from './assessment/PreRefurbishmentContent';
import PriorityReviewContent from './assessment/PriorityReviewContent';
import TravelSection from './TravelSection';
import ZoneNotesSection from './ZoneNotesSection';
import EnhancedMediaSection from './EnhancedMediaSection';
import { useIsMobile } from '@/hooks/use-mobile';

interface SurveyDetailsTabsProps {
  survey: Survey | StoredSurvey;
  zones: SurveyZone[];
  notes?: SurveyNote[];
  checklist?: AssessmentItem[];
  hasChanges?: boolean;
  expandedCategories?: string[];
  onItemUpdate?: (itemId: string, updates: Partial<AssessmentItem>) => void;
  onAddItem?: (category: string) => void;
  onDeleteItem?: (itemId: string) => void;
  onCreateNote?: (zoneId: string, content: string, section?: string) => Promise<void>;
  onUpdateNote?: (noteId: string, content: string) => Promise<void>;
  onDeleteNote?: (noteId: string) => Promise<void>;
  onCreateZone?: (zoneName: string, zoneType: SurveyZone['zone_type']) => Promise<SurveyZone>;
  onSave?: () => void;
  onCategoryToggle?: (category: string) => void;
  onUpdate?: (survey: Survey | StoredSurvey) => void;
}

const SurveyDetailsTabs = ({
  survey,
  zones,
  notes = [],
  checklist = [],
  hasChanges = false,
  expandedCategories = [],
  onItemUpdate,
  onAddItem,
  onDeleteItem,
  onCreateNote,
  onUpdateNote,
  onDeleteNote,
  onCreateZone,
  onSave,
  onCategoryToggle,
  onUpdate
}: SurveyDetailsTabsProps) => {
  const isMobile = useIsMobile();

  // Create default zone creation function if not provided
  const handleCreateZone = onCreateZone || (async (zoneName: string, zoneType: SurveyZone['zone_type']) => {
    console.log('Creating zone:', zoneName, zoneType);
    // Return a mock zone for now
    return {
      id: crypto.randomUUID(),
      survey_id: survey.id,
      zone_name: zoneName,
      zone_type: zoneType,
      created_at: new Date().toISOString()
    } as SurveyZone;
  });

  const handleCreateNote = onCreateNote || (async (zoneId: string, content: string, section?: string) => {
    console.log('Creating note for zone:', zoneId, content, section);
  });

  const handleUpdateNote = onUpdateNote || (async (noteId: string, content: string) => {
    console.log('Updating note:', noteId, content);
  });

  const handleDeleteNote = onDeleteNote || (async (noteId: string) => {
    console.log('Deleting note:', noteId);
  });

  const handleItemUpdate = onItemUpdate || ((itemId: string, updates: Partial<AssessmentItem>) => {
    console.log('Updating item:', itemId, updates);
  });

  const handleAddItem = onAddItem || ((category: string) => {
    console.log('Adding item to category:', category);
  });

  const handleDeleteItem = onDeleteItem || ((itemId: string) => {
    console.log('Deleting item:', itemId);
  });

  const handleSave = onSave || (() => {
    console.log('Saving changes');
  });

  const handleCategoryToggle = onCategoryToggle || ((category: string) => {
    console.log('Toggling category:', category);
  });

  const tabItems = [
    { value: "overview", label: isMobile ? "Info" : "Overview" },
    { value: "checklist", label: isMobile ? "Check" : "Checklist" },
    { value: "estimator", label: isMobile ? "Est." : "Estimator" },
    { value: "priority", label: isMobile ? "Pri." : "Priority Review" },
    { value: "travel", label: isMobile ? "Trip" : "Travel" },
    { value: "notes", label: "Notes" },
    { value: "media", label: "Media" },
  ];

  return (
    <Tabs defaultValue="overview" className="w-full">
      <div className="overflow-x-auto scrollbar-hide">
        <TabsList className={`grid w-full grid-cols-7 ${isMobile ? 'h-9 text-xs' : 'h-10'} mb-1`}>
          {tabItems.map((item) => (
            <TabsTrigger 
              key={item.value} 
              value={item.value}
              className={isMobile ? 'px-1 py-1 text-xs data-[state=active]:text-xs' : 'text-sm'}
            >
              {item.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      <TabsContent value="overview" className="mt-3 sm:mt-6">
        <Card>
          <CardContent className="p-3 sm:p-6">
            <div className="grid grid-cols-1 gap-3 sm:gap-6">
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-700 text-sm sm:text-base mb-1">Client Information</h3>
                  <p className="text-gray-900 text-sm sm:text-base">{survey.client_name}</p>
                  <p className="text-gray-600 text-xs sm:text-sm">{survey.client_country}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700 text-sm sm:text-base mb-1">Ship Details</h3>
                  <p className="text-gray-900 text-sm sm:text-base">{survey.ship_name}</p>
                  <p className="text-gray-600 text-xs sm:text-sm">{survey.survey_location}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700 text-sm sm:text-base mb-1">Survey Information</h3>
                  <p className="text-gray-900 text-sm sm:text-base">Date: {new Date(survey.survey_date).toLocaleDateString()}</p>
                  <p className="text-gray-900 text-sm sm:text-base">Duration: {survey.duration}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700 text-sm sm:text-base mb-1">Project Scope</h3>
                  <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">{survey.project_scope}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="checklist" className="mt-3 sm:mt-6">
        <SurveyChecklistSection 
          surveyId={survey.id}
        />
      </TabsContent>

      <TabsContent value="estimator" className="mt-3 sm:mt-6">
        <PreRefurbishmentContent
          checklist={checklist}
          surveyId={survey.id}
          zones={zones}
          notes={notes}
          hasChanges={hasChanges}
          expandedCategories={expandedCategories}
          onItemUpdate={handleItemUpdate}
          onAddItem={handleAddItem}
          onDeleteItem={handleDeleteItem}
          onCreateNote={handleCreateNote}
          onUpdateNote={handleUpdateNote}
          onDeleteNote={handleDeleteNote}
          onCreateZone={handleCreateZone}
          onSave={handleSave}
          onCategoryToggle={handleCategoryToggle}
        />
      </TabsContent>

      <TabsContent value="priority" className="mt-3 sm:mt-6">
        <PriorityReviewContent surveyId={survey.id} />
      </TabsContent>

      <TabsContent value="travel" className="mt-3 sm:mt-6">
        <TravelSection 
          survey={survey} 
          onUpdate={onUpdate || (() => {})}
        />
      </TabsContent>

      <TabsContent value="notes" className="mt-3 sm:mt-6">
        <ZoneNotesSection surveyId={survey.id} />
      </TabsContent>

      <TabsContent value="media" className="mt-3 sm:mt-6">
        <EnhancedMediaSection 
          surveyId={survey.id} 
          zones={zones}
        />
      </TabsContent>
    </Tabs>
  );
};

export default SurveyDetailsTabs;
