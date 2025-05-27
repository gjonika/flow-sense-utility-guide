
import { useState, useEffect, useCallback } from 'react';
import { Survey } from '@/types/survey';
import { useOnlineStatus } from './useOnlineStatus';
import { useRemoteSurveys } from './useRemoteSurveys';
import { useToast } from '@/hooks/use-toast';
import { validationService } from '@/services/validationService';
import { surveyStorageService } from '@/services/surveyStorageService';

export const useSurveys = () => {
  const [loading, setLoading] = useState(true);
  const isOnline = useOnlineStatus();
  const { remoteSurveys, fetchRemoteSurveys, saveOnline } = useRemoteSurveys(isOnline);
  const { toast } = useToast();

  // In online-only mode, all surveys are remote surveys
  const surveys = useCallback(() => {
    return remoteSurveys;
  }, [remoteSurveys]);

  // Refresh all surveys
  const refreshSurveys = useCallback(async () => {
    console.log('[useSurveys] Refreshing surveys from online storage...');
    setLoading(true);
    try {
      await fetchRemoteSurveys();
    } finally {
      setLoading(false);
    }
  }, [fetchRemoteSurveys]);

  useEffect(() => {
    fetchRemoteSurveys().finally(() => setLoading(false));
  }, [fetchRemoteSurveys]);

  const createSurvey = useCallback(async (surveyData: Omit<Survey, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'last_synced_at' | 'needs_sync'>) => {
    try {
      console.log('[useSurveys] Creating survey online');
      
      if (!isOnline) {
        throw new Error('Cannot create survey while offline. Please check your internet connection.');
      }
      
      // Validate survey data before saving
      const validation = validationService.validateSurveyStructure(surveyData as Survey);
      if (!validation.isValid) {
        throw new Error(`Survey validation failed: ${validation.errors.join(', ')}`);
      }

      // Repair if needed
      const cleanedData = validation.requiresRepair 
        ? validationService.repairSurveyStructure(surveyData as Survey)
        : surveyData;
      
      const survey = await saveOnline(cleanedData);
      await fetchRemoteSurveys();
      toast({
        title: "Survey Created",
        description: "Survey saved successfully",
      });
      return survey;
    } catch (error) {
      console.error('[useSurveys] Failed to create survey:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create survey. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  }, [isOnline, saveOnline, fetchRemoteSurveys, toast]);

  const updateSurvey = useCallback(async (surveyId: string, surveyData: Omit<Survey, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'last_synced_at' | 'needs_sync'>) => {
    try {
      console.log('[useSurveys] Updating survey online:', surveyId);
      
      if (!isOnline) {
        throw new Error('Cannot update survey while offline. Please check your internet connection.');
      }
      
      // Validate survey data before saving
      const validation = validationService.validateSurveyStructure(surveyData as Survey);
      if (!validation.isValid) {
        throw new Error(`Survey validation failed: ${validation.errors.join(', ')}`);
      }

      // Repair if needed
      const cleanedData = validation.requiresRepair 
        ? validationService.repairSurveyStructure(surveyData as Survey)
        : surveyData;
      
      const survey = await saveOnline(cleanedData, surveyId);
      await fetchRemoteSurveys();
      toast({
        title: "Survey Updated",
        description: "Survey updated successfully",
      });
      return survey;
    } catch (error) {
      console.error('[useSurveys] Failed to update survey:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update survey. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  }, [isOnline, saveOnline, fetchRemoteSurveys, toast]);

  // New method specifically for updating survey status
  const updateSurveyStatus = useCallback(async (surveyId: string, status: Survey['status']) => {
    try {
      console.log('[useSurveys] Updating survey status:', surveyId, status);
      
      if (!isOnline) {
        throw new Error('Cannot update survey while offline. Please check your internet connection.');
      }
      
      // Only validate the status field - using the correct method name
      const validation = validationService.validateForStatusUpdate({ status } as Survey);
      if (!validation.isValid) {
        throw new Error(`Status validation failed: ${validation.errors.join(', ')}`);
      }
      
      // Use the direct status update method from surveyStorageService
      const survey = await surveyStorageService.updateStatus(surveyId, status);
      await fetchRemoteSurveys();
      toast({
        title: "Status Updated",
        description: `Survey status changed to ${status.replace('-', ' ')}`,
      });
      return survey;
    } catch (error) {
      console.error('[useSurveys] Failed to update survey status:', error);
      toast({
        title: "Update Failed",
        description: error instanceof Error ? error.message : "Failed to update survey status. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  }, [isOnline, fetchRemoteSurveys, toast]);

  // Delete survey method
  const deleteSurvey = useCallback(async (surveyId: string) => {
    try {
      console.log('[useSurveys] Deleting survey:', surveyId);
      
      if (!isOnline) {
        throw new Error('Cannot delete survey while offline. Please check your internet connection.');
      }
      
      await surveyStorageService.deleteSurvey(surveyId);
      await fetchRemoteSurveys();
      toast({
        title: "Survey Deleted",
        description: "Survey deleted successfully",
      });
    } catch (error) {
      console.error('[useSurveys] Failed to delete survey:', error);
      toast({
        title: "Delete Failed",
        description: error instanceof Error ? error.message : "Failed to delete survey. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  }, [isOnline, fetchRemoteSurveys, toast]);

  // Sync pending surveys method (no-op in online-only mode)
  const syncPendingSurveys = useCallback(async () => {
    console.log('[useSurveys] No pending surveys to sync in online-only mode');
    toast({
      title: "Nothing to Sync",
      description: "All surveys are already synced online.",
    });
  }, [toast]);

  // Clear all data method
  const clearAllData = useCallback(async () => {
    try {
      console.log('[useSurveys] Clearing all data...');
      
      if (!isOnline) {
        throw new Error('Cannot clear data while offline. Please check your internet connection.');
      }
      
      // Get all surveys and delete them one by one
      const allSurveys = surveys();
      for (const survey of allSurveys) {
        await surveyStorageService.deleteSurvey(survey.id);
      }
      
      await fetchRemoteSurveys();
      toast({
        title: "Data Cleared",
        description: "All survey data has been cleared successfully.",
      });
    } catch (error) {
      console.error('[useSurveys] Failed to clear all data:', error);
      toast({
        title: "Clear Failed",
        description: error instanceof Error ? error.message : "Failed to clear data. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  }, [isOnline, surveys, fetchRemoteSurveys, toast]);

  // No-op for backward compatibility
  const uploadLocalSurveys = useCallback(async () => {
    console.log('[useSurveys] No local surveys to upload in online-only mode');
    toast({
      title: "Nothing to Upload",
      description: "All surveys are already stored online.",
    });
  }, [toast]);

  // Show offline warning
  useEffect(() => {
    if (!isOnline) {
      toast({
        title: "Offline Mode",
        description: "You're offline. Survey features are unavailable until you reconnect.",
        variant: "destructive",
      });
    }
  }, [isOnline, toast]);

  console.log(`[useSurveys] Loaded ${surveys().length} surveys from online storage`);

  return {
    surveys: surveys(),
    loading,
    createSurvey,
    updateSurvey,
    updateSurveyStatus,
    deleteSurvey,
    syncPendingSurveys,
    clearAllData,
    refreshSurveys,
    uploadLocalSurveys,
    isOnline,
    hasOfflineSurveys: false, // Always false in online-only mode
  };
};
