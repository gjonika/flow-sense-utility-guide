
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User } from 'lucide-react';
import { Survey } from '@/types/survey';

interface InspectorInformationSectionProps {
  survey: Survey;
  onUpdate: (field: string, value: string) => void;
}

const InspectorInformationSection = ({ survey, onUpdate }: InspectorInformationSectionProps) => {
  const inspectorName = survey.custom_fields?.inspector_name || '';
  const inspectorCompany = survey.custom_fields?.inspector_company || '';

  return (
    <div>
      <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center gap-2">
        <User className="h-4 w-4" />
        Inspector Information
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="inspectorName">Inspector Name</Label>
          <Input
            id="inspectorName"
            value={inspectorName}
            onChange={(e) => onUpdate('inspector_name', e.target.value)}
            placeholder="Inspector name"
          />
        </div>
        
        <div>
          <Label htmlFor="inspectorCompany">Inspector Company</Label>
          <Input
            id="inspectorCompany"
            value={inspectorCompany}
            onChange={(e) => onUpdate('inspector_company', e.target.value)}
            placeholder="Company name"
          />
        </div>
      </div>
    </div>
  );
};

export default InspectorInformationSection;
