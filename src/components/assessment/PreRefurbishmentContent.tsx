import { useState, useEffect } from 'react';
import { AssessmentItem } from '@/types/assessment';
import { SurveyNote, SurveyZone } from '@/types/survey';
import { ACCORDION_SECTIONS } from '@/constants/accordionSections';
import AssessmentSummary from './AssessmentSummary';
import AccordionAssessmentSection from './AccordionAssessmentSection';
import PreRefurbishmentControls from './PreRefurbishmentControls';
import { useAssessmentItems } from '@/hooks/useAssessmentItems';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Save, Plus, MapPin } from 'lucide-react';
import EnhancedNoteManager from '../EnhancedNoteManager';

interface PreRefurbishmentContentProps {
  checklist: AssessmentItem[];
  surveyId: string;
  zones: SurveyZone[];
  notes: SurveyNote[];
  hasChanges: boolean;
  expandedCategories: string[];
  onItemUpdate: (itemId: string, updates: Partial<AssessmentItem>) => void;
  onAddItem: (category: string) => void;
  onDeleteItem: (itemId: string) => void;
  onCreateNote: (zoneId: string, content: string, section?: string) => Promise<void>;
  onUpdateNote: (noteId: string, content: string) => Promise<void>;
  onDeleteNote: (noteId: string) => Promise<void>;
  onCreateZone: (zoneName: string, zoneType: SurveyZone['zone_type']) => Promise<SurveyZone>;
  onSave: () => void;
  onCategoryToggle: (category: string) => void;
  onZonesUpdate?: () => void;
}

