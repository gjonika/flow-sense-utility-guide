
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { ChecklistQuestion as ChecklistQuestionType } from '@/types/checklist';
import ChecklistCategoryHeader from './ChecklistCategoryHeader';
import ChecklistCategoryContent from './ChecklistCategoryContent';

interface ChecklistCategoryProps {
  category: string;
  questions: ChecklistQuestionType[];
  surveyId: string;
  zoneId?: string;
  responses: Record<string, any>;
  onResponseSaved: (questionId: string, response: any) => void;
}

const ChecklistCategory = ({
  category,
  questions,
  surveyId,
  zoneId,
  responses,
  onResponseSaved,
}: ChecklistCategoryProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
  
  const categoryResponses = questions.filter(q => responses[q.id]).length;
  const hasMandatoryItems = questions.some(q => q.mandatory);

  return (
    <Card>
      <ChecklistCategoryHeader
        category={category}
        isExpanded={isExpanded}
        categoryResponses={categoryResponses}
        totalQuestions={questions.length}
        hasMandatoryItems={hasMandatoryItems}
        onToggle={() => setIsExpanded(!isExpanded)}
      />
      
      {isExpanded && (
        <ChecklistCategoryContent
          questions={questions}
          surveyId={surveyId}
          zoneId={zoneId}
          responses={responses}
          onResponseSaved={onResponseSaved}
        />
      )}
    </Card>
  );
};

export default ChecklistCategory;
