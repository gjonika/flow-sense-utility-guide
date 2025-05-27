
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Ship } from 'lucide-react';
import { Survey } from '@/types/survey';

interface VesselInformationSectionProps {
  survey: Survey;
  onUpdate: (field: string, value: string) => void;
  onMainFieldUpdate: (field: keyof Survey, value: string) => void;
}

const VesselInformationSection = ({ survey, onUpdate, onMainFieldUpdate }: VesselInformationSectionProps) => {
  const imoNumber = survey.custom_fields?.imo_number || '';
  const shipType = survey.custom_fields?.ship_type || '';
  const lastDryDock = survey.custom_fields?.last_dry_dock || '';
  const lastMajorRefurbishment = survey.custom_fields?.last_major_refurbishment || '';

  return (
    <div>
      <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center gap-2">
        <Ship className="h-4 w-4" />
        Vessel Information
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="vesselName">Vessel Name</Label>
          <Input
            id="vesselName"
            value={survey.ship_name || ''}
            onChange={(e) => onMainFieldUpdate('ship_name', e.target.value)}
            placeholder="Enter vessel name"
          />
        </div>
        
        <div>
          <Label htmlFor="imoNumber">IMO Number</Label>
          <Input
            id="imoNumber"
            value={imoNumber}
            onChange={(e) => onUpdate('imo_number', e.target.value)}
            placeholder="IMO number"
          />
        </div>
        
        <div>
          <Label htmlFor="shipType">Ship Type / Classification</Label>
          <Input
            id="shipType"
            value={shipType}
            onChange={(e) => onUpdate('ship_type', e.target.value)}
            placeholder="e.g., Cruise ship, Ferry, etc."
          />
        </div>
        
        <div>
          <Label htmlFor="lastDryDock">Last Dry Dock</Label>
          <Input
            id="lastDryDock"
            type="date"
            value={lastDryDock}
            onChange={(e) => onUpdate('last_dry_dock', e.target.value)}
          />
        </div>
        
        <div>
          <Label htmlFor="lastMajorRefurbishment">Last Major Refurbishment</Label>
          <Input
            id="lastMajorRefurbishment"
            type="date"
            value={lastMajorRefurbishment}
            onChange={(e) => onUpdate('last_major_refurbishment', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default VesselInformationSection;
