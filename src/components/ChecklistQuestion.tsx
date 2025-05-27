
import { Card, CardContent } from '@/components/ui/card';
import { ChecklistQuestion as Question, ChecklistResponse } from '@/types/checklist';
import { useChecklistQuestionLogic } from '@/hooks/useChecklistQuestionLogic';
import ChecklistQuestionHeader from './checklist/ChecklistQuestionHeader';
import ChecklistResponseButtons from './checklist/ChecklistResponseButtons';
import ChecklistSkipConfirmation from './checklist/ChecklistSkipConfirmation';
import ChecklistAdditionalDetails from './checklist/ChecklistAdditionalDetails';

interface ChecklistQuestionProps {
  question: Question;
  surveyId: string;
  zoneId?: string;
  existingResponse?: ChecklistResponse;
  onResponseSaved: (questionId: string, response: ChecklistResponse) => void;
}

const ChecklistQuestion = ({ 
  question, 
  surveyId, 
  zoneId, 
  existingResponse,
  onResponseSaved 
}: ChecklistQuestionProps) => {
  const {
    selectedResponse,
    notes,
    assetTag,
    qrCode,
    rfidTag,
    showSkipConfirm,
    attachingMedia,
    setNotes,
    setAssetTag,
    setQrCode,
    setRfidTag,
    setShowSkipConfirm,
    handleResponseSelect,
    handleCameraCapture,
    handleFileSelect,
  } = useChecklistQuestionLogic({
    surveyId,
    questionId: question.id,
    questionCategory: question.category,
    questionText: question.text,
    isMandatory: question.mandatory,
    zoneId,
    existingResponse,
    onResponseSaved,
  });

  const getResponseColor = (type: string) => {
    switch (type) {
      case 'yes': return 'bg-green-100 border-green-500';
      case 'no': return 'bg-red-100 border-red-500';
      case 'na': return 'bg-gray-100 border-gray-500';
      case 'skipped': return 'bg-yellow-100 border-yellow-500';
      default: return 'bg-white border-gray-200';
    }
  };

  return (
    <Card className={`mb-4 ${getResponseColor(selectedResponse || '')} transition-all duration-200`}>
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Question Header */}
          <ChecklistQuestionHeader question={question} />

          {/* Response Buttons */}
          <ChecklistResponseButtons
            selectedResponse={selectedResponse}
            onResponseSelect={handleResponseSelect}
          />

          {/* Skip Confirmation for Mandatory Questions */}
          {showSkipConfirm && (
            <ChecklistSkipConfirmation
              onCancel={() => setShowSkipConfirm(false)}
              onConfirm={() => handleResponseSelect('skipped')}
            />
          )}

          {/* Additional Details */}
          {selectedResponse && (
            <ChecklistAdditionalDetails
              notes={notes}
              assetTag={assetTag}
              qrCode={qrCode}
              rfidTag={rfidTag}
              attachingMedia={attachingMedia}
              onNotesChange={setNotes}
              onAssetTagChange={setAssetTag}
              onQrCodeChange={setQrCode}
              onRfidTagChange={setRfidTag}
              onCameraCapture={handleCameraCapture}
              onFileSelect={handleFileSelect}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ChecklistQuestion;
