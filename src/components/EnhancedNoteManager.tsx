import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Edit, Trash2, Save, X, Plus, MapPin, Settings } from 'lucide-react';
import { SurveyNote, SurveyZone } from '@/types/survey';
import { useToast } from '@/hooks/use-toast';
import ZoneMetadataDialog from './assessment/ZoneMetadataDialog';
import { zoneService } from '@/services/zoneService';

interface EnhancedNoteManagerProps {
  surveyId: string;
  zones: SurveyZone[];
  notes: SurveyNote[];
  onCreateNote: (zoneId: string, content: string, section?: string) => Promise<void>;
  onUpdateNote: (noteId: string, content: string) => Promise<void>;
  onDeleteNote: (noteId: string) => Promise<void>;
  onCreateZone: (zoneName: string, zoneType: SurveyZone['zone_type']) => Promise<SurveyZone>;
  prefilledSection?: string;
  prefilledZoneId?: string;
  onZonesUpdate?: () => void;
}

const EnhancedNoteManager = ({ 
  surveyId, 
  zones, 
  notes, 
  onCreateNote, 
  onUpdateNote, 
  onDeleteNote,
  onCreateZone,
  prefilledSection,
  prefilledZoneId,
  onZonesUpdate
}: EnhancedNoteManagerProps) => {
  const [selectedZoneId, setSelectedZoneId] = useState<string>(prefilledZoneId || '');
  const [newZoneName, setNewZoneName] = useState('');
  const [newZoneType, setNewZoneType] = useState<SurveyZone['zone_type']>('area');
  const [isCreatingZone, setIsCreatingZone] = useState(false);
  const [newNoteContent, setNewNoteContent] = useState('');
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [metadataDialogZone, setMetadataDialogZone] = useState<SurveyZone | null>(null);
  
  // Ship location metadata fields
  const [deckNumber, setDeckNumber] = useState('');
  const [shipSection, setShipSection] = useState('');
  const [shipSide, setShipSide] = useState('');
  const [frameRange, setFrameRange] = useState('');
  
  const { toast } = useToast();

  const handleCreateZone = async () => {
    if (!newZoneName.trim()) return;
    
    setIsCreatingZone(true);
    try {
      const newZone = await onCreateZone(newZoneName.trim(), newZoneType);
      
      // Update zone with ship location metadata if provided
      if (deckNumber || shipSection || shipSide || frameRange) {
        const metadata = {
          deckNumber: deckNumber || undefined,
          shipSection: shipSection || undefined,
          shipSide: shipSide || undefined,
          frameRange: frameRange || undefined,
        };
        
        await zoneService.updateZone(newZone.id, {
          zone_metadata: { ...newZone.zone_metadata, ...metadata }
        });
        
        if (onZonesUpdate) {
          onZonesUpdate();
        }
      }
      
      setSelectedZoneId(newZone.id);
      setNewZoneName('');
      setDeckNumber('');
      setShipSection('');
      setShipSide('');
      setFrameRange('');
      setIsCreatingZone(false);
      
      toast({
        title: "Zone Created",
        description: `${newZoneName} has been created successfully`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create zone",
        variant: "destructive",
      });
      setIsCreatingZone(false);
    }
  };

  const handleCreateNote = async () => {
    if (!newNoteContent.trim() || !selectedZoneId) return;
    
    setIsCreating(true);
    try {
      await onCreateNote(selectedZoneId, newNoteContent, prefilledSection);
      setNewNoteContent('');
      if (!prefilledZoneId) {
        setSelectedZoneId('');
      }
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

  const handleUpdateZone = async (zoneId: string, updates: any) => {
    try {
      await zoneService.updateZone(zoneId, updates);
      if (onZonesUpdate) {
        onZonesUpdate();
      }
      toast({
        title: "Zone Updated",
        description: "Zone details have been updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update zone details",
        variant: "destructive",
      });
    }
  };

  const handleStartEdit = async (note: SurveyNote) => {
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
    
    if (zone.zone_subtype) {
      name += ` - ${zone.zone_subtype}`;
    }
    
    if (metadata.capacity) {
      name += ` - ${metadata.capacity}`;
    }
    
    return name;
  };

  const relevantNotes = prefilledSection 
    ? notes.filter(note => (note as any).section === prefilledSection)
    : notes;

  return (
    <div className="space-y-4">
      {/* Create New Zone */}
      <Card className="border-dashed border-2 border-blue-200">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-blue-700">
            <MapPin className="h-5 w-5" />
            Create New Zone
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input
              placeholder="Zone name (e.g., crew cabin, restaurant)"
              value={newZoneName}
              onChange={(e) => setNewZoneName(e.target.value)}
            />
            <Select value={newZoneType} onValueChange={(value: SurveyZone['zone_type']) => setNewZoneType(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cabin">Cabin</SelectItem>
                <SelectItem value="restaurant">Restaurant</SelectItem>
                <SelectItem value="lounge">Lounge</SelectItem>
                <SelectItem value="technical">Technical</SelectItem>
                <SelectItem value="service">Service</SelectItem>
                <SelectItem value="public_zone">Public Zone</SelectItem>
                <SelectItem value="area">General Area</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Ship Location Metadata Fields */}
          <div className="border rounded-lg p-4 bg-gray-50">
            <h4 className="font-medium text-gray-900 mb-3 text-sm">Ship Location Details (Optional)</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Deck Number</label>
                <Input
                  placeholder="e.g., 5, A, B, 02"
                  value={deckNumber}
                  onChange={(e) => setDeckNumber(e.target.value)}
                  className="text-sm"
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Section</label>
                <Select value={shipSection} onValueChange={setShipSection}>
                  <SelectTrigger className="text-sm">
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="forward">Forward</SelectItem>
                    <SelectItem value="midship">Midship</SelectItem>
                    <SelectItem value="aft">Aft</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Side of Ship</label>
                <Select value={shipSide} onValueChange={setShipSide}>
                  <SelectTrigger className="text-sm">
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="port">Port</SelectItem>
                    <SelectItem value="starboard">Starboard</SelectItem>
                    <SelectItem value="centerline">Centerline</SelectItem>
                    <SelectItem value="not-applicable">Not Applicable</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Frame Range</label>
                <Input
                  placeholder="e.g., 50-65, Frame 60"
                  value={frameRange}
                  onChange={(e) => setFrameRange(e.target.value)}
                  className="text-sm"
                />
              </div>
            </div>
          </div>

          <Button 
            onClick={handleCreateZone} 
            disabled={!newZoneName.trim() || isCreatingZone}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-1" />
            {isCreatingZone ? 'Creating...' : 'Create Zone'}
          </Button>
        </CardContent>
      </Card>

      {/* Create New Note */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add New Note
            {prefilledSection && (
              <Badge variant="secondary" className="ml-auto">
                For: {prefilledSection}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Select Zone</label>
            <div className="flex gap-2">
              <Select value={selectedZoneId} onValueChange={setSelectedZoneId}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Choose a zone..." />
                </SelectTrigger>
                <SelectContent>
                  {zones.map((zone) => (
                    <SelectItem key={zone.id} value={zone.id}>
                      {getZoneName(zone.id)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedZoneId && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const zone = zones.find(z => z.id === selectedZoneId);
                    if (zone) setMetadataDialogZone(zone);
                  }}
                >
                  <Settings className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Note Content</label>
            <Textarea
              value={newNoteContent}
              onChange={(e) => setNewNoteContent(e.target.value)}
              placeholder={prefilledSection 
                ? `Enter notes for ${prefilledSection}...` 
                : "Enter your note..."
              }
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
        {relevantNotes.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-gray-500">
                {prefilledSection 
                  ? `No notes for ${prefilledSection} yet. Create your first note above.`
                  : "No notes yet. Create your first note above."
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          relevantNotes.map((note) => (
            <Card key={note.id}>
              <CardContent className="pt-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex gap-2 mb-2">
                      <Badge variant="outline">
                        {getZoneName(note.zone_id)}
                      </Badge>
                      {(note as any).section && (
                        <Badge className="bg-blue-100 text-blue-800">
                          {(note as any).section}
                        </Badge>
                      )}
                    </div>
                    
                    {editingNoteId === note.id ? (
                      <div className="space-y-3">
                        <Textarea
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          rows={3}
                        />
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => handleSaveEdit()}>
                            <Save className="h-4 w-4 mr-1" />
                            Save
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleCancelEdit()}>
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

      <ZoneMetadataDialog
        zone={metadataDialogZone}
        isOpen={!!metadataDialogZone}
        onClose={() => setMetadataDialogZone(null)}
        onUpdateZone={handleUpdateZone}
      />
    </div>
  );
};

export default EnhancedNoteManager;
