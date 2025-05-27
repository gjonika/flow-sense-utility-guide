import { ClientContact } from '@/types/survey';

export const defaultSurveyFormData = {
  client_name: "",
  client_country: "",
  client_contacts: [] as ClientContact[],
  ship_name: "",
  survey_location: "",
  survey_date: new Date().toISOString().split('T')[0],
  project_scope: "",
  duration: "",
  tools: [
    "Flashlight",
    "Measurement Tape", 
    "Laser Distance Meter",
    "Camera / Phone",
    "Notebook & Pen"
  ],
  custom_fields: {} as { [key: string]: string },
  flight_details: {},
  hotel_details: {},
  status: 'draft' as 'draft' | 'in-progress' | 'completed',
};

export const formValidationRules = {
  client_name: { required: true, minLength: 2 },
  client_country: { required: true, minLength: 2 },
  ship_name: { required: true, minLength: 2 },
  survey_location: { required: true, minLength: 2 },
  survey_date: { required: true },
  project_scope: { required: true, minLength: 10 },
  duration: { required: true, minLength: 2 },
};

export type SurveyFormData = typeof defaultSurveyFormData;
