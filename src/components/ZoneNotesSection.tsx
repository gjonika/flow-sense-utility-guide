import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, MapPin, Wifi, WifiOff } from 'lucide-react';
import { SurveyZone, SurveyNote } from '@/types/survey';
import { useZoneManager } from '@/hooks/useZoneManager';
import { zoneService } from '@/services/zoneService';
import { useToast } from '@/hooks/use-toast';

interface ZoneNotesSectionProps {
  surveyId: string;
}

const ZoneNotesSection = ({ surveyId }: ZoneNotesSectionProps) => {
  const [newZoneName, setNewZoneName] = useState('');
  const [newZoneType, setNewZoneType] = useState<SurveyZone['zone_type']>('area');
  const [selectedZoneId, setSelectedZoneId] = useState<string>('');
  const [newNote, setNewNote] = useState('');
  
  // Ship location metadata fields
  const [deckNumber, setDeckNumber] = useState('');
  const [shipSection, setShipSection] = useState('');
  const [shipSide, setShipSide] = useState('');
  const [frameRange, setFrameRange] = useState('');

  const { zones, notes, loading, isOnline, createZone, createNote } = useZoneManager(surveyId);
  const { toast } = useToast();

  const handleCreateZone = async () => {
    if (newZoneName.trim()) {
      const newZone = await createZone(newZoneName.trim(), newZoneType);
      
      // Update zone with ship location metadata if provided
      if (newZone && (deckNumber || shipSection || shipSide || frameRange)) {
        try {
          const metadata = {
            deckNumber: deckNumber || undefined,
            shipSection: shipSection || undefined,
            shipSide: shipSide || undefined,
            frameRange: frameRange || undefined,
          };
          
          await zoneService.updateZone(newZone.id, {
            zone_metadata: { ...newZone.zone_metadata, ...metadata }
          });
        } catch (error) {
          console.error('Error updating zone metadata:', error);
        }
      }
      
      setNewZoneName('');
      setDeckNumber('');
      setShipSection('');
      setShipSide('');
      setFrameRange('');
    }
  };

  const handleCreateNote = async () => {
    if (selectedZoneId && newNote.trim()) {
      await createNote(selectedZoneId, newNote.trim());
      setNewNote('');
    }
  };

  const getZoneNotes = (zoneId: string) => {
    return notes.filter(note => note.zone_id === zoneId);
  };

  const getZoneName = (zone: SurveyZone) => {
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

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-8">Loading zones and notes...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <div className="flex items-center gap-2 text-sm">
        {isOnline ? (
          <div className="flex items-center gap-1 text-green-600">
            <Wifi className="h-4 w-4" />
            <span>Online - Changes sync automatically</span>
          </div>
        ) : (
          <div className="flex items-center gap-1 text-yellow-600">
            <WifiOff className="h-4 w-4" />
            <span>Offline - Changes saved locally</span>
          </div>
        )}
      </div>

      {/* Create New Zone */}
      <Card>
        <CardHeader>
          <CardTitle className="text-blue-700">Create New Zone</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="Zone name..."
              value={newZoneName}
              onChange={(e) => setNewZoneName(e.target.value)}
            />
            <Select value={newZoneType} onValueChange={(value: SurveyZone['zone_type']) => setNewZoneType(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="area">Area</SelectItem>
                <SelectItem value="cabin">Cabin</SelectItem>
                <SelectItem value="public_zone">Public Zone</SelectItem>
                <SelectItem value="restaurant">Restaurant</SelectItem>
                <SelectItem value="lounge">Lounge</SelectItem>
                <SelectItem value="technical">Technical</SelectItem>
                <SelectItem value="service">Service</SelectItem>
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

          <Button onClick={handleCreateZone} disabled={!newZoneName.trim()} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Create Zone
          </Button>
        </CardContent>
      </Card>

      {/* Add Notes to Zones */}
      {zones.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-blue-700">Add Note</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Select value={selectedZoneId} onValueChange={setSelectedZoneId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a zone..." />
                </SelectTrigger>
                <SelectContent>
                  {zones.map((zone) => (
                    <SelectItem key={zone.id} value={zone.id}>
                      {getZoneName(zone)} ({zone.zone_type})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Textarea
                placeholder="Enter your note..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                rows={3}
              />
              <Button 
                onClick={handleCreateNote} 
                disabled={!selectedZoneId || !newNote.trim()}
              >
                Add Note
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Display Zones and Notes */}
      <div className="space-y-4">
        {zones.map((zone) => {
          const zoneNotes = getZoneNotes(zone.id);
          return (
            <Card key={zone.id}>
              <CardHeader>
                <CardTitle className="text-blue-700 flex items-center">
                  <MapPin className="mr-2 h-5 w-5" />
                  {getZoneName(zone)}
                  <span className="ml-2 text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {zone.zone_type.replace('_', ' ')}
                  </span>
                  {!isOnline && (zone as any).needs_sync && (
                    <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                      Pending sync
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {zoneNotes.length > 0 ? (
                  <div className="space-y-3">
                    {zoneNotes.map((note) => (
                      <div key={note.id} className="bg-gray-50 p-3 rounded border-l-4 border-blue-500">
                        <p className="text-gray-800">{note.note_text}</p>
                        <div className="flex items-center justify-between mt-2">
                          <p className="text-xs text-gray-500">
                            {new Date(note.created_at).toLocaleString()}
                          </p>
                          {!isOnline && (note as any).needs_sync && (
                            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                              Pending sync
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No notes yet for this zone.</p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {zones.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <MapPin className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No zones created yet</h3>
            <p className="text-gray-500">Create your first zone to start adding notes.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ZoneNotesSection;
