
import { Survey, ClientContact, FlightDetails, HotelDetails } from './survey';
import { ChecklistResponse } from './checklist';

export interface CompleteSurveyData {
  // Core survey data
  client_name: string;
  client_country: string;
  client_contacts: ClientContact[];
  ship_name: string;
  survey_location: string;
  survey_date: string;
  project_scope: string;
  duration: string;
  tools: string[];
  custom_fields: { 
    [key: string]: string;
    kam?: string;
    project_number?: string;
  };
  flight_details: FlightDetails;
  hotel_details: HotelDetails;
  status: 'draft' | 'in-progress' | 'completed';
  
  // Extended data
  checklist_responses?: ChecklistResponse[];
  notes?: { [zoneId: string]: string };
  media_files?: any[];
}

export interface StoredSurvey extends CompleteSurveyData {
  id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  last_synced_at: string;
  needs_sync: boolean;
  local_only: boolean;
}