const PreRefurbishmentContent = ({
  checklist,
  surveyId,
  zones,
  notes,
  hasChanges,
  expandedCategories,
  onItemUpdate,
  onAddItem,
  onDeleteItem,
  onCreateNote,
  onUpdateNote,
  onDeleteNote,
  onCreateZone,
  onSave,
  onCategoryToggle,
  onZonesUpdate
}: PreRefurbishmentContentProps) => {
  const { 
    assessmentItems, 
    loading, 
    updateItem, 
    addItem, 
    deleteItem, 
    saveChanges,
    hasUnsavedChanges 
  } = useAssessmentItems(surveyId);

  const [localExpandedCategories, setLocalExpandedCategories] = useState<string[]>(expandedCategories);
  const [selectedZoneId, setSelectedZoneId] = useState<string>('');
  const [showZoneCreation, setShowZoneCreation] = useState(false);

  const handleCategoryToggle = (category: string) => {
    setLocalExpandedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
    onCategoryToggle(category);
  };

  const toggleAllSections = () => {
    const allSectionIds = ACCORDION_SECTIONS.map(section => section.id);
    
    if (localExpandedCategories.length === allSectionIds.length) {
      setLocalExpandedCategories([]);
      // Update parent state for all sections
      allSectionIds.forEach(id => {
        if (expandedCategories.includes(id)) {
          onCategoryToggle(id);
        }
      });
    } else {
      setLocalExpandedCategories(allSectionIds);
      // Update parent state for all sections
      allSectionIds.forEach(id => {
        if (!expandedCategories.includes(id)) {
          onCategoryToggle(id);
        }
      });
    }
  };

  const handleItemUpdate = async (itemId: string, updates: Partial<AssessmentItem>) => {
    await updateItem(itemId, updates);
    onItemUpdate(itemId, updates);
  };

  const handleAddItem = async (category: string) => {
    if (!selectedZoneId) {
      alert('Please select a zone first');
      return;
    }
    
    await addItem(category, selectedZoneId);
    onAddItem(category);
  };

  const handleDeleteItem = async (itemId: string) => {
    await deleteItem(itemId);
    onDeleteItem(itemId);
  };

  const handleSave = async () => {
    await saveChanges();
    onSave();
  };

  const handleZoneCreated = (newZone: SurveyZone) => {
    setSelectedZoneId(newZone.id);
    setShowZoneCreation(false);
    if (onZonesUpdate) {
      onZonesUpdate();
    }
  };

  const getZoneName = (zoneId: string) => {
    const zone = zones.find(z => z.id === zoneId);
    if (!zone) return 'Unknown Zone';
    
    let name = zone.zone_name;
    
    // Add ship location metadata to the zone name display
    const metadata = zone.zone_metadata || {};
    const locationParts = [];
    
    if (metadata.deckNumber) {
      locationParts.push(`Deck ${metadata.deckNumber}`);
    }
    
    if (metadata.shipSection) {
      locationParts.push(metadata.shipSection);
    }
    
    if (metadata.shipSide) {
      locationParts.push(metadata.shipSide);
    }
    
    if (metadata.frameRange) {
      locationParts.push(`Frame ${metadata.frameRange}`);
    }
    
    if (locationParts.length > 0) {
      name += ` (${locationParts.join(', ')})`;
    }
    
    return name;
  };

  const earlyProcurementItems = assessmentItems.filter(item => item.markForEarlyProcurement);
  const filteredAssessmentItems = selectedZoneId 
    ? assessmentItems.filter(item => {
        // For now, we'll show all items since AssessmentItem doesn't have zone_id
        // This can be enhanced later when the type is updated
        return true;
      })
    : assessmentItems;
  const allItems = [...checklist, ...filteredAssessmentItems];

  useEffect(() => {
    setLocalExpandedCategories(expandedCategories);
  }, [expandedCategories]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading assessment items...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Zone Selection Section */}
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-blue-700">
            <MapPin className="h-5 w-5" />
            Zone Selection - Choose Location on Ship
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-3">
            <div className="flex-1">
              <Select value={selectedZoneId} onValueChange={setSelectedZoneId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a zone to assess..." />
                </SelectTrigger>
                <SelectContent>
                  {zones.map((zone) => (
                    <SelectItem key={zone.id} value={zone.id}>
                      {getZoneName(zone.id)} - {zone.zone_type.replace('_', ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              variant="outline"
              onClick={() => setShowZoneCreation(!showZoneCreation)}
              className="shrink-0"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Zone
            </Button>
          </div>

          {!selectedZoneId && zones.length > 0 && (
            <div className="p-3 bg-blue-50 rounded-md border border-blue-200">
              <p className="text-sm text-blue-700">
                ℹ️ Please select a zone to begin assessment. All entries will be organized by the selected zone.
              </p>
            </div>
          )}

          {zones.length === 0 && (
            <div className="p-3 bg-yellow-50 rounded-md border border-yellow-200">
              <p className="text-sm text-yellow-700">
                ⚠️ No zones found. Create your first zone to start the assessment process.
              </p>
            </div>
          )}

          {showZoneCreation && (
            <div className="border-t pt-4">
              <EnhancedNoteManager
                surveyId={surveyId}
                zones={zones}
                notes={notes}
                onCreateNote={onCreateNote}
                onUpdateNote={onUpdateNote}
                onDeleteNote={onDeleteNote}
                onCreateZone={async (zoneName, zoneType) => {
                  const newZone = await onCreateZone(zoneName, zoneType);
                  handleZoneCreated(newZone);
                  return newZone;
                }}
                onZonesUpdate={onZonesUpdate}
                prefilledSection="Estimator"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Assessment Summary */}
      <AssessmentSummary 
        checklist={allItems}
        hasChanges={hasChanges || hasUnsavedChanges}
        onSave={handleSave}
        earlyProcurementCount={earlyProcurementItems.length}
      />

      {/* Save Action Bar */}
      {(hasChanges || hasUnsavedChanges) && (
        <div className="sticky top-0 z-10 bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-blue-700 font-medium">Unsaved changes detected</span>
            </div>
            <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>
      )}

      {/* Expand/Collapse All Controls - Added at the top */}
      {selectedZoneId && (
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Assessment Categories</h2>
          <PreRefurbishmentControls
            expandedCategories={localExpandedCategories}
            onToggleAllSections={toggleAllSections}
          />
        </div>
      )}

      {/* Accordion Sections - Only show if zone is selected */}
      {selectedZoneId ? (
        <div className="space-y-6">
          {ACCORDION_SECTIONS.map(section => (
            <AccordionAssessmentSection
              key={section.id}
              section={section}
              items={allItems}
              surveyId={surveyId}
              zones={zones}
              notes={notes}
              onItemUpdate={handleItemUpdate}
              onAddItem={handleAddItem}
              onDeleteItem={handleDeleteItem}
              onCreateNote={onCreateNote}
              onUpdateNote={onUpdateNote}
              onDeleteNote={onDeleteNote}
              onCreateZone={onCreateZone}
              expandedCategories={localExpandedCategories}
              onCategoryToggle={handleCategoryToggle}
            />
          ))}

          {/* Add New Category Button */}
          <div className="mt-8 text-center">
            <Button
              variant="outline"
              onClick={() => handleAddItem('MISCELLANEOUS')}
              className="w-full sm:w-auto"
              disabled={!selectedZoneId}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Custom Assessment Item
            </Button>
          </div>
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <MapPin className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Zone to Begin Assessment</h3>
            <p className="text-gray-500 mb-4">
              Choose a zone from the dropdown above to start entering assessment data for that specific location on the ship.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PreRefurbishmentContent;
