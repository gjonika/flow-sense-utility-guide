import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import SurveyForm from '@/components/SurveyForm';
import { useSurveys } from '@/hooks/useSurveys';
import { Survey } from '@/types/survey';
import { DashboardLoadingState } from '@/components/LoadingState';
import { useToast } from '@/hooks/use-toast';
import { usePageTitle } from '@/hooks/usePageTitle';

const NewSurvey = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { surveys, loading, createSurvey, updateSurvey, isOnline } = useSurveys();
  const { toast } = useToast();

  // If editing, find the survey
  const surveyToEdit = id ? surveys.find(s => s.id === id) : undefined;

  // Set dynamic page title
  usePageTitle({ 
    title: surveyToEdit ? `Edit ${surveyToEdit.ship_name}` : 'New Survey Project'
  });

  if (loading && id) {
    return <DashboardLoadingState />;
  }

  const handleSubmit = async (surveyData: Omit<Survey, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'last_synced_at' | 'needs_sync'>) => {
    try {
      console.log('[NewSurvey] Handling submit:', { id, isEdit: !!surveyToEdit, surveyData });
      
      if (id && surveyToEdit) {
        // Editing existing survey
        console.log('[NewSurvey] Updating existing survey:', id);
        await updateSurvey(id, surveyData);
        console.log('[NewSurvey] Survey updated successfully');
      } else {
        // Creating new survey
        console.log('[NewSurvey] Creating new survey');
        await createSurvey(surveyData);
        console.log('[NewSurvey] Survey created successfully');
      }
      
      // Navigate after successful submission
      console.log('[NewSurvey] Navigating to dashboard');
      navigate('/dashboard');
    } catch (error) {
      console.error('[NewSurvey] Failed to save survey:', error);
      
      // Show error toast
      toast({
        title: "Save Failed",
        description: error instanceof Error ? error.message : "Failed to save survey. Please try again.",
        variant: "destructive",
      });
      
      // Re-throw to let the form handle the error state
      throw error;
    }
  };

  const handleCancel = () => {
    navigate('/dashboard');
  };

  if (id && !surveyToEdit) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Survey not found</h2>
          <p className="text-gray-600 mb-4">The survey you're trying to edit doesn't exist.</p>
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

  return (
    <SurveyForm
      survey={surveyToEdit}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      isOnline={isOnline}
    />
  );
};

export default NewSurvey;
