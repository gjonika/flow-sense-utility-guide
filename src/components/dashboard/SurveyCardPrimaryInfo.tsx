import { Calendar, MapPin, Clock, Users } from 'lucide-react';
import { Survey } from '@/types/survey';
import { StoredSurvey } from '@/types/storage';

interface SurveyCardPrimaryInfoProps {
  survey: Survey | StoredSurvey;
}

const SurveyCardPrimaryInfo = ({ survey }: SurveyCardPrimaryInfoProps) => {
  // Extract country from survey location for proper geography tracking
  const getSurveyCountry = (location: string) => {
    if (!location) return 'Unknown Location';
    // If location already includes country (e.g., "Dubrovnik, Croatia"), return as is
    // Otherwise, just return the location
    return location;
  };

  const surveyLocation = survey.survey_location || 'Unknown Location';
  const duration = survey.duration || 'Not specified';
  
  // Route/Voyage info - check if it's different from basic duration
  const routeInfo = duration.includes('-') || duration.toLowerCase().includes('route') || duration.toLowerCase().includes('voyage') 
    ? duration 
    : `${duration} voyage`;

  // Personnel count - for future travel team integration
  const personnelCount = survey.client_contacts?.length || 0;

  return (
    <div className="space-y-3">
      {/* Survey Date - Always visible */}
      <div className="flex items-center text-sm text-gray-600">
        <Calendar className="mr-2 h-4 w-4" />
        {survey.survey_date ? new Date(survey.survey_date).toLocaleDateString() : 'Date not set'}
      </div>

      {/* Survey Location (Boarding Location) - Always visible */}
      <div className="flex items-center text-sm text-gray-600">
        <MapPin className="mr-2 h-4 w-4" />
        <span className="font-medium">Survey Location:</span>
        <span className="ml-1">{getSurveyCountry(surveyLocation)}</span>
      </div>

      {/* Route/Voyage Duration - Always visible */}
      <div className="flex items-center text-sm text-gray-600">
        <Clock className="mr-2 h-4 w-4" />
        <span className="font-medium">Route/Voyage:</span>
        <span className="ml-1">{routeInfo}</span>
      </div>

      {/* Personnel Count - Always visible or badge */}
      <div className="flex items-center text-sm text-gray-600">
        <Users className="mr-2 h-4 w-4" />
        <span className="font-medium">Personnel:</span>
        <span className="ml-1">
          {personnelCount > 0 ? `${personnelCount} inspector${personnelCount !== 1 ? 's' : ''}` : 'Not assigned'}
        </span>
      </div>
    </div>
  );
};

export default SurveyCardPrimaryInfo;
