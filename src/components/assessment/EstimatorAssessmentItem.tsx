import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { CheckCircle, XCircle, AlertTriangle, Upload, Camera } from 'lucide-react';
import { AssessmentItem as AssessmentItemType } from '@/types/assessment';
import { MATERIAL_OPTIONS } from '@/constants/assessmentChecklist';
import DimensionsQuantityInputs from './DimensionsQuantityInputs';

interface EstimatorAssessmentItemProps {
  item: AssessmentItemType;
  onStatusUpdate: (status: AssessmentItemType['status']) => void;
  onNotesUpdate: (notes: string) => void;
  onItemUpdate: (updates: Partial<AssessmentItemType>) => void;
}

const EstimatorAssessmentItem = ({ item, onStatusUpdate, onNotesUpdate, onItemUpdate }: EstimatorAssessmentItemProps) => {
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

  // Check if this category should show leveling/prep estimate
  const shouldShowLevelingPrep = () => {
    const levelingCategories = [
      'Flooring',
      'Deck & Flooring', 
      'Subfloor Structure',
      'Decks',
      'Floor Systems'
    ];
    return levelingCategories.some(cat => 
      item.category.toLowerCase().includes(cat.toLowerCase())
    );
  };

  const renderCategorySpecificFields = () => {
    switch (item.category) {
      case 'Walls & Ceilings':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="wallMaterial">Wall Material</Label>
                <Select 
                  value={item.wallsAndCeilings?.wallMaterial || ''} 
                  onValueChange={(value) => onItemUpdate({ 
                    wallsAndCeilings: { ...item.wallsAndCeilings, wallMaterial: value }
                  })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select wall material" />
                  </SelectTrigger>
                  <SelectContent>
                    {MATERIAL_OPTIONS.wallMaterial.map(option => (
                      <SelectItem key={option} value={option}>{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="ceilingType">Ceiling Type</Label>
                <Select 
                  value={item.wallsAndCeilings?.ceilingType || ''} 
                  onValueChange={(value) => onItemUpdate({ 
                    wallsAndCeilings: { ...item.wallsAndCeilings, ceilingType: value }
                  })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select ceiling type" />
                  </SelectTrigger>
                  <SelectContent>
                    {MATERIAL_OPTIONS.ceilingType.map(option => (
                      <SelectItem key={option} value={option}>{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="surfaceCondition">Surface Condition</Label>
              <Input 
                value={item.wallsAndCeilings?.surfaceCondition || ''} 
                onChange={(e) => onItemUpdate({ 
                  wallsAndCeilings: { ...item.wallsAndCeilings, surfaceCondition: e.target.value }
                })}
                placeholder="Describe surface condition"
              />
            </div>
            <div>
              <Label htmlFor="integratedSystems">Integrated Systems</Label>
              <Input 
                value={item.wallsAndCeilings?.integratedSystems || ''} 
                onChange={(e) => onItemUpdate({ 
                  wallsAndCeilings: { ...item.wallsAndCeilings, integratedSystems: e.target.value }
                })}
                placeholder="HVAC, electrical, lighting systems"
              />
            </div>
            <div>
              <Label htmlFor="fireproofingInsulation">Fireproofing/Insulation Needs</Label>
              <Textarea 
                value={item.wallsAndCeilings?.fireproofingInsulationNeeds || ''} 
                onChange={(e) => onItemUpdate({ 
                  wallsAndCeilings: { ...item.wallsAndCeilings, fireproofingInsulationNeeds: e.target.value }
                })}
                placeholder="Fire rating requirements, insulation needs"
                rows={2}
              />
            </div>
          </div>
        );

      case 'Flooring':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="topCovering">Top Covering</Label>
                <Select 
                  value={item.flooring?.topCovering || ''} 
                  onValueChange={(value) => onItemUpdate({ 
                    flooring: { ...item.flooring, topCovering: value }
                  })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select top covering" />
                  </SelectTrigger>
                  <SelectContent>
                    {MATERIAL_OPTIONS.topCovering.map(option => (
                      <SelectItem key={option} value={option}>{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="subfloorType">Subfloor Type</Label>
                <Select 
                  value={item.flooring?.subfloorType || ''} 
                  onValueChange={(value) => onItemUpdate({ 
                    flooring: { ...item.flooring, subfloorType: value }
                  })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select subfloor type" />
                  </SelectTrigger>
                  <SelectContent>
                    {MATERIAL_OPTIONS.subfloorType.map(option => (
                      <SelectItem key={option} value={option}>{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="topLayerCondition">Top Layer Condition</Label>
                <Input 
                  value={item.flooring?.topLayerCondition || ''} 
                  onChange={(e) => onItemUpdate({ 
                    flooring: { ...item.flooring, topLayerCondition: e.target.value }
                  })}
                  placeholder="Condition assessment"
                />
              </div>
              <div>
                <Label htmlFor="subfloorCondition">Subfloor Condition</Label>
                <Input 
                  value={item.flooring?.subfloorCondition || ''} 
                  onChange={(e) => onItemUpdate({ 
                    flooring: { ...item.flooring, subfloorCondition: e.target.value }
                  })}
                  placeholder="Structural condition"
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  checked={item.flooring?.levelingNeeded || false}
                  onCheckedChange={(checked) => onItemUpdate({ 
                    flooring: { ...item.flooring, levelingNeeded: !!checked }
                  })}
                />
                <Label>Leveling Needed</Label>
              </div>
              {item.flooring?.levelingNeeded && (
                <div className="flex items-center space-x-2">
                  <Label htmlFor="levelingMm">mm:</Label>
                  <Input 
                    type="number"
                    className="w-20"
                    value={item.flooring?.levelingMm || ''} 
                    onChange={(e) => onItemUpdate({ 
                      flooring: { ...item.flooring, levelingMm: parseInt(e.target.value) || 0 }
                    })}
                  />
                </div>
              )}
            </div>
            <div>
              <Label htmlFor="waterproofingSlope">Waterproofing/Slope Notes</Label>
              <Textarea 
                value={item.flooring?.waterproofingSlopeNotes || ''} 
                onChange={(e) => onItemUpdate({ 
                  flooring: { ...item.flooring, waterproofingSlopeNotes: e.target.value }
                })}
                placeholder="Waterproofing requirements, slope analysis"
                rows={2}
              />
            </div>
          </div>
        );

      case 'Furniture':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="fixedFurnitureTypes">Fixed Furniture Types</Label>
              <Input 
                value={item.furniture?.fixedFurnitureTypes || ''} 
                onChange={(e) => onItemUpdate({ 
                  furniture: { ...item.furniture, fixedFurnitureTypes: e.target.value }
                })}
                placeholder="Built-in furniture, cabinets, etc."
              />
            </div>
            <div>
              <Label htmlFor="keepReplaceRefurbish">Keep/Replace/Refurbish</Label>
              <Select 
                value={item.furniture?.keepReplaceRefurbish || ''} 
                onValueChange={(value) => onItemUpdate({ 
                  furniture: { ...item.furniture, keepReplaceRefurbish: value as 'keep' | 'replace' | 'refurbish' }
                })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="keep">Keep</SelectItem>
                  <SelectItem value="replace">Replace</SelectItem>
                  <SelectItem value="refurbish">Refurbish</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="looseFurnitureEstimate">Loose Furniture Estimate</Label>
              <Input 
                value={item.furniture?.looseFurnitureEstimate || ''} 
                onChange={(e) => onItemUpdate({ 
                  furniture: { ...item.furniture, looseFurnitureEstimate: e.target.value }
                })}
                placeholder="Quantities, types of loose furniture"
              />
            </div>
            <div>
              <Label htmlFor="upholsteryCondition">Upholstery Condition</Label>
              <Input 
                value={item.furniture?.upholsteryCondition || ''} 
                onChange={(e) => onItemUpdate({ 
                  furniture: { ...item.furniture, upholsteryCondition: e.target.value }
                })}
                placeholder="Fabric condition, replacement needs"
              />
            </div>
            <div>
              <Label htmlFor="hardwareNotes">Hardware Notes</Label>
              <Textarea 
                value={item.furniture?.hardwareNotes || ''} 
                onChange={(e) => onItemUpdate({ 
                  furniture: { ...item.furniture, hardwareNotes: e.target.value }
                })}
                placeholder="Hinges, locks, handles, mechanisms"
                rows={2}
              />
            </div>
          </div>
        );

      case 'Wet Areas':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="unitType">Unit Type</Label>
                <Select 
                  value={item.wetAreas?.unitType || ''} 
                  onValueChange={(value) => onItemUpdate({ 
                    wetAreas: { ...item.wetAreas, unitType: value as 'prefab' | 'custom' }
                  })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select unit type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="prefab">Prefab</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="surfaceFinish">Surface Finish</Label>
                <Select 
                  value={item.wetAreas?.surfaceFinish || ''} 
                  onValueChange={(value) => onItemUpdate({ 
                    wetAreas: { ...item.wetAreas, surfaceFinish: value }
                  })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select surface finish" />
                  </SelectTrigger>
                  <SelectContent>
                    {MATERIAL_OPTIONS.surfaceFinish.map(option => (
                      <SelectItem key={option} value={option}>{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="plumbingStatus">Plumbing Status</Label>
              <Input 
                value={item.wetAreas?.plumbingStatus || ''} 
                onChange={(e) => onItemUpdate({ 
                  wetAreas: { ...item.wetAreas, plumbingStatus: e.target.value }
                })}
                placeholder="Pipes, fixtures, water pressure"
              />
            </div>
            <div>
              <Label htmlFor="drainageSlope">Drainage/Slope Notes</Label>
              <Textarea 
                value={item.wetAreas?.drainageSlopeNotes || ''} 
                onChange={(e) => onItemUpdate({ 
                  wetAreas: { ...item.wetAreas, drainageSlopeNotes: e.target.value }
                })}
                placeholder="Drainage adequacy, slope requirements"
                rows={2}
              />
            </div>
            <div>
              <Label htmlFor="ventilationComments">Ventilation Comments</Label>
              <Textarea 
                value={item.wetAreas?.ventilationComments || ''} 
                onChange={(e) => onItemUpdate({ 
                  wetAreas: { ...item.wetAreas, ventilationComments: e.target.value }
                })}
                placeholder="Ventilation systems, air flow"
                rows={2}
              />
            </div>
          </div>
        );

      case 'Lighting & Electrical':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="ceilingLightType">Ceiling Light Type</Label>
              <Input 
                value={item.lightingElectrical?.ceilingLightType || ''} 
                onChange={(e) => onItemUpdate({ 
                  lightingElectrical: { ...item.lightingElectrical, ceilingLightType: e.target.value }
                })}
                placeholder="LED, fluorescent, recessed, etc."
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                checked={item.lightingElectrical?.switchesControls || false}
                onCheckedChange={(checked) => onItemUpdate({ 
                  lightingElectrical: { ...item.lightingElectrical, switchesControls: !!checked }
                })}
              />
              <Label>Switches/Controls Present</Label>
            </div>
            <div>
              <Label htmlFor="socketLayout">Socket Layout</Label>
              <Input 
                value={item.lightingElectrical?.socketLayout || ''} 
                onChange={(e) => onItemUpdate({ 
                  lightingElectrical: { ...item.lightingElectrical, socketLayout: e.target.value }
                })}
                placeholder="Number and location of power outlets"
              />
            </div>
            <div>
              <Label htmlFor="emergencyLighting">Emergency Lighting Status</Label>
              <Input 
                value={item.lightingElectrical?.emergencyLightingStatus || ''} 
                onChange={(e) => onItemUpdate({ 
                  lightingElectrical: { ...item.lightingElectrical, emergencyLightingStatus: e.target.value }
                })}
                placeholder="Emergency lighting condition and compliance"
              />
            </div>
          </div>
        );

      case 'HVAC / MEP Access':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="visibleSystems">Visible Systems (HVAC, Pipes, Electrical)</Label>
              <Textarea 
                value={item.hvacMepAccess?.visibleSystems || ''} 
                onChange={(e) => onItemUpdate({ 
                  hvacMepAccess: { ...item.hvacMepAccess, visibleSystems: e.target.value }
                })}
                placeholder="Describe visible MEP systems"
                rows={2}
              />
            </div>
            <div>
              <Label htmlFor="obstructions">Obstructions for ceiling/floor works</Label>
              <Textarea 
                value={item.hvacMepAccess?.obstructionsForWorks || ''} 
                onChange={(e) => onItemUpdate({ 
                  hvacMepAccess: { ...item.hvacMepAccess, obstructionsForWorks: e.target.value }
                })}
                placeholder="Potential obstructions for renovation work"
                rows={2}
              />
            </div>
            <div>
              <Label htmlFor="accessPanels">Access Panels Needed</Label>
              <Input 
                value={item.hvacMepAccess?.accessPanelsNeeded || ''} 
                onChange={(e) => onItemUpdate({ 
                  hvacMepAccess: { ...item.hvacMepAccess, accessPanelsNeeded: e.target.value }
                })}
                placeholder="Required access panels for maintenance"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                checked={item.hvacMepAccess?.relocationForeseen || false}
                onCheckedChange={(checked) => onItemUpdate({ 
                  hvacMepAccess: { ...item.hvacMepAccess, relocationForeseen: !!checked }
                })}
              />
              <Label>Any relocation foreseen?</Label>
            </div>
          </div>
        );

      case 'Public & Dining Zones':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="finishTypes">Finish Types (walls/floor)</Label>
              <Input 
                value={item.publicDiningZones?.finishTypes || ''} 
                onChange={(e) => onItemUpdate({ 
                  publicDiningZones: { ...item.publicDiningZones, finishTypes: e.target.value }
                })}
                placeholder="Current wall and floor finishes"
              />
            </div>
            <div>
              <Label htmlFor="furnitureNotesPublic">Furniture Notes</Label>
              <Textarea 
                value={item.publicDiningZones?.furnitureNotes || ''} 
                onChange={(e) => onItemUpdate({ 
                  publicDiningZones: { ...item.publicDiningZones, furnitureNotes: e.target.value }
                })}
                placeholder="Tables, chairs, fixtures, decorative items"
                rows={2}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                checked={item.publicDiningZones?.layoutModificationRequired || false}
                onCheckedChange={(checked) => onItemUpdate({ 
                  publicDiningZones: { ...item.publicDiningZones, layoutModificationRequired: !!checked }
                })}
              />
              <Label>Layout Modification Required?</Label>
            </div>
            <div>
              <Label htmlFor="reusabilityItems">Reusability of Items</Label>
              <Textarea 
                value={item.publicDiningZones?.reusabilityOfItems || ''} 
                onChange={(e) => onItemUpdate({ 
                  publicDiningZones: { ...item.publicDiningZones, reusabilityOfItems: e.target.value }
                })}
                placeholder="Which items can be reused vs replaced"
                rows={2}
              />
            </div>
          </div>
        );

      case 'Additional Notes & Procurement Flags':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="specialConditions">Special Conditions (asbestos, access issues)</Label>
              <Textarea 
                value={item.additionalNotes?.specialConditions || ''} 
                onChange={(e) => onItemUpdate({ 
                  additionalNotes: { ...item.additionalNotes, specialConditions: e.target.value }
                })}
                placeholder="Hazardous materials, access restrictions, safety concerns"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="earlyProcurement">Early Procurement Needs</Label>
              <Textarea 
                value={item.additionalNotes?.earlyProcurementNeeds || ''} 
                onChange={(e) => onItemUpdate({ 
                  additionalNotes: { ...item.additionalNotes, earlyProcurementNeeds: e.target.value }
                })}
                placeholder="Items requiring early ordering due to lead times"
                rows={2}
              />
            </div>
            <div>
              <Label htmlFor="observations">Notes / Observations</Label>
              <Textarea 
                value={item.additionalNotes?.observations || ''} 
                onChange={(e) => onItemUpdate({ 
                  additionalNotes: { ...item.additionalNotes, observations: e.target.value }
                })}
                placeholder="General observations and additional notes"
                rows={3}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="border rounded-lg p-6 space-y-6 bg-white shadow-sm">
      {/* Header Section */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-start gap-3">
            {getStatusIcon(item.status)}
            <div className="flex-1">
              <p className="font-medium flex items-center gap-2 text-lg">
                {item.question}
                {item.isPriority && (
                  <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                    Priority
                  </Badge>
                )}
              </p>
              {getStatusBadge(item.status)}
            </div>
          </div>
        </div>
      </div>

      {/* Core Estimator Fields */}
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

      {/* Dimensions & Quantity Inputs */}
      <DimensionsQuantityInputs
        item={item}
        onUpdate={onItemUpdate}
      />

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

      {/* Conditional Leveling/Prep Estimate - Only for flooring categories */}
      {shouldShowLevelingPrep() && (
        <div>
          <Label htmlFor="levelingPrep">Leveling / Prep Estimate</Label>
          <Input 
            value={item.levelingPrepEstimate || ''} 
            onChange={(e) => onItemUpdate({ levelingPrepEstimate: e.target.value })}
            placeholder="mm leveling, reinforcement, insulation requirements"
          />
        </div>
      )}

      {/* Category-specific fields */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-700">Category-Specific Details</h4>
        {renderCategorySpecificFields()}
      </div>

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

      {/* Procurement and Media Section */}
      <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Switch 
              checked={item.markForEarlyProcurement || false}
              onCheckedChange={(checked) => onItemUpdate({ markForEarlyProcurement: checked })}
            />
            <Label className="font-medium text-blue-700">Mark for Early Procurement</Label>
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

      {/* General Notes */}
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
    </div>
  );
};

export default EstimatorAssessmentItem;
