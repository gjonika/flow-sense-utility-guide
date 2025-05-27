
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ChecklistQuestion as Question, ChecklistResponse } from '@/types/checklist';
import { getChecklistByCategory } from '@/checklists/template';
import ChecklistQuestion from '../ChecklistQuestion';

interface ChecklistQuestionsByCategoryProps {
  questions: Question[];
  surveyId: string;
  zoneId?: string;
  responses: Record<string, ChecklistResponse>;
  onResponseSaved: (questionId: string, response: ChecklistResponse) => void;
}

const ChecklistQuestionsByCategory = ({ 
  questions, 
  surveyId, 
  zoneId, 
  responses,
  onResponseSaved 
}: ChecklistQuestionsByCategoryProps) => {
  const questionsByCategory = getChecklistByCategory();
  const categoriesWithData = Object.keys(questionsByCategory);

  return (
    <div className="space-y-4">
      <Accordion type="multiple" className="space-y-4">
        {categoriesWithData.map((category) => {
          const categoryQuestions = questions.filter(q => q.category === category);
          if (categoryQuestions.length === 0) return null;

          const answeredCount = categoryQuestions.filter(q => responses[q.id]).length;

          return (
            <AccordionItem key={category} value={category} className="border rounded-lg bg-white">
              <AccordionTrigger className="px-6 py-4 hover:no-underline">
                <div className="flex items-center justify-between w-full mr-4">
                  <h3 className="text-lg font-semibold text-blue-700">{category}</h3>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-500">
                      {answeredCount}/{categoryQuestions.length} answered
                    </span>
                    {answeredCount === categoryQuestions.length && (
                      <span className="text-green-600 text-sm font-medium">Complete</span>
                    )}
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6">
                <div className="space-y-4">
                  {categoryQuestions.map((question) => (
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
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
};

export default ChecklistQuestionsByCategory;
