
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { MessageSquarePlus } from 'lucide-react';
import EnhancedNoteManager from '../EnhancedNoteManager';
import { SurveyNote, SurveyZone } from '@/types/survey';

interface SectionNoteButtonProps {
  surveyId: string;
  sectionName: string;
  zones: SurveyZone[];
  notes: SurveyNote[];
  onCreateNote: (zoneId: string, content: string, section?: string) => Promise<void>;
  onUpdateNote: (noteId: string, content: string) => Promise<void>;
  onDeleteNote: (noteId: string) => Promise<void>;
  onCreateZone: (zoneName: string, zoneType: SurveyZone['zone_type']) => Promise<SurveyZone>;
}

const SectionNoteButton = ({
  surveyId,
  sectionName,
  zones,
  notes,
  onCreateNote,
  onUpdateNote,
  onDeleteNote,
  onCreateZone
}: SectionNoteButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const sectionNotes = notes.filter(note => (note as any).section === sectionName);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="ml-2">
          <MessageSquarePlus className="h-4 w-4 mr-1" />
          Notes ({sectionNotes.length})
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Notes for {sectionName}</DialogTitle>
        </DialogHeader>
        <EnhancedNoteManager
          surveyId={surveyId}
          zones={zones}
          notes={notes}
          onCreateNote={onCreateNote}
          onUpdateNote={onUpdateNote}
          onDeleteNote={onDeleteNote}
          onCreateZone={onCreateZone}
          prefilledSection={sectionName}
        />
      </DialogContent>
    </Dialog>
  );
};

export default SectionNoteButton;
