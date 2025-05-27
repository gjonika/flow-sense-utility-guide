
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Ship, ChevronDown, ChevronUp } from 'lucide-react';
import { Survey, ClientContact } from '@/types/survey';
import VesselInformationSection from './VesselInformationSection';
import SurveyInformationSection from './SurveyInformationSection';
import InspectorInformationSection from './InspectorInformationSection';
import ClientInformationSection from './ClientInformationSection';

interface GeneralInformationProps {
  survey: Survey;
  onUpdate: (updates: Partial<Survey>) => void;
}

const GeneralInformation = ({ survey, onUpdate }: GeneralInformationProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleUpdate = (field: string, value: string) => {
    const updatedCustomFields = {
      ...survey.custom_fields,
      [field]: value
    };
    
    // Handle special cases for fields that map to main survey properties
    if (field === 'vessel_name') {
      onUpdate({ 
        ship_name: value,
        custom_fields: updatedCustomFields
      });
    } else if (field === 'inspection_date') {
      onUpdate({ 
        survey_date: value,
        custom_fields: updatedCustomFields
      });
    } else if (field === 'port_of_inspection') {
      onUpdate({ 
        survey_location: value,
        custom_fields: updatedCustomFields
      });
    } else {
      onUpdate({ custom_fields: updatedCustomFields });
    }
  };

  const handleMainFieldUpdate = (field: keyof Survey, value: string) => {
    onUpdate({ [field]: value });
  };

  const handleClientContactsUpdate = (contacts: ClientContact[]) => {
    onUpdate({ client_contacts: contacts });
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-gray-50">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Ship className="h-5 w-5" />
                General Information
                <span className="text-sm font-normal text-gray-500 ml-2">
                  (Click to edit survey metadata)
                </span>
              </div>
              {isOpen ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </CardTitle>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="space-y-6">
            <ClientInformationSection 
              survey={survey}
              onUpdate={handleUpdate}
              onMainFieldUpdate={handleMainFieldUpdate}
              onClientContactsUpdate={handleClientContactsUpdate}
            />

            <SurveyInformationSection 
              survey={survey}
              onMainFieldUpdate={handleMainFieldUpdate}
              onUpdate={handleUpdate}
            />

            <VesselInformationSection 
              survey={survey}
              onUpdate={handleUpdate}
              onMainFieldUpdate={handleMainFieldUpdate}
            />

            <InspectorInformationSection 
              survey={survey}
              onUpdate={handleUpdate}
            />
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
};

export default GeneralInformation;
