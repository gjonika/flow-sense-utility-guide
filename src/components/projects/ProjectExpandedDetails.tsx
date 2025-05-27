
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Copy, User, Building, Plane, Calendar, FileText } from 'lucide-react';
import { Survey } from '@/types/survey';
import { useToast } from '@/hooks/use-toast';

interface ProjectExpandedDetailsProps {
  survey: Survey;
}

const ProjectExpandedDetails = ({ survey }: ProjectExpandedDetailsProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { toast } = useToast();

  const handleCopyScope = () => {
    navigator.clipboard.writeText(survey.project_scope || '');
    toast({
      title: "Copied",
      description: "Project scope copied to clipboard",
    });
  };

  const clientContacts = survey.client_contacts || [];
  const flightDetails = survey.flight_details || {};
  const hotelDetails = survey.hotel_details || {};

  return (
    <div className="mt-3">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full justify-between p-2 h-8 text-sm text-gray-600 hover:text-gray-800"
      >
        <span>{isExpanded ? 'Hide Details' : 'View Details'}</span>
        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </Button>

      {isExpanded && (
        <div className="mt-3 space-y-4 p-3 bg-gray-50 rounded-lg">
          {/* Client Information */}
          <div>
            <h4 className="font-medium text-sm text-gray-700 mb-2 flex items-center gap-2">
              <Building className="h-4 w-4" />
              Client Information
            </h4>
            <div className="space-y-1 text-sm text-gray-600 ml-6">
              <div><strong>Company:</strong> {survey.client_name}</div>
              <div><strong>HQ Country:</strong> {survey.client_country}</div>
              {clientContacts.length > 0 && (
                <div>
                  <strong>Contacts:</strong>
                  <div className="ml-2 mt-1 space-y-1">
                    {clientContacts.slice(0, 2).map((contact, index) => (
                      <div key={index} className="text-xs">
                        <span className="font-medium">{contact.name}</span>
                        {contact.role && <span className="text-gray-500"> ({contact.role})</span>}
                        <br />
                        <span className="text-gray-500">{contact.email}</span>
                      </div>
                    ))}
                    {clientContacts.length > 2 && (
                      <div className="text-xs text-gray-500">
                        +{clientContacts.length - 2} more contacts
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Surveyors */}
          <div>
            <h4 className="font-medium text-sm text-gray-700 mb-2 flex items-center gap-2">
              <User className="h-4 w-4" />
              Surveyors
            </h4>
            <div className="text-sm text-gray-600 ml-6">
              {/* Mock surveyor data - in real implementation, would come from travel tab */}
              <div>Primary Surveyor: John Smith</div>
              <div className="text-xs text-gray-500">j.smith@company.com</div>
            </div>
          </div>

          {/* Project Scope */}
          <div>
            <h4 className="font-medium text-sm text-gray-700 mb-2 flex items-center gap-2 justify-between">
              <span className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Project Scope
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopyScope}
                className="h-6 px-2 text-xs"
              >
                <Copy className="h-3 w-3 mr-1" />
                Copy
              </Button>
            </h4>
            <div className="text-sm text-gray-600 ml-6 max-h-20 overflow-y-auto">
              {survey.project_scope || 'No project scope provided'}
            </div>
          </div>

          {/* Travel Information */}
          {(flightDetails.outbound_date || hotelDetails.checkin_date) && (
            <div>
              <h4 className="font-medium text-sm text-gray-700 mb-2 flex items-center gap-2">
                <Plane className="h-4 w-4" />
                Travel Details
              </h4>
              <div className="space-y-1 text-sm text-gray-600 ml-6">
                {flightDetails.outbound_date && (
                  <div>
                    <strong>Outbound:</strong> {new Date(flightDetails.outbound_date).toLocaleDateString()}
                    {flightDetails.airline && <span className="text-gray-500"> via {flightDetails.airline}</span>}
                  </div>
                )}
                {flightDetails.return_date && (
                  <div>
                    <strong>Return:</strong> {new Date(flightDetails.return_date).toLocaleDateString()}
                  </div>
                )}
                {hotelDetails.checkin_date && (
                  <div>
                    <strong>Hotel:</strong> {new Date(hotelDetails.checkin_date).toLocaleDateString()} - {hotelDetails.checkout_date ? new Date(hotelDetails.checkout_date).toLocaleDateString() : 'TBD'}
                    {hotelDetails.hotel_name && <span className="text-gray-500"> at {hotelDetails.hotel_name}</span>}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProjectExpandedDetails;
