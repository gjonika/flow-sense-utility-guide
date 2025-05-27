
import { Badge } from '@/components/ui/badge';
import { AlertTriangle } from 'lucide-react';
import { ChecklistQuestion } from '@/types/checklist';

interface ChecklistQuestionHeaderProps {
  question: ChecklistQuestion;
}

const ChecklistQuestionHeader = ({ question }: ChecklistQuestionHeaderProps) => {
  return (
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <h4 className="font-medium text-gray-900">{question.text}</h4>
          {question.mandatory && (
            <Badge variant="destructive" className="text-xs">
              <AlertTriangle className="h-3 w-3 mr-1" />
              Mandatory
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Badge variant="outline">{question.category}</Badge>
          {question.subcategory && (
            <Badge variant="outline" className="bg-blue-50">
              {question.subcategory}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChecklistQuestionHeader;
