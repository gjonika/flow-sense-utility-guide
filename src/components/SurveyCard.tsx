
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Clock, Users } from 'lucide-react';
import { Survey } from '@/types/survey';
import { StoredSurvey } from '@/types/storage';
import DeleteSurveyButton from './DeleteSurveyButton';

interface SurveyCardProps {
  survey: Survey | StoredSurvey;
  onClick?: () => void;
  onDelete?: () => void;
}

const SurveyCard: React.FC<SurveyCardProps> = ({ survey, onClick, onDelete }) => {
  const isLocalSurvey = 'local_only' in survey && survey.local_only;
  const needsSync = 'needs_sync' in survey && survey.needs_sync;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-300';
      case 'in-progress': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'draft': return 'bg-gray-100 text-gray-800 border-gray-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getSyncStatusColor = () => {
    if (isLocalSurvey && needsSync) {
      return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    }
    if (isLocalSurvey) {
      return 'bg-orange-100 text-orange-800 border-orange-300';
    }
    return 'bg-green-100 text-green-800 border-green-300';
  };

  const getSyncStatusText = () => {
    if (isLocalSurvey && needsSync) return 'Pending Sync';
    if (isLocalSurvey) return 'Local Only';
    return 'Synced';
  };

  // Safe access to potentially undefined values
  const clientContacts = survey.client_contacts || [];
  const contactCount = Array.isArray(clientContacts) ? clientContacts.length : 0;

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer relative">
      <div className="absolute top-2 right-2 z-10">
        <DeleteSurveyButton
          surveyId={survey.id}
          surveyName={survey.ship_name || 'Unnamed Survey'}
          isOnline={!isLocalSurvey}
          onDelete={onDelete}
          variant="outline"
          size="icon"
        />
      </div>
      
      <CardHeader onClick={onClick} className="pb-2 pr-12">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-gray-900 mb-1">
              {survey.ship_name || 'Unnamed Survey'}
            </CardTitle>
            <p className="text-sm text-gray-600 mb-2">
              {survey.client_name || 'Unknown Client'}
            </p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Badge className={getStatusColor(survey.status)}>
            {survey.status?.replace('-', ' ') || 'Unknown'}
          </Badge>
          <Badge className={getSyncStatusColor()}>
            {getSyncStatusText()}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent onClick={onClick} className="pt-0">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>{survey.survey_date ? new Date(survey.survey_date).toLocaleDateString() : 'No date set'}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="h-4 w-4" />
            <span className="truncate">{survey.survey_location || 'Location not specified'}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="h-4 w-4" />
            <span>{survey.duration || 'Duration not specified'}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Users className="h-4 w-4" />
            <span>{contactCount} contact{contactCount !== 1 ? 's' : ''}</span>
          </div>
        </div>
        
        {survey.project_scope && (
          <div className="mt-3 pt-3 border-t">
            <p className="text-sm text-gray-700 line-clamp-2">
              {survey.project_scope}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SurveyCard;
