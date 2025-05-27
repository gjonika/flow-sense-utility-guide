
import React from 'react';
import { Survey } from '@/types/survey';
import SurveyDetails from './SurveyDetails';

interface SurveyDetailsWrapperProps {
  survey: Survey;
  onUpdate: (id: string, updates: Partial<Survey>) => Promise<Survey>;
  onBack: () => void;
}

const SurveyDetailsWrapper = ({ survey, onUpdate, onBack }: SurveyDetailsWrapperProps) => {
  return (
    <SurveyDetails
      survey={survey}
      onUpdate={onUpdate}
      onBack={onBack}
    />
  );
};

export default SurveyDetailsWrapper;
