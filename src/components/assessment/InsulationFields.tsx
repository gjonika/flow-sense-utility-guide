
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { MATERIAL_OPTIONS } from '@/constants/materialOptions';

interface InsulationFieldsProps {
  insulation: any;
  onUpdate: (updates: any) => void;
  type: 'wall' | 'floor' | 'ceiling';
}

const InsulationFields = ({ insulation = {}, onUpdate, type }: InsulationFieldsProps) => {
  const getTypeSpecificFields = () => {
    if (type === 'floor') {
      return (
        <>
          <div>
            <Label htmlFor="underdeckType">Underdeck Insulation</Label>
            <Select 
              value={insulation.underdeckType || ''} 
              onValueChange={(value) => onUpdate({ ...insulation, underdeckType: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select underdeck type" />
              </SelectTrigger>
              <SelectContent>
                {MATERIAL_OPTIONS.insulationType.map(option => (
                  <SelectItem key={option} value={option}>{option}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="soundproofingType">Soundproofing Type</Label>
            <Input 
              value={insulation.soundproofingType || ''} 
              onChange={(e) => onUpdate({ ...insulation, soundproofingType: e.target.value })}
              placeholder="Acoustic insulation material"
            />
          </div>
        </>
      );
    }

    return (
      <>
        <div>
          <Label htmlFor="existingType">Existing Insulation Type</Label>
          <Select 
            value={insulation.existingType || ''} 
            onValueChange={(value) => onUpdate({ ...insulation, existingType: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select existing type" />
            </SelectTrigger>
            <SelectContent>
              {MATERIAL_OPTIONS.insulationType.map(option => (
                <SelectItem key={option} value={option}>{option}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="plannedType">Planned Insulation Type</Label>
          <Input 
            value={insulation.plannedType || ''} 
            onChange={(e) => onUpdate({ ...insulation, plannedType: e.target.value })}
            placeholder="Planned insulation material"
          />
        </div>
      </>
    );
  };

  return (
    <div className="space-y-4 p-4 bg-blue-50 rounded-md border border-blue-200">
      <h4 className="font-medium text-blue-900">Insulation Assessment</h4>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {getTypeSpecificFields()}
        
        <div>
          <Label htmlFor="thickness">Thickness (mm)</Label>
          <Input 
            type="number"
            min="0"
            value={insulation.thickness || ''} 
            onChange={(e) => onUpdate({ ...insulation, thickness: parseInt(e.target.value) || 0 })}
            placeholder="Thickness in mm"
          />
        </div>

        <div>
          <Label htmlFor="function">Primary Function</Label>
          <Select 
            value={insulation.function || ''} 
            onValueChange={(value) => onUpdate({ ...insulation, function: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select function" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="thermal">Thermal</SelectItem>
              <SelectItem value="acoustic">Acoustic</SelectItem>
              <SelectItem value="both">Both</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-center space-x-2">
          <Checkbox 
            checked={insulation.fireproofingRequired || false}
            onCheckedChange={(checked) => onUpdate({ ...insulation, fireproofingRequired: !!checked })}
          />
          <Label>Fireproofing Required</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox 
            checked={insulation.moistureBarrierRequired || false}
            onCheckedChange={(checked) => onUpdate({ ...insulation, moistureBarrierRequired: !!checked })}
          />
          <Label>Moisture Barrier Required</Label>
        </div>

        <div>
          <Label htmlFor="action">Action Required</Label>
          <Select 
            value={insulation.action || ''} 
            onValueChange={(value) => onUpdate({ ...insulation, action: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select action" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="keep">Keep</SelectItem>
              <SelectItem value="replace">Replace</SelectItem>
              <SelectItem value="add_new">Add New</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="insulationNotes">Insulation Notes</Label>
        <Textarea 
          value={insulation.insulationNotes || ''} 
          onChange={(e) => onUpdate({ ...insulation, insulationNotes: e.target.value })}
          placeholder="Additional notes about insulation requirements, installation considerations, etc."
          rows={2}
        />
      </div>
    </div>
  );
};

export default InsulationFields;
