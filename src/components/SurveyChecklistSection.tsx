
import { useState, useEffect } from 'react';
import { DEFAULT_COMPLIANCE_CHECKLIST, ChecklistQuestion as TemplateQuestion } from '@/checklists/template';
import { ChecklistQuestion, ChecklistResponse } from '@/types/checklist';
import { useChecklistResponses } from '@/hooks/useChecklistResponses';
import ChecklistConnectionStatus from './checklist/ChecklistConnectionStatus';
import ChecklistEmptyState from './checklist/ChecklistEmptyState';
import ChecklistProgressCard from './checklist/ChecklistProgressCard';
import ChecklistQuestionsByCategory from './checklist/ChecklistQuestionsByCategory';

interface SurveyChecklistSectionProps {
  surveyId: string;
  zoneId?: string;
  checklist?: ChecklistQuestion[];
  onChecklistUpdate?: (checklist: ChecklistQuestion[]) => void;
}

// Helper function to convert template questions to checklist questions
const convertTemplateToChecklist = (templateQuestions: TemplateQuestion[]): ChecklistQuestion[] => {
  return templateQuestions.map(q => ({
    id: q.id,
    category: q.category,
    text: q.question,
    mandatory: q.required,
    subcategory: undefined
  }));
};

const SurveyChecklistSection = ({ 
  surveyId, 
  zoneId, 
  checklist = [], 
  onChecklistUpdate 
}: SurveyChecklistSectionProps) => {
  const [questions, setQuestions] = useState<ChecklistQuestion[]>(checklist);
  const [responses, setResponses] = useState<Record<string, ChecklistResponse>>({});
  const [isOnline] = useState(navigator.onLine);
  const [loading, setLoading] = useState(false);
  const [loadingResponses, setLoadingResponses] = useState(true);

  const { getResponsesForSurvey } = useChecklistResponses();

  // Initialize checklist if empty
  useEffect(() => {
    if (checklist.length === 0 && questions.length === 0) {
      const convertedQuestions = convertTemplateToChecklist(DEFAULT_COMPLIANCE_CHECKLIST);
      setQuestions(convertedQuestions);
      if (onChecklistUpdate) {
        onChecklistUpdate(convertedQuestions);
      }
    } else if (checklist.length > 0) {
      setQuestions(checklist);
    }
  }, [checklist, onChecklistUpdate]);

  // Load existing responses
  useEffect(() => {
    const loadResponses = async () => {
      if (!surveyId) return;
      
      setLoadingResponses(true);
      try {
        console.log('[SurveyChecklistSection] Loading responses for survey:', surveyId);
        const existingResponses = await getResponsesForSurvey(surveyId);
        
        // Convert array to object keyed by question_id
        const responsesMap: Record<string, ChecklistResponse> = {};
        existingResponses.forEach(response => {
          responsesMap[response.question_id] = response;
        });
        
        console.log('[SurveyChecklistSection] Loaded responses:', responsesMap);
        setResponses(responsesMap);
      } catch (error) {
        console.error('[SurveyChecklistSection] Failed to load responses:', error);
      } finally {
        setLoadingResponses(false);
      }
    };

    loadResponses();
  }, [surveyId, getResponsesForSurvey]);

  const loadDefaultChecklist = () => {
    setLoading(true);
    setTimeout(() => {
      const convertedQuestions = convertTemplateToChecklist(DEFAULT_COMPLIANCE_CHECKLIST);
      setQuestions(convertedQuestions);
      if (onChecklistUpdate) {
        onChecklistUpdate(convertedQuestions);
      }
      setLoading(false);
    }, 100);
  };

  const handleQuestionUpdate = (questionId: string, updates: Partial<ChecklistQuestion>) => {
    const updatedQuestions = questions.map(q => 
      q.id === questionId ? { ...q, ...updates } : q
    );
    setQuestions(updatedQuestions);
    if (onChecklistUpdate) {
      onChecklistUpdate(updatedQuestions);
    }
  };

  const handleResponseSaved = (questionId: string, response: ChecklistResponse) => {
    console.log('[SurveyChecklistSection] Response saved:', questionId, response);
    setResponses(prev => ({
      ...prev,
      [questionId]: response
    }));
  };

  if (questions.length === 0) {
    return (
      <ChecklistEmptyState
        loading={loading}
        onLoadDefaultChecklist={loadDefaultChecklist}
      />
    );
  }

  if (loadingResponses) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Loading checklist responses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ChecklistConnectionStatus isOnline={isOnline} />
      
      <ChecklistProgressCard
        questions={questions}
        responses={responses}
        loading={loading}
        onReset={loadDefaultChecklist}
      />

      <ChecklistQuestionsByCategory
        questions={questions}
        surveyId={surveyId}
        zoneId={zoneId}
        responses={responses}
        onResponseSaved={handleResponseSaved}
      />
    </div>
  );
};

export default SurveyChecklistSection;
