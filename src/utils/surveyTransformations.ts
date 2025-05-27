
import { Survey, ClientContact, FlightDetails, HotelDetails } from '@/types/survey';

export const transformSupabaseSurveyToSurvey = (supabaseData: any): Survey => {
  return {
    id: supabaseData.id,
    user_id: supabaseData.user_id,
    client_name: supabaseData.client_name,
    client_country: supabaseData.client_country,
    client_contacts: (supabaseData.client_contacts as ClientContact[]) || [],
    ship_name: supabaseData.ship_name,
    survey_location: supabaseData.survey_location,
    survey_date: supabaseData.survey_date,
    project_scope: supabaseData.project_scope,
    duration: supabaseData.duration,
    tools: supabaseData.tools || [],
    custom_fields: (supabaseData.custom_fields as { [key: string]: string }) || {},
    flight_details: (supabaseData.flight_details as FlightDetails) || {},
    hotel_details: (supabaseData.hotel_details as HotelDetails) || {},
    status: supabaseData.status as 'draft' | 'in-progress' | 'completed',
    created_at: supabaseData.created_at,
    updated_at: supabaseData.updated_at,
    last_synced_at: supabaseData.last_synced_at || supabaseData.updated_at,
    needs_sync: false,
  };
};

export const transformSurveyToSupabaseData = (surveyData: Omit<Survey, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'last_synced_at' | 'needs_sync'>) => {
  return {
    client_name: surveyData.client_name,
    client_country: surveyData.client_country,
    client_contacts: surveyData.client_contacts as any,
    ship_name: surveyData.ship_name,
    survey_location: surveyData.survey_location,
    survey_date: surveyData.survey_date,
    project_scope: surveyData.project_scope,
    duration: surveyData.duration,
    tools: surveyData.tools,
    custom_fields: surveyData.custom_fields as any,
    flight_details: surveyData.flight_details as any,
    hotel_details: surveyData.hotel_details as any,
    status: surveyData.status,
  };
};
