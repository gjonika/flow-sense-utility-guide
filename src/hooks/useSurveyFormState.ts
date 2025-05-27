
import { useState } from 'react';
import { Survey, ClientContact, FlightDetails, HotelDetails } from '@/types/survey';

interface FormData {
  client_name: string;
  client_country: string;
  client_contacts: ClientContact[];
  ship_name: string;
  survey_location: string;
  survey_date: string;
  project_scope: string;
  duration: string; // Keep as string to match Survey type
  tools: string[];
  custom_fields: { [key: string]: string };
  flight_details: FlightDetails;
  hotel_details: HotelDetails;
  status: 'draft' | 'in-progress' | 'completed';
}

interface ValidationIssue {
  contactIndex: number;
  field: string;
  message: string;
}

interface UseSurveyFormStateProps {
  survey?: Survey;
}

export const useSurveyFormState = ({ survey }: UseSurveyFormStateProps) => {
  const [formData, setFormData] = useState<FormData>({
    client_name: survey?.client_name || '',
    client_country: survey?.client_country || '',
    client_contacts: survey?.client_contacts || [],
    ship_name: survey?.ship_name || '',
    survey_location: survey?.survey_location || '',
    survey_date: survey?.survey_date || '',
    project_scope: survey?.project_scope || '',
    duration: survey?.duration || '', // Keep as string
    tools: survey?.tools || [],
    custom_fields: survey?.custom_fields || {},
    flight_details: survey?.flight_details || {},
    hotel_details: survey?.hotel_details || {},
    status: survey?.status || 'draft', // Always ensure a valid status
  });

  const [saving, setSaving] = useState(false);
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [validationIssues, setValidationIssues] = useState<ValidationIssue[]>([]);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const updateFormData = (updates: Partial<FormData>) => {
    console.log('[useSurveyFormState] Updating form data:', updates);
    setFormData(prev => {
      const updated = { ...prev, ...updates };
      // Ensure status is always valid
      if (!updated.status || !['draft', 'in-progress', 'completed'].includes(updated.status)) {
        updated.status = 'draft';
      }
      console.log('[useSurveyFormState] Updated form data:', updated);
      return updated;
    });
  };

  const validateForm = (): ValidationIssue[] => {
    console.log('[useSurveyFormState] Validating form data:', formData);
    const issues: ValidationIssue[] = [];
    
    // Validate client contacts
    formData.client_contacts.forEach((contact, index) => {
      if (contact.name && contact.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email)) {
        issues.push({
          contactIndex: index,
          field: 'email',
          message: 'Invalid email format'
        });
      }
    });

    // Additional validation for required fields
    if (!formData.ship_name?.trim()) {
      console.log('[useSurveyFormState] Missing ship name');
    }
    
    if (!formData.survey_date?.trim()) {
      console.log('[useSurveyFormState] Missing survey date');
    }

    console.log('[useSurveyFormState] Validation issues found:', issues);
    return issues;
  };

  // Convert validation issues to string array for the modal
  const getValidationMessages = (): string[] => {
    return validationIssues.map(issue => 
      `Contact ${issue.contactIndex + 1} - ${issue.field}: ${issue.message}`
    );
  };

  const handleSubmit = async (
    onSubmit: (data: FormData) => Promise<void>
  ): Promise<boolean> => {
    console.log('[useSurveyFormState] Starting form submission with data:', formData);
    
    // Ensure status is valid before submission
    const dataToSubmit = {
      ...formData,
      status: formData.status || 'draft'
    } as FormData;
    
    console.log('[useSurveyFormState] Data being submitted:', dataToSubmit);
    
    const issues = validateForm();
    
    if (issues.length > 0) {
      console.log('[useSurveyFormState] Validation failed, showing modal');
      setValidationIssues(issues);
      setShowValidationModal(true);
      return false;
    }

    try {
      setSaving(true);
      setSubmitSuccess(false);
      console.log('[useSurveyFormState] Submitting form data:', dataToSubmit);
      
      await onSubmit(dataToSubmit);
      
      console.log('[useSurveyFormState] Form submission successful');
      setSubmitSuccess(true);
      return true;
    } catch (error) {
      console.error('[useSurveyFormState] Form submission failed:', error);
      setSubmitSuccess(false);
      throw error;
    } finally {
      setSaving(false);
    }
  };

  const proceedWithSubmit = async (
    onSubmit: (data: FormData) => Promise<void>
  ) => {
    try {
      setSaving(true);
      setSubmitSuccess(false);
      console.log('[useSurveyFormState] Proceeding with submit after validation warning');
      
      const dataToSubmit = {
        ...formData,
        status: formData.status || 'draft'
      } as FormData;
      
      console.log('[useSurveyFormState] Final data being submitted:', dataToSubmit);
      await onSubmit(dataToSubmit);
      console.log('[useSurveyFormState] Proceed with submit successful');
      setSubmitSuccess(true);
      setShowValidationModal(false);
    } catch (error) {
      console.error('[useSurveyFormState] Form submission failed:', error);
      setSubmitSuccess(false);
      throw error;
    } finally {
      setSaving(false);
    }
  };

  return {
    formData,
    updateFormData,
    saving,
    submitSuccess,
    showValidationModal,
    setShowValidationModal,
    validationIssues,
    validationMessages: getValidationMessages(),
    handleSubmit,
    proceedWithSubmit,
  };
};
