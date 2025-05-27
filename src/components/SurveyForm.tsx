
import { Survey } from "@/types/survey";
import { ContactValidationModal } from "./SurveyFormValidation";
import { useSurveyFormState } from "@/hooks/useSurveyFormState";
import SurveyFormHeader from "./survey-form/SurveyFormHeader";
import ClientInformationSection from "./survey-form/ClientInformationSection";
import SurveyDetailsSection from "./survey-form/SurveyDetailsSection";
import EnhancedToolsForm from "./EnhancedToolsForm";
import CustomFieldsForm from "./CustomFieldsForm";
import SurveyFormActions from "./survey-form/SurveyFormActions";
import { useEffect } from "react";

interface SurveyFormProps {
  survey?: Survey;
  onSubmit: (survey: Omit<Survey, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'last_synced_at' | 'needs_sync'>) => Promise<void>;
  onCancel: () => void;
  isOnline?: boolean;
}

const SurveyForm = ({ survey, onSubmit, onCancel, isOnline = true }: SurveyFormProps) => {
  const {
    formData,
    updateFormData,
    saving,
    submitSuccess,
    showValidationModal,
    setShowValidationModal,
    validationMessages,
    handleSubmit,
    proceedWithSubmit,
  } = useSurveyFormState({ survey });

  // Handle successful submission - this will trigger navigation in parent component
  useEffect(() => {
    if (submitSuccess) {
      console.log('[SurveyForm] Submission successful, form will close');
    }
  }, [submitSuccess]);

  const onFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log('[SurveyForm] Form submit triggered');
      const success = await handleSubmit(onSubmit);
      console.log('[SurveyForm] Form submit result:', success);
    } catch (error) {
      console.error('[SurveyForm] Form submission error:', error);
    }
  };

  const handleKamChange = (value: string) => {
    updateFormData({ 
      custom_fields: { 
        ...formData.custom_fields, 
        kam: value 
      } 
    });
  };

  const handleProjectNumberChange = (value: string) => {
    updateFormData({ 
      custom_fields: { 
        ...formData.custom_fields, 
        project_number: value 
      } 
    });
  };

  const handleSurveyorsChange = (surveyors: string[]) => {
    updateFormData({ 
      custom_fields: { 
        ...formData.custom_fields, 
        surveyors: JSON.stringify(surveyors)
      } 
    });
  };

  const getSurveyors = () => {
    try {
      return formData.custom_fields?.surveyors ? JSON.parse(formData.custom_fields.surveyors) : [];
    } catch {
      return [];
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SurveyFormHeader 
        isEdit={!!survey}
        onCancel={onCancel}
        isOnline={isOnline}
      />

      <div className="container mx-auto px-4 sm:px-6 py-6">
        <form onSubmit={onFormSubmit} className="space-y-4 sm:space-y-6">
          <ClientInformationSection
            clientName={formData.client_name}
            clientCountry={formData.client_country}
            clientContacts={formData.client_contacts}
            onClientNameChange={(value) => updateFormData({ client_name: value })}
            onClientCountryChange={(value) => updateFormData({ client_country: value })}
            onClientContactsChange={(contacts) => updateFormData({ client_contacts: contacts })}
          />

          <SurveyDetailsSection
            shipName={formData.ship_name}
            surveyLocation={formData.survey_location}
            surveyDate={formData.survey_date}
            duration={formData.duration}
            projectScope={formData.project_scope}
            kam={formData.custom_fields.kam || ''}
            projectNumber={formData.custom_fields.project_number || ''}
            surveyors={getSurveyors()}
            onShipNameChange={(value) => updateFormData({ ship_name: value })}
            onSurveyLocationChange={(value) => updateFormData({ survey_location: value })}
            onSurveyDateChange={(value) => updateFormData({ survey_date: value })}
            onDurationChange={(value) => updateFormData({ duration: value })}
            onProjectScopeChange={(value) => updateFormData({ project_scope: value })}
            onKamChange={handleKamChange}
            onProjectNumberChange={handleProjectNumberChange}
            onSurveyorsChange={handleSurveyorsChange}
          />

          <EnhancedToolsForm
            tools={formData.tools}
            onChange={(tools) => updateFormData({ tools })}
          />

          <CustomFieldsForm
            customFields={formData.custom_fields}
            onChange={(custom_fields) => updateFormData({ custom_fields })}
          />

          <SurveyFormActions
            isEdit={!!survey}
            saving={saving}
            isOnline={isOnline}
            onCancel={onCancel}
          />
        </form>

        <ContactValidationModal
          isOpen={showValidationModal}
          onConfirm={() => proceedWithSubmit(onSubmit)}
          onCancel={() => setShowValidationModal(false)}
          missingContacts={validationMessages}
        />
      </div>
    </div>
  );
};

export default SurveyForm;
