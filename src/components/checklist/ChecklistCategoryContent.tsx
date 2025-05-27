
import { CardContent } from '@/components/ui/card';
import { ChecklistQuestion as ChecklistQuestionType } from '@/types/checklist';
import ChecklistQuestion from '../ChecklistQuestion';

interface ChecklistCategoryContentProps {
  questions: ChecklistQuestionType[];
  surveyId: string;
  zoneId?: string;
  responses: Record<string, any>;
  onResponseSaved: (questionId: string, response: any) => void;
}

const ChecklistCategoryContent = ({
  questions,
  surveyId,
  zoneId,
  responses,
  onResponseSaved,
}: ChecklistCategoryContentProps) => {
  return (
    <CardContent className="pt-0">
      <div className="space-y-4">
        {questions.map((question) => (
          <ChecklistQuestion
            key={question.id}
            question={question}
            surveyId={surveyId}
            zoneId={zoneId}
            existingResponse={responses[question.id]}
            onResponseSaved={onResponseSaved}
          />
        ))}
      </div>
    </CardContent>
  );
};

export default ChecklistCategoryContent;
