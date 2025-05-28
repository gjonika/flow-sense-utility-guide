
import { supabase } from '@/integrations/supabase/client';

export interface TravelExpense {
  id: string;
  survey_id: string;
  surveyor_name: string;
  expense_type: 'flight' | 'hotel' | 'taxi' | 'uber' | 'train' | 'bus' | 'ferry' | 'parking' | 'toll' | 'meal' | 'other';
  cost: number;
  currency: string;
  expense_date: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateTravelExpenseData {
  survey_id: string;
  surveyor_name: string;
  expense_type: TravelExpense['expense_type'];
  cost: number;
  currency: string;
  expense_date: string;
  description?: string;
  start_date?: string;
  end_date?: string;
}

class TravelExpenseService {
  async getTravelExpenses(surveyId: string): Promise<TravelExpense[]> {
    const { data, error } = await supabase
      .from('travel_expenses')
      .select('*')
      .eq('survey_id', surveyId)
      .order('expense_date', { ascending: false });

    if (error) {
      console.error('Error fetching travel expenses:', error);
      throw error;
    }

    return (data || []).map(expense => ({
      ...expense,
      expense_type: expense.expense_type as TravelExpense['expense_type']
    }));
  }

  async createTravelExpense(expenseData: CreateTravelExpenseData): Promise<TravelExpense> {
    const { data, error } = await supabase
      .from('travel_expenses')
      .insert([expenseData])
      .select()
      .single();

    if (error) {
      console.error('Error creating travel expense:', error);
      throw error;
    }

    return {
      ...data,
      expense_type: data.expense_type as TravelExpense['expense_type']
    };
  }

  async updateTravelExpense(id: string, updates: Partial<CreateTravelExpenseData>): Promise<TravelExpense> {
    const { data, error } = await supabase
      .from('travel_expenses')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating travel expense:', error);
      throw error;
    }

    return {
      ...data,
      expense_type: data.expense_type as TravelExpense['expense_type']
    };
  }

  async deleteTravelExpense(id: string): Promise<void> {
    const { error } = await supabase
      .from('travel_expenses')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting travel expense:', error);
      throw error;
    }
  }

  async getTotalExpensesBySurveyor(surveyId: string): Promise<{ [surveyor: string]: number }> {
    const expenses = await this.getTravelExpenses(surveyId);
    const totals: { [surveyor: string]: number } = {};

    expenses.forEach(expense => {
      if (!totals[expense.surveyor_name]) {
        totals[expense.surveyor_name] = 0;
      }
      totals[expense.surveyor_name] += expense.cost;
    });

    return totals;
  }

  async exportExpensesToCSV(surveyId: string): Promise<string> {
    const expenses = await this.getTravelExpenses(surveyId);
    
    const headers = [
      'Surveyor Name',
      'Expense Type',
      'Cost',
      'Currency',
      'Expense Date',
      'Start Date',
      'End Date',
      'Description'
    ];

    const rows = expenses.map(expense => [
      expense.surveyor_name,
      expense.expense_type,
      expense.cost.toString(),
      expense.currency,
      expense.expense_date,
      expense.start_date || '',
      expense.end_date || '',
      expense.description || ''
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    return csvContent;
  }
}

export const travelExpenseService = new TravelExpenseService();
