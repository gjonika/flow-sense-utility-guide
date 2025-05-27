
import { AssessmentItem } from '@/types/assessment';
import { SurveyZone, SurveyNote, Survey } from '@/types/survey';

export interface SurveyReportData {
  survey: Survey;
  zones: SurveyZone[];
  notes: SurveyNote[];
  assessmentItems: AssessmentItem[];
}

export interface HierarchicalZones {
  [deck: string]: {
    [zoneType: string]: SurveyZone[];
  };
}
