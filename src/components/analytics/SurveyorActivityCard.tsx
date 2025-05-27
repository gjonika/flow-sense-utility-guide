
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Clock } from 'lucide-react';
import { Survey } from '@/types/survey';

interface SurveyorActivityCardProps {
  surveys: Survey[];
}

const SurveyorActivityCard = ({ surveys }: SurveyorActivityCardProps) => {
  // Calculate surveyor activity metrics
  const calculateSurveyorStats = () => {
    if (surveys.length === 0) return { uniqueSurveyors: 0, lastActivity: 'N/A' };
    
    // Mock: extract unique surveyors (in real implementation, would have surveyor field)
    const uniqueSurveyors = new Set(surveys.map(s => s.user_id || 'anonymous')).size;
    
    // Find most recent activity
    const sortedByDate = surveys
      .filter(s => s.updated_at)
      .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
    
    const lastActivity = sortedByDate.length > 0 
      ? new Date(sortedByDate[0].updated_at).toLocaleDateString()
      : 'N/A';
    
    return { uniqueSurveyors, lastActivity };
  };

  const { uniqueSurveyors, lastActivity } = calculateSurveyorStats();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Surveyor Activity</CardTitle>
        <Users className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{uniqueSurveyors}</div>
        <p className="text-xs text-muted-foreground">Active surveyors</p>
        <div className="flex items-center gap-1 mt-2 text-xs text-gray-600">
          <Clock className="h-3 w-3" />
          <span>Last update: {lastActivity}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default SurveyorActivityCard;
