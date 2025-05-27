
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { AssessmentItem, PreRefurbishmentChecklistProps } from '@/types/assessment';
import { SurveyNote, SurveyZone } from '@/types/survey';
import { MATERIAL_ASSESSMENT_CHECKLIST } from '@/constants/assessmentChecklist';
import { ACCORDION_SECTIONS } from '@/constants/accordionSections';
import { useSurveyZones } from '@/hooks/useSurveyZones';
import { noteService } from '@/services/noteService';
import { pdfExportService } from '@/services/pdfExportService';
import PreRefurbishmentHeader from './assessment/PreRefurbishmentHeader';
import PreRefurbishmentContent from './assessment/PreRefurbishmentContent';
import PreRefurbishmentStickyActions from './assessment/PreRefurbishmentStickyActions';

const PreRefurbishmentChecklist = ({ surveyId, onSave }: PreRefurbishmentChecklistProps) => {
  const [checklist, setChecklist] = useState<AssessmentItem[]>([]);
  const [hasChanges, setHasChanges] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]); // Start collapsed
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  // Use the existing zone management hook
  const { zones, notes, loading, createZone, createNote, refetch } = useSurveyZones(surveyId);

  useEffect(() => {
    // Initialize checklist from template
    const initialChecklist = MATERIAL_ASSESSMENT_CHECKLIST.map(item => ({
      ...item,
      status: 'pending' as const,
      notes: ''
    }));
    setChecklist(initialChecklist);
  }, []);

  const updateItem = (itemId: string, updates: Partial<AssessmentItem>) => {
    setChecklist(prev => prev.map(item => 
      item.id === itemId ? { ...item, ...updates } : item
    ));
    setHasChanges(true);
  };

  const addItem = (category: string) => {
    const newItem: AssessmentItem = {
      id: `${Date.now()}-${Math.random()}`,
      category,
      question: `New ${category} Item`,
      status: 'pending',
      notes: '',
      isPriority: false,
      plannedMaterial: '',
      conditionNotes: '',
      installationNotes: '',
      actionRequired: 'replace',
      markForEarlyProcurement: false,
      quantities: {
        surfaceArea: 0,
        linearMeters: 0,
        unitCount: 1,
        sets: 1
      }
    };

    setChecklist(prev => [...prev, newItem]);
    setHasChanges(true);
  };

  const deleteItem = (itemId: string) => {
    setChecklist(prev => prev.filter(item => item.id !== itemId));
    setHasChanges(true);
  };

  const handleSave = () => {
    if (onSave) {
      onSave(checklist);
    }
    setHasChanges(false);
    toast({
      title: "Assessment Saved",
      description: "Pre-refurbishment material assessment has been saved successfully",
    });
  };

  const handleExportPDF = async () => {
    try {
      setIsExporting(true);
      
      const mockSurvey = {
        id: surveyId,
        ship_name: 'Survey Ship',
        client_name: 'Client',
        survey_location: 'Location',
        survey_date: new Date().toISOString().split('T')[0],
        project_scope: 'Pre-refurbishment assessment',
      } as any;

      await pdfExportService.generateSurveyReport({
        survey: mockSurvey,
        zones,
        notes,
        assessmentItems: checklist
      });

      toast({
        title: "Export Complete",
        description: "Survey report has been generated successfully",
      });
    } catch (error) {
      toast({
        title: "Export Failed", 
        description: "Could not generate PDF report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleCategoryToggle = (category: string) => {
    setExpandedCategories(prev => {
      if (prev.includes(category)) {
        return prev.filter(c => c !== category);
      } else {
        return [...prev, category];
      }
    });
  };

  const handleCreateNote = async (zoneId: string, content: string, section?: string) => {
    await noteService.createNote(surveyId, zoneId, content, section);
    refetch();
  };

  const handleUpdateNote = async (noteId: string, content: string) => {
    await noteService.updateNote(noteId, content);
    refetch();
  };

  const handleDeleteNote = async (noteId: string) => {
    await noteService.deleteNote(noteId);
    refetch();
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">Loading assessment...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PreRefurbishmentHeader 
        isExporting={isExporting}
        onExportPDF={handleExportPDF}
      />

      <PreRefurbishmentContent
        checklist={checklist}
        surveyId={surveyId}
        zones={zones}
        notes={notes}
        hasChanges={hasChanges}
        expandedCategories={expandedCategories}
        onItemUpdate={updateItem}
        onAddItem={addItem}
        onDeleteItem={deleteItem}
        onCreateNote={handleCreateNote}
        onUpdateNote={handleUpdateNote}
        onDeleteNote={handleDeleteNote}
        onCreateZone={createZone}
        onSave={handleSave}
        onCategoryToggle={handleCategoryToggle}
      />

      <PreRefurbishmentStickyActions
        hasChanges={hasChanges}
        onSave={handleSave}
      />
    </div>
  );
};

export default PreRefurbishmentChecklist;
