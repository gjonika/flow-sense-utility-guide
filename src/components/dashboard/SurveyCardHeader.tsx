
import { Ship } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Survey } from '@/types/survey';
import { StoredSurvey } from '@/types/storage';

interface SurveyCardHeaderProps {
  survey: Survey | StoredSurvey;
  getStatusColor: (status: string) => string;
}

const SurveyCardHeader = ({ survey, getStatusColor }: SurveyCardHeaderProps) => {
  const shipName = survey.ship_name || 'Unnamed Ship';

  return (
    <div className="flex items-start justify-between">
      <div className="flex items-center text-lg pr-2 flex-1">
        <Ship className="mr-2 h-5 w-5 text-blue-600 flex-shrink-0" />
        <span className="line-clamp-1 font-semibold">{shipName}</span>
      </div>
      <div className="flex flex-wrap gap-2 mt-1">
        <Badge className={getStatusColor(survey.status)}>
          {survey.status.replace('-', ' ')}
        </Badge>
      </div>
    </div>
  );
};

export default SurveyCardHeader;
