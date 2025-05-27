
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, BarChart3 } from 'lucide-react';
import { Survey } from '@/types/survey';
import { StoredSurvey } from '@/types/storage';
import DeleteSurveyButton from '@/components/DeleteSurveyButton';
import ProjectInsights from './ProjectInsights';
import ProjectExpandedDetails from './ProjectExpandedDetails';

interface EnhancedProjectCardProps {
  survey: Survey | StoredSurvey;
  isOnline: boolean;
  onView: (survey: Survey | StoredSurvey) => void;
  onEdit: (survey: Survey | StoredSurvey) => void;
  onViewAnalytics?: (survey: Survey | StoredSurvey) => void;
  onDelete?: () => void;
}

const EnhancedProjectCard = ({ 
  survey, 
  isOnline, 
  onView, 
  onEdit, 
  onViewAnalytics,
  onDelete 
}: EnhancedProjectCardProps) => {
  const getStatusColor = (status: Survey['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const isLocalSurvey = 'local_only' in survey && survey.local_only;
  const shipName = survey.ship_name || 'Unnamed Ship';

  return (
    <Card className="border-blue-200 hover:shadow-lg transition-all duration-200 relative">
      {/* Delete button positioned in top right corner */}
      <div className="absolute top-3 right-3 z-10">
        <DeleteSurveyButton
          surveyId={survey.id}
          surveyName={shipName}
          isOnline={!isLocalSurvey}
          onDelete={onDelete}
          variant="ghost"
          size="sm"
        />
      </div>

      <CardHeader className="pb-3 pr-16">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {shipName}
            </h3>
            <p className="text-sm text-gray-600 mb-2">
              {survey.client_name || 'Unknown Client'}
            </p>
          </div>
        </div>
        
        {/* Survey Location - Fixed to use survey_location instead of client_country */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-gray-500" />
            <span className="text-gray-900">{survey.survey_location || 'Location not specified'}</span>
          </div>
          
          {survey.survey_date && (
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="text-gray-900">{new Date(survey.survey_date).toLocaleDateString()}</span>
              {survey.duration && (
                <span className="text-gray-600">({survey.duration})</span>
              )}
            </div>
          )}
        </div>
        
        <div className="flex flex-wrap gap-2 mt-3">
          <Badge className={getStatusColor(survey.status)}>
            {survey.status?.replace('-', ' ') || 'Unknown'}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {/* Project Insights */}
        <ProjectInsights survey={survey} />
        
        {/* Expandable Details */}
        <ProjectExpandedDetails survey={survey} />

        {/* Action buttons */}
        <div className="pt-3 border-t border-gray-100">
          <div className="flex gap-2">
            <Button 
              variant="outline"
              onClick={() => onView(survey)}
              className="flex-1"
              size="sm"
            >
              View Details
            </Button>
            <Button 
              onClick={() => onEdit(survey)}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              size="sm"
            >
              Edit
            </Button>
            {survey.status === 'completed' && onViewAnalytics && (
              <Button
                variant="outline"
                onClick={() => onViewAnalytics(survey)}
                size="sm"
                className="px-3"
              >
                <BarChart3 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedProjectCard;
