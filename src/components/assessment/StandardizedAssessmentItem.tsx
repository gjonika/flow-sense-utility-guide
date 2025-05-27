
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { CheckCircle, XCircle, AlertTriangle, Upload, Camera, ChevronDown, ChevronRight, Trash2 } from 'lucide-react';
import { AssessmentItem as AssessmentItemType } from '@/types/assessment';
import { SurveyZone } from '@/types/survey';

interface StandardizedAssessmentItemProps {
  item: AssessmentItemType;
  zones: SurveyZone[];
  onStatusUpdate: (status: AssessmentItemType['status']) => void;
  onNotesUpdate: (notes: string) => void;
  onItemUpdate: (updates: Partial<AssessmentItemType>) => void;
  onDelete: () => void;
  onCreateNote: (zoneId: string, content: string, section?: string) => Promise<void>;
}

const StandardizedAssessmentItem = ({ 
  item, 
  zones,
  onStatusUpdate, 
  onNotesUpdate, 
  onItemUpdate,
  onDelete,
  onCreateNote
}: StandardizedAssessmentItemProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedZone, setSelectedZone] = useState<string>('');

  const getStatusIcon = (status: AssessmentItemType['status']) => {
    switch (status) {
      case 'noted':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'requires_attention':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case 'not_applicable':
        return <XCircle className="h-5 w-5 text-gray-600" />;
      default:
        return <div className="h-5 w-5 rounded-full border-2 border-gray-300" />;
    }
  };

  const getStatusBadge = (status: AssessmentItemType['status']) => {
    switch (status) {
      case 'noted':
        return <Badge className="bg-green-100 text-green-800">Noted</Badge>;
      case 'requires_attention':
        return <Badge className="bg-yellow-100 text-yellow-800">Attention</Badge>;
      case 'not_applicable':
        return <Badge className="bg-gray-100 text-gray-800">N/A</Badge>;
      default:
        return <Badge variant="secondary">Pending</Badge>;
    }
  };

  const handleCreateZoneNote = async () => {
    if (selectedZone && item.notes.trim()) {
      await onCreateNote(selectedZone, item.notes, item.category);
    }
  };

  return (
    <Card className="border rounded-lg bg-white shadow-sm">
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
                {getStatusIcon(item.status)}
                <div>
                  <CardTitle className="text-lg">{item.question}</CardTitle>
                  <div className="flex gap-2 mt-1">
                    {getStatusBadge(item.status)}
                    {item.isPriority && (
                      <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                        Priority
                      </Badge>
                    )}
                    {item.markForEarlyProcurement && (
                      <Badge className="bg-orange-100 text-orange-800 text-xs">
                        Early Procurement
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="space-y-6">
            {/* Core Assessment Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <Label htmlFor="plannedMaterial">Planned Material</Label>
                <Input 
                  value={item.plannedMaterial || ''} 
                  onChange={(e) => onItemUpdate({ plannedMaterial: e.target.value })}
                  placeholder="What is requested by client/specs"
                />
              </div>
              <div>
                <Label htmlFor="conditionNotes">Current Condition</Label>
                <Input 
                  value={item.conditionNotes || ''} 
                  onChange={(e) => onItemUpdate({ conditionNotes: e.target.value })}
                  placeholder="What is currently installed"
                />
              </div>
            </div>

            {/* Action Required */}
            <div>
              <Label htmlFor="actionRequired">Action Required</Label>
              <Select 
                value={item.actionRequired || ''} 
                onValueChange={(value) => onItemUpdate({ actionRequired: value as 'reuse' | 'refurbish' | 'replace' })}
              >
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="reuse">Reuse</SelectItem>
                  <SelectItem value="refurbish">Refurbish</SelectItem>
                  <SelectItem value="replace">Replace</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Installation Notes */}
            <div>
              <Label htmlFor="installationNotes">Installation Notes</Label>
              <Textarea
                value={item.installationNotes || ''}
                onChange={(e) => onItemUpdate({ installationNotes: e.target.value })}
                placeholder="Anchoring, substructure, accessibility"
                rows={3}
              />
            </div>

            {/* Dimensions */}
            <div>
              <Label className="text-sm font-medium text-gray-700">Dimensions (mm)</Label>
              <div className="grid grid-cols-3 gap-4 mt-2">
                <div>
                  <Label htmlFor="length" className="text-xs">Length</Label>
                  <Input 
                    type="number"
                    placeholder="L"
                    value={item.quantities?.linearMeters || ''}
                    onChange={(e) => onItemUpdate({ 
                      quantities: { 
                        ...item.quantities, 
                        linearMeters: parseInt(e.target.value) || 0 
                      }
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="width" className="text-xs">Width</Label>
                  <Input 
                    type="number"
                    placeholder="W"
                  />
                </div>
                <div>
                  <Label htmlFor="height" className="text-xs">Height</Label>
                  <Input 
                    type="number"
                    placeholder="H"
                  />
                </div>
              </div>
            </div>

            {/* Quantity */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="quantity">Quantity</Label>
                <Input 
                  type="number"
                  value={item.quantities?.unitCount || 1}
                  onChange={(e) => onItemUpdate({ 
                    quantities: { 
                      ...item.quantities, 
                      unitCount: parseInt(e.target.value) || 1 
                    }
                  })}
                />
              </div>
              <div>
                <Label htmlFor="surfaceArea">Surface Area (m²)</Label>
                <Input 
                  type="number"
                  value={item.quantities?.surfaceArea || ''}
                  onChange={(e) => onItemUpdate({ 
                    quantities: { 
                      ...item.quantities, 
                      surfaceArea: parseInt(e.target.value) || 0 
                    }
                  })}
                />
              </div>
            </div>

            {/* Leveling/Prep Estimate - Only for Flooring */}
            {item.category === 'Flooring' && (
              <div>
                <Label htmlFor="levelingPrep">Leveling / Prep Estimate</Label>
                <Input 
                  value={item.levelingPrepEstimate || ''} 
                  onChange={(e) => onItemUpdate({ levelingPrepEstimate: e.target.value })}
                  placeholder="mm leveling, reinforcement, insulation requirements"
                />
              </div>
            )}

            {/* Status buttons */}
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={item.status === 'noted' ? 'default' : 'outline'}
                onClick={() => onStatusUpdate('noted')}
                className="text-xs"
              >
                Noted
              </Button>
              <Button
                size="sm"
                variant={item.status === 'requires_attention' ? 'default' : 'outline'}
                onClick={() => onStatusUpdate('requires_attention')}
                className="text-xs"
              >
                Needs Attention
              </Button>
              <Button
                size="sm"
                variant={item.status === 'not_applicable' ? 'default' : 'outline'}
                onClick={() => onStatusUpdate('not_applicable')}
                className="text-xs"
              >
                N/A
              </Button>
            </div>

            {/* Zone Selection and Notes */}
            <div className="space-y-4 p-4 bg-blue-50 rounded-lg">
              <div>
                <Label htmlFor="zone">Assign to Zone</Label>
                <Select value={selectedZone} onValueChange={setSelectedZone}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select zone" />
                  </SelectTrigger>
                  <SelectContent>
                    {zones.map(zone => (
                      <SelectItem key={zone.id} value={zone.id}>
                        {zone.zone_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="generalNotes">General Estimation Notes</Label>
                <Textarea
                  placeholder="Additional material details, dimensions, quantities, supplier information, etc..."
                  value={item.notes}
                  onChange={(e) => onNotesUpdate(e.target.value)}
                  rows={3}
                  className="text-sm"
                />
              </div>

              {selectedZone && item.notes.trim() && (
                <Button 
                  onClick={handleCreateZoneNote}
                  variant="outline" 
                  size="sm"
                  className="flex items-center gap-2"
                >
                  Save Note to Zone
                </Button>
              )}
            </div>

            {/* Procurement and Media Section */}
            <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Switch 
                    checked={item.markForEarlyProcurement || false}
                    onCheckedChange={(checked) => onItemUpdate({ markForEarlyProcurement: checked })}
                  />
                  <Label className="font-medium text-orange-700">Mark for Early Procurement</Label>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Camera className="h-4 w-4" />
                  Photo
                </Button>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  Upload
                </Button>
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default StandardizedAssessmentItem;
