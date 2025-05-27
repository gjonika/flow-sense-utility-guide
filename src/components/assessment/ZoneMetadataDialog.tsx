
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings } from 'lucide-react';
import { SurveyZone } from '@/types/survey';
import { MATERIAL_OPTIONS } from '@/constants/materialOptions';

interface ZoneMetadataDialogProps {
  zone: SurveyZone | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateZone: (zoneId: string, updates: any) => Promise<void>;
}

const ZoneMetadataDialog = ({ zone, isOpen, onClose, onUpdateZone }: ZoneMetadataDialogProps) => {
  const [metadata, setMetadata] = useState(zone?.zone_metadata || {});

  if (!zone) return null;

  const handleSave = async () => {
    await onUpdateZone(zone.id, {
      zone_subtype: zone.zone_subtype,
      zone_description: zone.zone_description,
      zone_metadata: metadata
    });
    onClose();
  };

  const updateMetadata = (field: string, value: any) => {
    setMetadata(prev => ({ ...prev, [field]: value }));
  };

  const renderZoneTypeSpecificFields = () => {
    switch (zone.zone_type) {
      case 'cabin':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="cabinType">Cabin Type</Label>
              <Select 
                value={metadata.cabinType || ''} 
                onValueChange={(value) => updateMetadata('cabinType', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select cabin type" />
                </SelectTrigger>
                <SelectContent>
                  {MATERIAL_OPTIONS.cabinTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="capacity">Occupancy</Label>
              <Input
                value={metadata.capacity || ''}
                onChange={(e) => updateMetadata('capacity', e.target.value)}
                placeholder="e.g., 2 guests, 4 passengers"
              />
            </div>
          </div>
        );

      case 'restaurant':
      case 'lounge':
      case 'bar':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="restaurantName">Venue Name</Label>
              <Input
                value={metadata.restaurantName || ''}
                onChange={(e) => updateMetadata('restaurantName', e.target.value)}
                placeholder="e.g., La Belle, Main Dining, Deck Bar"
              />
            </div>
            <div>
              <Label htmlFor="capacity">Seating Capacity</Label>
              <Input
                value={metadata.capacity || ''}
                onChange={(e) => updateMetadata('capacity', e.target.value)}
                placeholder="e.g., 150 seats, 80 covers"
              />
            </div>
          </div>
        );

      default:
        return (
          <div>
            <Label htmlFor="capacity">Capacity / Size</Label>
            <Input
              value={metadata.capacity || ''}
              onChange={(e) => updateMetadata('capacity', e.target.value)}
              placeholder="Describe capacity, size, or usage"
            />
          </div>
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Zone Details: {zone.zone_name}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="zoneName">Zone Name</Label>
              <Input
                value={zone.zone_name}
                onChange={(e) => onUpdateZone(zone.id, { zone_name: e.target.value })}
                placeholder="e.g., Cabin 324, Main Restaurant"
              />
            </div>
            
            <div>
              <Label htmlFor="deckNumber">Deck Number</Label>
              <Input
                value={metadata.deckNumber || ''}
                onChange={(e) => updateMetadata('deckNumber', e.target.value)}
                placeholder="e.g., 5, A, B, 02"
              />
            </div>
          </div>

          {/* Ship Location Metadata */}
          <div className="border rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-4">Ship Location Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="shipSection">Section (Front/Back)</Label>
                <Select 
                  value={metadata.shipSection || ''} 
                  onValueChange={(value) => updateMetadata('shipSection', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select section" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="forward">Forward</SelectItem>
                    <SelectItem value="midship">Midship</SelectItem>
                    <SelectItem value="aft">Aft</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="shipSide">Side of Ship</Label>
                <Select 
                  value={metadata.shipSide || ''} 
                  onValueChange={(value) => updateMetadata('shipSide', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select side" />
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
                <Label htmlFor="frameRange">Frame Range</Label>
                <Input
                  value={metadata.frameRange || ''}
                  onChange={(e) => updateMetadata('frameRange', e.target.value)}
                  placeholder="e.g., 50-65, Frame 60"
                />
              </div>
            </div>
          </div>

          {renderZoneTypeSpecificFields()}

          <div>
            <Label htmlFor="specialRequirements">Special Requirements</Label>
            <Textarea
              value={metadata.specialRequirements || ''}
              onChange={(e) => updateMetadata('specialRequirements', e.target.value)}
              placeholder="Access restrictions, safety requirements, operational notes"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="description">Zone Description</Label>
            <Textarea
              value={zone.zone_description || ''}
              onChange={(e) => onUpdateZone(zone.id, { zone_description: e.target.value })}
              placeholder="Detailed description of the zone"
              rows={2}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ZoneMetadataDialog;
