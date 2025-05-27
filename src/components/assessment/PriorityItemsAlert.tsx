
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';
import { AssessmentItem } from '@/types/assessment';

interface PriorityItemsAlertProps {
  priorityItems: AssessmentItem[];
}

const PriorityItemsAlert = ({ priorityItems }: PriorityItemsAlertProps) => {
  if (priorityItems.length === 0) return null;

  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-800">
          <AlertTriangle className="h-5 w-5" />
          Priority Assessment Items
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-blue-800 mb-2">These items are critical for accurate cost estimation:</p>
        <ul className="space-y-2">
          {priorityItems.map(item => (
            <li key={item.id} className="flex items-start gap-2">
              <div className="h-4 w-4 rounded-full border-2 border-blue-600 mt-0.5 flex-shrink-0" />
              <span className="text-blue-800">{item.question}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default PriorityItemsAlert;
