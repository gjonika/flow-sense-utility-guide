import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, MapPin, Ship, User, Clock, FileText } from 'lucide-react';
import { Survey } from '@/types/survey';
import GeneralInformation from './assessment/GeneralInformation';

interface SurveyOverviewCardProps {
  survey: Survey;
  onStatusChange: (status: Survey['status']) => void;
  onUpdate?: (updates: Partial<Survey>) => void;
}

const SurveyOverviewCard = ({ survey, onStatusChange, onUpdate }: SurveyOverviewCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleGeneralInfoUpdate = (updates: Partial<Survey>) => {
    if (onUpdate) {
      onUpdate(updates);
    }
  };

  // Extract country from survey location (where the work is done)
  const getSurveyCountry = (location: string) => {
    if (!location) return 'Unknown Location';
    // If location includes comma, assume format is "City, Country"
    if (location.includes(',')) {
      const parts = location.split(',');
      return parts[parts.length - 1].trim();
    }
    // Otherwise, treat as country/region
    return location;
  };

  const surveyCountry = getSurveyCountry(survey.survey_location);

  return (
    <div className="space-y-6">
      {/* General Information Section */}
      <GeneralInformation 
        survey={survey}
        onUpdate={handleGeneralInfoUpdate}
      />

      {/* Survey Overview Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Survey Overview
            </div>
            <div className="flex items-center gap-3">
              <Select value={survey.status} onValueChange={onStatusChange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
              <Badge className={getStatusColor(survey.status)}>
                {survey.status.replace('-', ' ').toUpperCase()}
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Vessel & Survey Details */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Ship className="h-4 w-4" />
                <span className="font-medium">Ship:</span>
                <span>{survey.ship_name || 'Not specified'}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4" />
                <span className="font-medium">Location:</span>
                <span>{survey.survey_location || 'Not specified'}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4" />
                <span className="font-medium">Country:</span>
                <span>{surveyCountry}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="h-4 w-4" />
                <span className="font-medium">Date:</span>
                <span>
                  {survey.survey_date 
                    ? new Date(survey.survey_date).toLocaleDateString() 
                    : 'Not set'
                  }
                </span>
              </div>
            </div>

            {/* Client Information */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <User className="h-4 w-4" />
                <span className="font-medium">Client:</span>
                <span>{survey.client_name || 'Not specified'}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4" />
                <span className="font-medium">Client HQ:</span>
                <span>{survey.client_country || 'Not specified'}</span>
              </div>
              {survey.custom_fields?.kam && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <User className="h-4 w-4" />
                  <span className="font-medium">KAM:</span>
                  <span>{survey.custom_fields.kam}</span>
                </div>
              )}
              {survey.client_contacts && survey.client_contacts.length > 0 && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <User className="h-4 w-4" />
                  <span className="font-medium">Contacts:</span>
                  <span>{survey.client_contacts.length} contact{survey.client_contacts.length !== 1 ? 's' : ''}</span>
                </div>
              )}
            </div>

            {/* Project Information */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                <span className="font-medium">Duration:</span>
                <span>{survey.duration || 'Not specified'}</span>
              </div>
              {survey.custom_fields?.project_number && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FileText className="h-4 w-4" />
                  <span className="font-medium">Project #:</span>
                  <span>{survey.custom_fields.project_number}</span>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="space-y-2">
              <div className="text-sm font-medium text-gray-900 mb-2">Quick Actions</div>
              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start"
                  onClick={() => {/* Handle export */}}
                >
                  Export PDF
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start"
                  onClick={() => {/* Handle print */}}
                >
                  Print Report
                </Button>
              </div>
            </div>
          </div>

          {/* Project Scope */}
          {survey.project_scope && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Project Scope</h4>
              <p className="text-sm text-gray-600">{survey.project_scope}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SurveyOverviewCard;
