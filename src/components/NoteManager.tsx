import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Save, X, Plus } from 'lucide-react';
import { SurveyNote, SurveyZone } from '@/types/survey';
import { useToast } from '@/hooks/use-toast';

interface NoteManagerProps {
  surveyId: string;
  zones: SurveyZone[];
  notes: SurveyNote[];
  onCreateNote: (zoneId: string, content: string) => Promise<void>;
  onUpdateNote: (noteId: string, content: string) => Promise<void>;
  onDeleteNote: (noteId: string) => Promise<void>;
}

const NoteManager = ({ 
  surveyId, 
  zones, 
  notes, 
  onCreateNote, 
  onUpdateNote, 
  onDeleteNote 
}: NoteManagerProps) => {
  const [selectedZoneId, setSelectedZoneId] = useState<string>('');
  const [newNoteContent, setNewNoteContent] = useState('');
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  const handleCreateNote = async () => {
    if (!newNoteContent.trim() || !selectedZoneId) return;
    
    setIsCreating(true);
    try {
      await onCreateNote(selectedZoneId, newNoteContent);
      setNewNoteContent('');
      setSelectedZoneId('');
      toast({
        title: "Note Created",
        description: "Note has been added successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create note",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleStartEdit = (note: SurveyNote) => {
    setEditingNoteId(note.id);
    setEditContent(note.note_content);
  };

  const handleSaveEdit = async () => {
    if (!editingNoteId || !editContent.trim()) return;
    
    try {
      await onUpdateNote(editingNoteId, editContent);
      setEditingNoteId(null);
      setEditContent('');
      toast({
        title: "Note Updated",
        description: "Note has been updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update note",
        variant: "destructive",
      });
    }
  };

  const handleCancelEdit = () => {
    setEditingNoteId(null);
    setEditContent('');
  };

  const handleDeleteNote = async (noteId: string) => {
    if (!window.confirm('Are you sure you want to delete this note?')) return;
    
    try {
      await onDeleteNote(noteId);
      toast({
        title: "Note Deleted",
        description: "Note has been deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete note",
        variant: "destructive",
      });
    }
  };

  const getZoneName = (zoneId: string) => {
    const zone = zones.find(z => z.id === zoneId);
    return zone ? `${zone.zone_name} (${zone.zone_type})` : 'Unknown Zone';
  };

  return (
    <div className="space-y-4">
      {/* Create New Note */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add New Note
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Select Zone</label>
            <select
              value={selectedZoneId}
              onChange={(e) => setSelectedZoneId(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md"
            >
              <option value="">Choose a zone...</option>
              {zones.map((zone) => (
                <option key={zone.id} value={zone.id}>
                  {zone.zone_name} ({zone.zone_type})
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Note Content</label>
            <Textarea
              value={newNoteContent}
              onChange={(e) => setNewNoteContent(e.target.value)}
              placeholder="Enter your note..."
              rows={3}
            />
          </div>
          
          <Button 
            onClick={handleCreateNote}
            disabled={!newNoteContent.trim() || !selectedZoneId || isCreating}
            className="w-full"
          >
            {isCreating ? 'Creating...' : 'Add Note'}
          </Button>
        </CardContent>
      </Card>

      {/* Existing Notes */}
      <div className="space-y-3">
        {notes.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-gray-500">No notes yet. Create your first note above.</p>
            </CardContent>
          </Card>
        ) : (
          notes.map((note) => (
            <Card key={note.id}>
              <CardContent className="pt-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <Badge variant="outline" className="mb-2">
                      {getZoneName(note.zone_id)}
                    </Badge>
                    
                    {editingNoteId === note.id ? (
                      <div className="space-y-3">
                        <Textarea
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          rows={3}
                        />
                        <div className="flex gap-2">
                          <Button size="sm" onClick={handleSaveEdit}>
                            <Save className="h-4 w-4 mr-1" />
                            Save
                          </Button>
                          <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                            <X className="h-4 w-4 mr-1" />
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <p className="text-gray-900 whitespace-pre-wrap">{note.note_content}</p>
                        <p className="text-xs text-gray-500 mt-2">
                          Created: {new Date(note.created_at).toLocaleString()}
                        </p>
                      </>
                    )}
                  </div>
                  
                  {editingNoteId !== note.id && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStartEdit(note)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteNote(note.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default NoteManager;
