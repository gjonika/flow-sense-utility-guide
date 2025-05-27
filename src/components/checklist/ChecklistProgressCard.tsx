
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { ChecklistQuestion } from '@/types/checklist';
import { ChecklistResponse } from '@/types/checklist';

interface ChecklistProgressCardProps {
  questions: ChecklistQuestion[];
  responses?: Record<string, ChecklistResponse>;
  loading: boolean;
  onReset: () => void;
}

const ChecklistProgressCard = ({ questions, responses = {}, loading, onReset }: ChecklistProgressCardProps) => {
  const totalQuestions = questions.length;
  const answeredQuestions = Object.keys(responses).length;
  const progressPercentage = totalQuestions > 0 ? Math.round((answeredQuestions / totalQuestions) * 100) : 0;

  // Count response types
  const responseCounts = Object.values(responses).reduce(
    (acc, response) => {
      acc[response.response_type] = (acc[response.response_type] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const yesCount = responseCounts.yes || 0;
  const noCount = responseCounts.no || 0;
  const naCount = responseCounts.na || 0;
  const skippedCount = responseCounts.skipped || 0;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-semibold">Checklist Progress</CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={onReset}
          disabled={loading}
          className="h-8"
        >
          <RefreshCw className={`h-4 w-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
          Reset
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{answeredQuestions}/{totalQuestions} ({progressPercentage}%)</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          {/* Response Summary */}
          {answeredQuestions > 0 && (
            <div className="flex flex-wrap gap-2">
              {yesCount > 0 && (
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  {yesCount} Yes
                </Badge>
              )}
              {noCount > 0 && (
                <Badge variant="secondary" className="bg-red-100 text-red-800">
                  <XCircle className="h-3 w-3 mr-1" />
                  {noCount} No
                </Badge>
              )}
              {naCount > 0 && (
                <Badge variant="secondary" className="bg-gray-100 text-gray-800">
                  {naCount} N/A
                </Badge>
              )}
              {skippedCount > 0 && (
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  {skippedCount} Skipped
                </Badge>
              )}
            </div>
          )}

          {/* Completion Status */}
          {progressPercentage === 100 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                <span className="text-green-800 font-medium">Checklist completed!</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ChecklistProgressCard;
