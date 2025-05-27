
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Survey } from '@/types/survey';

interface PriorityReviewCardProps {
  surveys: Survey[];
}

const PriorityReviewCard = ({ surveys }: PriorityReviewCardProps) => {
  // Mock data for priority review items
  // In a real implementation, this would come from assessment items data
  const priorityStats = {
    confirmed: Math.floor(surveys.length * 0.3),
    needsAttention: Math.floor(surveys.length * 0.2),
    notApplicable: Math.floor(surveys.length * 0.4),
    pending: Math.floor(surveys.length * 0.1)
  };

  const total = Object.values(priorityStats).reduce((sum, count) => sum + count, 0);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Priority Review</CardTitle>
        <AlertTriangle className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{total}</div>
        <div className="space-y-2 mt-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1">
              <CheckCircle className="h-3 w-3 text-green-600" />
              <span>Confirmed</span>
            </div>
            <span className="font-medium">{priorityStats.confirmed}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1">
              <AlertTriangle className="h-3 w-3 text-red-600" />
              <span>Needs Attention</span>
            </div>
            <span className="font-medium">{priorityStats.needsAttention}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1">
              <XCircle className="h-3 w-3 text-gray-600" />
              <span>N/A</span>
            </div>
            <span className="font-medium">{priorityStats.notApplicable}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3 text-yellow-600" />
              <span>Pending</span>
            </div>
            <span className="font-medium">{priorityStats.pending}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PriorityReviewCard;
