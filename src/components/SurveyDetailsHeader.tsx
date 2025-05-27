
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, MapPin, Calendar, Ship, User, CheckCircle } from 'lucide-react';
import { Survey } from '@/types/survey';
import SyncStatusBadge from './SyncStatusBadge';
import MainHeader from './MainHeader';
import ChecklistConnectionStatus from './checklist/ChecklistConnectionStatus';
import { useIsMobile } from '@/hooks/use-mobile';
import { useChecklistResponses } from '@/hooks/useChecklistResponses';
import { useChecklistTemplates } from '@/hooks/useChecklistTemplates';
import { ChecklistResponse } from '@/types/checklist';

interface SurveyDetailsHeaderProps {
  survey: Survey;
  isOnline: boolean;
  onBack: () => void;
}

const SurveyDetailsHeader = ({ survey, isOnline, onBack }: SurveyDetailsHeaderProps) => {
  const isMobile = useIsMobile();
  const [responses, setResponses] = useState<ChecklistResponse[]>([]);
  const { getResponsesForSurvey } = useChecklistResponses();
  const { templates } = useChecklistTemplates();

  // Get questions from the default template
  const questions = templates.find(t => t.is_default)?.questions || [];

  // Load responses for this survey
  useEffect(() => {
    const loadResponses = async () => {
      try {
        const surveyResponses = await getResponsesForSurvey(survey.id);
        setResponses(surveyResponses);
      } catch (error) {
        console.error('Failed to load responses:', error);
      }
    };

    loadResponses();
  }, [survey.id, getResponsesForSurvey]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Calculate checklist progress
  const totalQuestions = questions.length;
  const answeredQuestions = responses.length;
  const progressPercentage = totalQuestions > 0 ? Math.round((answeredQuestions / totalQuestions) * 100) : 0;

  return (
    <>
      <MainHeader />
      <div className="bg-white border-b border-gray-200 px-2 sm:px-4 py-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-2 sm:gap-4 flex-1 min-w-0">
            <Button
              variant="outline"
              size={isMobile ? "sm" : "sm"}
              onClick={onBack}
              className="shrink-0"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              {isMobile ? '' : 'Back'}
            </Button>
            <div className="min-w-0 flex-1">
              <h1 className="text-lg sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-1 sm:mb-2 truncate">
                {survey.ship_name || 'Unnamed Ship'}
              </h1>
              <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-1 sm:gap-3 text-xs sm:text-sm text-gray-600">
                {/* Ship information first */}
                <div className="flex items-center gap-1 truncate">
                  <Ship className="h-3 w-3 sm:h-4 sm:w-4 shrink-0" />
                  <span className="truncate">{survey.ship_name || 'Unknown Ship'}</span>
                </div>
                {/* Location second */}
                <div className="flex items-center gap-1 truncate">
                  <MapPin className="h-3 w-3 sm:h-4 sm:w-4 shrink-0" />
                  <span className="truncate">{survey.survey_location || 'Unknown Location'}</span>
                </div>
                {/* Date third */}
                <div className="flex items-center gap-1 truncate">
                  <Calendar className="h-3 w-3 sm:h-4 sm:w-4 shrink-0" />
                  <span className="truncate">{survey.survey_date ? new Date(survey.survey_date).toLocaleDateString() : 'Date not set'}</span>
                </div>
                {/* Client information last - hide on very small screens */}
                {!isMobile && (
                  <div className="flex items-center gap-1 truncate">
                    <User className="h-4 w-4 shrink-0" />
                    <span className="truncate">{survey.client_name || 'Unknown Client'}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            <SyncStatusBadge survey={survey} isOnline={isOnline} />
            <Badge className={`${getStatusColor(survey.status)} text-xs`}>
              {isMobile ? survey.status.charAt(0).toUpperCase() : survey.status.replace('-', ' ').toUpperCase()}
            </Badge>
            {!isMobile && (
              <Button
                variant="outline"
                size="sm"
                onClick={onBack}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            )}
          </div>
        </div>
        
        {/* Global Status Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 mt-3 pt-3 border-t border-gray-100">
          <ChecklistConnectionStatus isOnline={isOnline} />
          
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <div className="text-xs sm:text-sm text-gray-600">
              Checklist: {answeredQuestions}/{totalQuestions} ({progressPercentage}%)
            </div>
            <div className="flex items-center gap-2">
              <div className="w-20 sm:w-32 bg-gray-200 rounded-full h-1.5 sm:h-2">
                <div
                  className="bg-blue-600 h-1.5 sm:h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              {progressPercentage === 100 && (
                <div className="flex items-center text-green-600">
                  <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                  <span className="text-xs sm:text-sm font-medium">Complete</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SurveyDetailsHeader;
