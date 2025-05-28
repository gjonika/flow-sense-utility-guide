
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, Download, CreditCard, Euro } from 'lucide-react';
import { useTravelExpenses } from '@/hooks/useTravelExpenses';
import { CreateTravelExpenseData, TravelExpense } from '@/services/travelExpenseService';

interface TravelExpenseManagerProps {
  surveyId: string;
  surveyors: string[];
}

const EXPENSE_TYPES = [
  { value: 'flight', label: 'Flight', category: 'transport' },
  { value: 'hotel', label: 'Hotel', category: 'accommodation' },
  { value: 'taxi', label: 'Taxi', category: 'transport' },
  { value: 'uber', label: 'Uber/Rideshare', category: 'transport' },
  { value: 'train', label: 'Train', category: 'transport' },
  { value: 'bus', label: 'Bus', category: 'transport' },
  { value: 'ferry', label: 'Ferry', category: 'transport' },
  { value: 'parking', label: 'Parking', category: 'fees' },
  { value: 'toll', label: 'Toll Fees', category: 'fees' },
  { value: 'meal', label: 'Meals', category: 'meals' },
  { value: 'other', label: 'Other', category: 'other' },
];

const TravelExpenseManager = ({ surveyId, surveyors }: TravelExpenseManagerProps) => {
  const { 
    expenses, 
    loading, 
    createExpense, 
    updateExpense, 
    deleteExpense, 
    getTotalExpenses, 
    getExpensesBySurveyor,
    exportToCSV 
  } = useTravelExpenses(surveyId);

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState<TravelExpense | null>(null);
  const [formData, setFormData] = useState<Partial<CreateTravelExpenseData>>({
    surveyor_name: '',
    expense_type: 'other' as const,
    cost: 0,
    currency: 'EUR',
    expense_date: new Date().toISOString().split('T')[0],
    description: '',
    start_date: '',
    end_date: '',
  });

  const resetForm = () => {
    setFormData({
      surveyor_name: '',
      expense_type: 'other' as const,
      cost: 0,
      currency: 'EUR',
      expense_date: new Date().toISOString().split('T')[0],
      description: '',
      start_date: '',
      end_date: '',
    });
    setShowAddForm(false);
    setEditingExpense(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.surveyor_name || !formData.expense_type || !formData.cost || !formData.expense_date) {
      return;
    }

    try {
      const expenseData: CreateTravelExpenseData = {
        survey_id: surveyId,
        surveyor_name: formData.surveyor_name,
        expense_type: formData.expense_type,
        cost: Number(formData.cost),
        currency: formData.currency || 'EUR',
        expense_date: formData.expense_date,
        description: formData.description,
        start_date: formData.start_date || undefined,
        end_date: formData.end_date || undefined,
      };

      if (editingExpense) {
        await updateExpense(editingExpense.id, expenseData);
      } else {
        await createExpense(expenseData);
      }
      
      resetForm();
    } catch (error) {
      console.error('Failed to save expense:', error);
    }
  };

  const handleEdit = (expense: TravelExpense) => {
    setFormData({
      surveyor_name: expense.surveyor_name,
      expense_type: expense.expense_type,
      cost: expense.cost,
      currency: expense.currency,
      expense_date: expense.expense_date,
      description: expense.description || '',
      start_date: expense.start_date || '',
      end_date: expense.end_date || '',
    });
    setEditingExpense(expense);
    setShowAddForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      await deleteExpense(id);
    }
  };

  const expensesBySurveyor = getExpensesBySurveyor();
  const totalExpenses = getTotalExpenses();

  const requiresDateRange = formData.expense_type === 'flight' || formData.expense_type === 'hotel';

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-blue-700 flex items-center">
            <CreditCard className="mr-2 h-5 w-5" />
            Travel Expenses
          </CardTitle>
          <div className="flex gap-2">
            {expenses.length > 0 && (
              <Button onClick={exportToCSV} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-1" />
                Export CSV
              </Button>
            )}
            <Button onClick={() => setShowAddForm(true)} variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Add Expense
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Summary */}
        {expenses.length > 0 && (
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="font-medium text-blue-900">Total Expenses:</span>
              <div className="flex items-center text-blue-900">
                <Euro className="h-4 w-4 mr-1" />
                <span className="text-xl font-bold">{totalExpenses.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Add/Edit Form */}
        {showAddForm && (
          <Card className="border-blue-200">
            <CardHeader>
              <CardTitle className="text-lg">
                {editingExpense ? 'Edit Expense' : 'Add New Expense'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Surveyor</Label>
                    <Select
                      value={formData.surveyor_name}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, surveyor_name: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select surveyor" />
                      </SelectTrigger>
                      <SelectContent>
                        {surveyors.map((surveyor, idx) => (
                          <SelectItem key={idx} value={surveyor}>
                            {surveyor}
                          </SelectItem>
                        ))}
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Expense Type</Label>
                    <Select
                      value={formData.expense_type}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, expense_type: value as any }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {EXPENSE_TYPES.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Cost</Label>
                    <div className="flex">
                      <Input
                        type="number"
                        step="0.01"
                        value={formData.cost}
                        onChange={(e) => setFormData(prev => ({ ...prev, cost: Number(e.target.value) }))}
                        className="flex-1"
                      />
                      <Select
                        value={formData.currency}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, currency: value }))}
                      >
                        <SelectTrigger className="w-20 ml-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="EUR">EUR</SelectItem>
                          <SelectItem value="USD">USD</SelectItem>
                          <SelectItem value="GBP">GBP</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label>Date</Label>
                    <Input
                      type="date"
                      value={formData.expense_date}
                      onChange={(e) => setFormData(prev => ({ ...prev, expense_date: e.target.value }))}
                    />
                  </div>

                  {requiresDateRange && (
                    <>
                      <div>
                        <Label>Start Date</Label>
                        <Input
                          type="date"
                          value={formData.start_date}
                          onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label>End Date</Label>
                        <Input
                          type="date"
                          value={formData.end_date}
                          onChange={(e) => setFormData(prev => ({ ...prev, end_date: e.target.value }))}
                        />
                      </div>
                    </>
                  )}
                </div>

                <div>
                  <Label>Description (Optional)</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Add details about this expense..."
                    rows={2}
                  />
                </div>

                <div className="flex gap-2">
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                    {editingExpense ? 'Update' : 'Add'} Expense
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Expenses List */}
        {loading ? (
          <div className="text-center py-8">Loading expenses...</div>
        ) : expenses.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No travel expenses recorded yet. Click "Add Expense" to get started.
          </div>
        ) : (
          <div className="space-y-4">
            {Object.entries(expensesBySurveyor).map(([surveyor, surveyorExpenses]) => (
              <Card key={surveyor} className="border-gray-200">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-medium">{surveyor}</CardTitle>
                    <Badge variant="secondary">
                      Total: €{surveyorExpenses.reduce((sum, exp) => sum + exp.cost, 0).toFixed(2)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {surveyorExpenses.map((expense) => (
                      <div key={expense.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="text-xs">
                              {EXPENSE_TYPES.find(t => t.value === expense.expense_type)?.label}
                            </Badge>
                            <span className="font-medium">€{expense.cost.toFixed(2)}</span>
                            <span className="text-sm text-gray-500">{expense.expense_date}</span>
                          </div>
                          {expense.description && (
                            <p className="text-sm text-gray-600">{expense.description}</p>
                          )}
                          {(expense.start_date || expense.end_date) && (
                            <p className="text-xs text-gray-500">
                              {expense.start_date} {expense.end_date && `- ${expense.end_date}`}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(expense)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(expense.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TravelExpenseManager;
