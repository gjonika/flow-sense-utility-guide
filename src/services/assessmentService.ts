
import { AssessmentItem } from '@/types/assessment';

// Mock assessment service for now - can be replaced with real API calls later
export const assessmentService = {
  async fetchAssessmentItems(surveyId: string): Promise<AssessmentItem[]> {
    // Return empty array for now - this can be connected to real data later
    return [];
  },

  async saveAssessmentItems(surveyId: string, items: AssessmentItem[]): Promise<void> {
    // Mock save operation
    console.log('Saving assessment items for survey:', surveyId, items);
  }
};
