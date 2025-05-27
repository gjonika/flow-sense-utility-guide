
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Camera, CheckCircle, AlertTriangle, FileText } from 'lucide-react';
import { Survey } from '@/types/survey';

interface ProjectInsightsProps {
  survey: Survey;
}

const ProjectInsights = ({ survey }: ProjectInsightsProps) => {
  // Mock data for insights - in real implementation, these would come from actual survey data
  const getChecklistProgress = () => {
    switch (survey.status) {
      case 'completed': return 100;
      case 'in-progress': return 65;
      case 'draft': return 15;
      default: return 0;
    }
  };

  const getEstimatorProgress = () => {
    // Mock: based on status
    const total = 22;
    const filled = survey.status === 'completed' ? 22 : 
                  survey.status === 'in-progress' ? 12 : 3;
    return { filled, total };
  };

  const getMediaCount = () => {
    // Mock: based on status
    switch (survey.status) {
      case 'completed': return Math.floor(Math.random() * 15) + 10;
      case 'in-progress': return Math.floor(Math.random() * 8) + 3;
      case 'draft': return Math.floor(Math.random() * 3);
      default: return 0;
    }
  };

  const getPriorityItems = () => {
    // Mock priority items based on survey status
    if (survey.status === 'completed') {
      return { confirmed: 8, needsAttention: 2 };
    } else if (survey.status === 'in-progress') {
      return { confirmed: 4, needsAttention: 3 };
    }
    return { confirmed: 0, needsAttention: 1 };
  };

  const checklistProgress = getChecklistProgress();
  const estimatorData = getEstimatorProgress();
  const mediaCount = getMediaCount();
  const priorityItems = getPriorityItems();

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 50) return 'bg-blue-500';
    if (progress >= 20) return 'bg-yellow-500';
    return 'bg-gray-400';
  };

  return (
    <div className="space-y-3 mt-3 p-3 bg-gray-50 rounded-lg">
      {/* Checklist Progress */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm">
          <CheckCircle className="h-4 w-4 text-blue-600" />
          <span className="font-medium">Checklist</span>
        </div>
        <div className="flex items-center gap-2 flex-1 max-w-24">
          <Progress 
            value={checklistProgress} 
            className={`h-2 ${getProgressColor(checklistProgress)}`}
          />
          <span className="text-xs text-gray-600 min-w-8">{checklistProgress}%</span>
        </div>
      </div>

      {/* Estimator Progress */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm">
          <FileText className="h-4 w-4 text-green-600" />
          <span className="font-medium">Estimator</span>
        </div>
        <span className="text-sm text-gray-700">
          {estimatorData.filled}/{estimatorData.total}
        </span>
      </div>

      {/* Media Files */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm">
          <Camera className="h-4 w-4 text-purple-600" />
          <span className="font-medium">Media</span>
        </div>
        <span className="text-sm text-gray-700">{mediaCount} files</span>
      </div>

      {/* Priority Items */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm">
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          <span className="font-medium">Priority</span>
        </div>
        <div className="flex gap-1">
          {priorityItems.confirmed > 0 && (
            <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
              ✓ {priorityItems.confirmed}
            </Badge>
          )}
          {priorityItems.needsAttention > 0 && (
            <Badge variant="outline" className="text-xs bg-red-50 text-red-700 border-red-200">
              ! {priorityItems.needsAttention}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectInsights;
