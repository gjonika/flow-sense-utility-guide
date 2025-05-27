
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from 'lucide-react';
import { Survey } from '@/types/survey';

interface ProjectTimelineProps {
  surveys: Survey[];
}

const ProjectTimeline = ({ surveys }: ProjectTimelineProps) => {
  // Calculate timeline data for each survey
  const timelineData = surveys.map(survey => {
    const startDate = new Date(survey.survey_date);
    const durationDays = parseInt(survey.duration) || 1;
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + durationDays);
    
    return {
      id: survey.id,
      shipName: survey.ship_name,
      startDate,
      endDate,
      status: survey.status,
      duration: durationDays
    };
  }).sort((a, b) => a.startDate.getTime() - b.startDate.getTime());

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'in-progress': return 'bg-blue-500';
      case 'draft': return 'bg-gray-400';
      default: return 'bg-gray-300';
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Project Timeline
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {timelineData.slice(0, 8).map((item) => (
            <div key={item.id} className="space-y-1">
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium truncate">{item.shipName}</span>
                <span className="text-xs text-gray-500">
                  {item.duration} day{item.duration !== 1 ? 's' : ''}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 w-20">
                  {item.startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
                <div className="flex-1 bg-gray-200 rounded-full h-2 relative">
                  <div 
                    className={`h-2 rounded-full ${getStatusColor(item.status)}`}
                    style={{ width: '100%' }}
                  />
                </div>
                <span className="text-xs text-gray-500 w-20 text-right">
                  {item.endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
              </div>
            </div>
          ))}
        </div>
        
        {timelineData.length > 8 && (
          <div className="text-center text-sm text-gray-500 mt-4">
            Showing 8 of {timelineData.length} projects
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProjectTimeline;
