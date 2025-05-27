
import { useState, useEffect, useCallback } from 'react';
import { AssessmentItem } from '@/types/assessment';
import { v4 as generateId } from 'uuid';
import { assessmentService } from '@/services/assessmentService';
import { useToast } from './use-toast';

interface UseAssessmentItemsReturn {
  assessmentItems: AssessmentItem[];
  loading: boolean;
  updateItem: (id: string, updates: Partial<AssessmentItem>) => Promise<void>;
  addItem: (category: string, zoneId?: string) => Promise<AssessmentItem>;
  deleteItem: (id: string) => Promise<void>;
  saveChanges: () => Promise<void>;
  hasUnsavedChanges: boolean;
}

export const useAssessmentItems = (surveyId: string): UseAssessmentItemsReturn => {
  const [assessmentItems, setAssessmentItems] = useState<AssessmentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const { toast } = useToast();

  const loadItems = useCallback(async () => {
    setLoading(true);
    try {
      const items = await assessmentService.fetchAssessmentItems(surveyId);
      setAssessmentItems(items);
    } catch (error) {
      console.error('Error fetching assessment items:', error);
      toast({
        title: "Error",
        description: "Failed to load assessment items",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [surveyId, toast]);

  useEffect(() => {
    loadItems();
  }, [surveyId, loadItems]);

  const updateItem = async (id: string, updates: Partial<AssessmentItem>) => {
    try {
      setAssessmentItems(prev =>
        prev.map(item => (item.id === id ? { ...item, ...updates } : item))
      );
      setHasUnsavedChanges(true);
    } catch (error) {
      console.error('Error updating assessment item:', error);
      toast({
        title: "Error",
        description: "Failed to update assessment item",
        variant: "destructive",
      });
      throw error;
    }
  };

  const addItem = async (category: string, zoneId?: string) => {
    try {
      const newItem: AssessmentItem = {
        id: generateId(),
        question: `New ${category} assessment item`,
        category,
        status: 'pending',
        notes: '',
        isPriority: false,
        actionRequired: undefined,
        plannedMaterial: '',
        quantities: {},
        markForEarlyProcurement: false
      };

      setAssessmentItems(prev => [...prev, newItem]);
      setHasUnsavedChanges(true);
      
      console.log('Adding item to category:', category);
      return newItem;
    } catch (error) {
      console.error('Error adding assessment item:', error);
      throw error;
    }
  };

  const deleteItem = async (id: string) => {
    try {
      setAssessmentItems(prev => prev.filter(item => item.id !== id));
      setHasUnsavedChanges(true);
    } catch (error) {
      console.error('Error deleting assessment item:', error);
      toast({
        title: "Error",
        description: "Failed to delete assessment item",
        variant: "destructive",
      });
      throw error;
    }
  };

  const saveChanges = async () => {
    setLoading(true);
    try {
      await assessmentService.saveAssessmentItems(surveyId, assessmentItems);
      setHasUnsavedChanges(false);
      toast({
        title: "Success",
        description: "Changes saved successfully",
      });
    } catch (error) {
      console.error('Error saving assessment items:', error);
      toast({
        title: "Error",
        description: "Failed to save changes",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    assessmentItems,
    loading,
    updateItem,
    addItem,
    deleteItem,
    saveChanges,
    hasUnsavedChanges,
  };
};
