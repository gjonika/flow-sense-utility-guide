
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Clock } from 'lucide-react';
import { Survey } from '@/types/survey';

interface ChecklistProgressCardProps {
  surveys: Survey[];
}

const ChecklistProgressCard = ({ surveys }: ChecklistProgressCardProps) => {
  // Calculate average checklist completion across all surveys
  const calculateChecklistProgress = () => {
    if (surveys.length === 0) return 0;
    
    // For now, we'll use status as a proxy for completion
    // In a real implementation, you'd calculate based on actual checklist responses
    const completionScores = surveys.map(survey => {
      switch (survey.status) {
        case 'completed': return 100;
        case 'in-progress': return 60;
        case 'draft': return 10;
        default: return 0;
      }
    });
    
    const total = completionScores.reduce((sum, score) => sum + score, 0);
    return Math.round(total / surveys.length);
  };

  const averageProgress = calculateChecklistProgress();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Checklist Progress</CardTitle>
        <CheckCircle className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{averageProgress}%</div>
        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
            style={{ width: `${averageProgress}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Average across {surveys.length} surveys
        </p>
      </CardContent>
    </Card>
  );
};

export default ChecklistProgressCard;
