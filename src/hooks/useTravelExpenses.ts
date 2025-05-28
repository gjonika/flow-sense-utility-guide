
import { useState, useEffect, useCallback } from 'react';
import { travelExpenseService, TravelExpense, CreateTravelExpenseData } from '@/services/travelExpenseService';
import { useToast } from '@/hooks/use-toast';

export const useTravelExpenses = (surveyId: string) => {
  const [expenses, setExpenses] = useState<TravelExpense[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchExpenses = useCallback(async () => {
    try {
      setLoading(true);
      const data = await travelExpenseService.getTravelExpenses(surveyId);
      setExpenses(data);
    } catch (error) {
      console.error('Failed to fetch travel expenses:', error);
      toast({
        title: "Error",
        description: "Failed to load travel expenses",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [surveyId, toast]);

  const createExpense = useCallback(async (expenseData: CreateTravelExpenseData) => {
    try {
      const newExpense = await travelExpenseService.createTravelExpense(expenseData);
      setExpenses(prev => [newExpense, ...prev]);
      toast({
        title: "Success",
        description: "Travel expense added successfully",
      });
      return newExpense;
    } catch (error) {
      console.error('Failed to create travel expense:', error);
      toast({
        title: "Error",
        description: "Failed to add travel expense",
        variant: "destructive",
      });
      throw error;
    }
  }, [toast]);

  const updateExpense = useCallback(async (id: string, updates: Partial<CreateTravelExpenseData>) => {
    try {
      const updatedExpense = await travelExpenseService.updateTravelExpense(id, updates);
      setExpenses(prev => prev.map(expense => 
        expense.id === id ? updatedExpense : expense
      ));
      toast({
        title: "Success",
        description: "Travel expense updated successfully",
      });
      return updatedExpense;
    } catch (error) {
      console.error('Failed to update travel expense:', error);
      toast({
        title: "Error",
        description: "Failed to update travel expense",
        variant: "destructive",
      });
      throw error;
    }
  }, [toast]);

  const deleteExpense = useCallback(async (id: string) => {
    try {
      await travelExpenseService.deleteTravelExpense(id);
      setExpenses(prev => prev.filter(expense => expense.id !== id));
      toast({
        title: "Success",
        description: "Travel expense deleted successfully",
      });
    } catch (error) {
      console.error('Failed to delete travel expense:', error);
      toast({
        title: "Error",
        description: "Failed to delete travel expense",
        variant: "destructive",
      });
      throw error;
    }
  }, [toast]);

  const getTotalExpenses = useCallback(() => {
    return expenses.reduce((total, expense) => total + expense.cost, 0);
  }, [expenses]);

  const getExpensesBySurveyor = useCallback(() => {
    const groupedExpenses: { [surveyor: string]: TravelExpense[] } = {};
    expenses.forEach(expense => {
      if (!groupedExpenses[expense.surveyor_name]) {
        groupedExpenses[expense.surveyor_name] = [];
      }
      groupedExpenses[expense.surveyor_name].push(expense);
    });
    return groupedExpenses;
  }, [expenses]);

  const exportToCSV = useCallback(async () => {
    try {
      const csvContent = await travelExpenseService.exportExpensesToCSV(surveyId);
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `travel_expenses_${surveyId}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Success",
        description: "Travel expenses exported successfully",
      });
    } catch (error) {
      console.error('Failed to export expenses:', error);
      toast({
        title: "Error",
        description: "Failed to export travel expenses",
        variant: "destructive",
      });
    }
  }, [surveyId, toast]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  return {
    expenses,
    loading,
    createExpense,
    updateExpense,
    deleteExpense,
    getTotalExpenses,
    getExpensesBySurveyor,
    exportToCSV,
    refreshExpenses: fetchExpenses,
  };
};
