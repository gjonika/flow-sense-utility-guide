
import { Survey } from '@/types/survey';
import { StoredSurvey } from '@/types/storage';

// Safe string includes check
export const safeIncludes = (str: string | undefined | null, searchStr: string): boolean => {
  if (!str || !searchStr) return false;
  return str.toLowerCase().includes(searchStr.toLowerCase());
};

// Safe optional chaining for toLowerCase
export const safeToLowerCase = (str: string | undefined | null): string => {
  return str?.toLowerCase() || '';
};

// Helper to generate duplicate key with better null handling
const generateDuplicateKey = (survey: Survey | StoredSurvey): string => {
  const shipName = safeToLowerCase(survey.ship_name) || 'unknown_ship';
  const clientName = safeToLowerCase(survey.client_name) || 'unknown_client';
  const date = survey.survey_date || 'unknown_date';
  return `${shipName}_${clientName}_${date}`;
};

// Enhanced deduplication that prioritizes synced surveys over local duplicates
export const deduplicateSurveys = (localSurveys: StoredSurvey[], remoteSurveys: Survey[]): (Survey | StoredSurvey)[] => {
  const surveyMap = new Map<string, Survey | StoredSurvey>();
  const seenKeys = new Set<string>();

  console.log(`[SurveyUtils] Starting deduplication: ${localSurveys.length} local, ${remoteSurveys.length} remote`);

  // First pass: add all remote surveys (they have priority)
  remoteSurveys.forEach(survey => {
    const dupKey = generateDuplicateKey(survey);
    surveyMap.set(survey.id, survey);
    seenKeys.add(dupKey);
    console.log(`[SurveyUtils] Added remote survey: ${survey.ship_name} (key: ${dupKey})`);
  });

  // Second pass: add local surveys, but check for duplicates
  localSurveys.forEach(survey => {
    const dupKey = generateDuplicateKey(survey);
    
    // If there's already a remote survey with same content, skip this local survey
    if (seenKeys.has(dupKey)) {
      console.log(`[SurveyUtils] Skipping local duplicate: ${survey.ship_name} (remote version exists)`);
      return;
    }

    // If this is a synced local survey (not local_only and doesn't need sync), it might be a duplicate
    if (!survey.local_only && !survey.needs_sync) {
      console.log(`[SurveyUtils] Skipping synced local survey: ${survey.ship_name}`);
      return;
    }

    // Add unique local survey
    surveyMap.set(survey.id, survey);
    seenKeys.add(dupKey);
    console.log(`[SurveyUtils] Added local survey: ${survey.ship_name} (key: ${dupKey})`);
  });

  // Convert to array and sort by created date
  const result = Array.from(surveyMap.values()).sort((a, b) => 
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  console.log(`[SurveyUtils] Deduplicated: ${localSurveys.length} local + ${remoteSurveys.length} remote = ${result.length} unique surveys`);
  return result;
};

// Check if a local survey might be a duplicate of a remote survey
export const isPotentialDuplicate = (localSurvey: StoredSurvey, remoteSurveys: Survey[]): boolean => {
  const localKey = generateDuplicateKey(localSurvey);
  
  return remoteSurveys.some(remote => {
    const remoteKey = generateDuplicateKey(remote);
    return localKey === remoteKey;
  });
};

// Validate survey data integrity
export const validateSurveyIntegrity = (survey: Survey | StoredSurvey): { isValid: boolean; issues: string[] } => {
  const issues: string[] = [];

  if (!survey.ship_name?.trim()) {
    issues.push('Missing ship name');
  }

  if (!survey.client_name?.trim()) {
    issues.push('Missing client name');
  }

  if (!survey.survey_date) {
    issues.push('Missing survey date');
  }

  if (!survey.status || !['draft', 'in-progress', 'completed'].includes(survey.status)) {
    issues.push('Invalid status');
  }

  if (!Array.isArray(survey.client_contacts)) {
    issues.push('Invalid client contacts structure');
  }

  return {
    isValid: issues.length === 0,
    issues
  };
};
