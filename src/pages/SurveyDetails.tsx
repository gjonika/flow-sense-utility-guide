import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSurveys } from '@/hooks/useSurveys';
import SurveyDetailsWrapper from '@/components/SurveyDetailsWrapper';
import { DashboardLoadingState } from '@/components/LoadingState';
import { usePageTitle } from '@/hooks/usePageTitle';

const SurveyDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { surveys, loading, updateSurvey } = useSurveys();

  const survey = surveys.find(s => s.id === id);

  // Set dynamic page title based on survey
  usePageTitle({ 
    title: survey ? `${survey.ship_name} - ${survey.client_name}` : 'Survey Details'
  });

  if (loading) {
    return <DashboardLoadingState />;
  }

  if (!survey) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Survey not found</h2>
          <p className="text-gray-600 mb-4">The survey you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const handleUpdate = async (surveyId: string, updates: any) => {
    return await updateSurvey(surveyId, updates);
  };

  const handleBack = () => {
    navigate('/dashboard');
  };

  return (
    <SurveyDetailsWrapper
      survey={survey}
      onUpdate={handleUpdate}
      onBack={handleBack}
    />
  );
};

export default SurveyDetails;
