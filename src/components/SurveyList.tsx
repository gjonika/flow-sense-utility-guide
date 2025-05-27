
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Ship, Calendar, MapPin, Users } from "lucide-react";
import { Survey } from "@/types/survey";
import SyncStatusBadge from "./SyncStatusBadge";

interface SurveyListProps {
  surveys: Survey[];
  onEditSurvey: (survey: Survey) => void;
  onViewSurvey: (survey: Survey) => void;
  isOnline?: boolean;
}

const SurveyList = ({ surveys, onEditSurvey, onViewSurvey, isOnline = true }: SurveyListProps) => {
  const getStatusColor = (status: Survey['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="grid gap-4">
      {surveys.map((survey) => {
        // Safe value getters with fallbacks
        const shipName = survey.ship_name || 'Unnamed Ship';
        const clientName = survey.client_name || 'Unknown Client';
        const surveyLocation = survey.survey_location || 'Unknown Location';
        const clientCountry = survey.client_country || 'Unknown Country';
        const duration = survey.duration || 'Not specified';
        const projectScope = survey.project_scope || 'No description available';

        return (
          <Card key={survey.id} className="border-blue-200 hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <CardTitle className="flex items-center text-lg">
                  <Ship className="mr-2 h-5 w-5 text-blue-600" />
                  {shipName}
                </CardTitle>
                <div className="flex gap-2">
                  <Badge className={getStatusColor(survey.status)}>
                    {survey.status.replace('-', ' ')}
                  </Badge>
                  <SyncStatusBadge survey={survey} isOnline={isOnline} />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-4">
                <p className="text-gray-600">
                  <strong>Client:</strong> {clientName}
                </p>
                <div className="flex items-center text-gray-600">
                  <Calendar className="mr-2 h-4 w-4" />
                  {survey.survey_date ? new Date(survey.survey_date).toLocaleDateString() : 'Date not set'}
                </div>
                <div className="flex items-center text-gray-600">
                  <MapPin className="mr-2 h-4 w-4" />
                  {surveyLocation}, {clientCountry}
                </div>
                {survey.client_contacts && survey.client_contacts.length > 0 && (
                  <div className="flex items-center text-gray-600">
                    <Users className="mr-2 h-4 w-4" />
                    {survey.client_contacts.length} contact{survey.client_contacts.length !== 1 ? 's' : ''}
                  </div>
                )}
                <p className="text-gray-600">
                  <strong>Duration:</strong> {duration}
                </p>
              </div>
              
              <div className="mb-4">
                <p className="text-sm text-gray-700 line-clamp-2">
                  {projectScope}
                </p>
              </div>

              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  Created: {survey.created_at ? new Date(survey.created_at).toLocaleDateString() : 'Unknown'}
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={() => onViewSurvey(survey)}
                  >
                    View Details
                  </Button>
                  <Button 
                    onClick={() => onEditSurvey(survey)}
                    className="bg-blue-600 hover:bg-blue-700"
                    size="sm"
                  >
                    Edit Survey
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default SurveyList;
