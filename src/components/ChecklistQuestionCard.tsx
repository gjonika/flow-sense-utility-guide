
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Minus, AlertTriangle } from 'lucide-react';
import { ChecklistQuestion } from '@/checklists/template';

interface ChecklistQuestionCardProps {
  question: ChecklistQuestion;
  onUpdate: (updates: Partial<ChecklistQuestion>) => void;
}

const ChecklistQuestionCard = ({ question, onUpdate }: ChecklistQuestionCardProps) => {
  const [showNotes, setShowNotes] = useState(!!question.note);

  const handleAnswerChange = (answer: 'yes' | 'no' | 'n/a') => {
    onUpdate({ answer });
  };

  const handleNoteChange = (note: string) => {
    onUpdate({ note });
  };

  const getAnswerColor = (answer: string) => {
    switch (answer) {
      case 'yes': return 'bg-green-100 text-green-800 border-green-200';
      case 'no': return 'bg-red-100 text-red-800 border-red-200';
      case 'n/a': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  const getAnswerIcon = (answer: string) => {
    switch (answer) {
      case 'yes': return <CheckCircle className="h-4 w-4" />;
      case 'no': return <XCircle className="h-4 w-4" />;
      case 'n/a': return <Minus className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  return (
    <Card className="border-l-4 border-l-blue-500">
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Question Header */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="font-medium text-gray-900">{question.question}</p>
              <div className="flex items-center gap-2 mt-2">
                {question.required && (
                  <Badge variant="destructive" className="text-xs">Required</Badge>
                )}
                {question.answer && (
                  <Badge className={`text-xs ${getAnswerColor(question.answer)}`}>
                    <div className="flex items-center gap-1">
                      {getAnswerIcon(question.answer)}
                      {question.answer.toUpperCase()}
                    </div>
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Answer Buttons */}
          <div className="flex gap-2">
            <Button
              variant={question.answer === 'yes' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleAnswerChange('yes')}
              className={question.answer === 'yes' ? 'bg-green-600 hover:bg-green-700' : ''}
            >
              <CheckCircle className="h-4 w-4 mr-1" />
              Yes
            </Button>
            <Button
              variant={question.answer === 'no' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleAnswerChange('no')}
              className={question.answer === 'no' ? 'bg-red-600 hover:bg-red-700' : ''}
            >
              <XCircle className="h-4 w-4 mr-1" />
              No
            </Button>
            <Button
              variant={question.answer === 'n/a' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleAnswerChange('n/a')}
              className={question.answer === 'n/a' ? 'bg-gray-600 hover:bg-gray-700' : ''}
            >
              <Minus className="h-4 w-4 mr-1" />
              N/A
            </Button>
          </div>

          {/* Notes Section */}
          <div className="space-y-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowNotes(!showNotes)}
              className="text-blue-600 hover:text-blue-700 p-0 h-auto font-normal"
            >
              {showNotes ? 'Hide' : 'Add'} Notes
            </Button>
            
            {showNotes && (
              <Textarea
                placeholder="Add notes, observations, or defect details..."
                value={question.note || ''}
                onChange={(e) => handleNoteChange(e.target.value)}
                rows={3}
                className="text-sm"
              />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChecklistQuestionCard;
