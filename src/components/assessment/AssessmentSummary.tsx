
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Save, FileText } from 'lucide-react';
import { AssessmentItem } from '@/types/assessment';
import { useIsMobile } from '@/hooks/use-mobile';

interface AssessmentSummaryProps {
  checklist: AssessmentItem[];
  hasChanges: boolean;
  onSave: () => void;
  earlyProcurementCount: number;
}

const AssessmentSummary = ({ checklist, hasChanges, onSave, earlyProcurementCount }: AssessmentSummaryProps) => {
  const isMobile = useIsMobile();

  const totalItems = checklist.length;
  const assessedItems = checklist.filter(item => item.conditionNotes || item.plannedMaterial).length;
  const priorityItems = checklist.filter(item => item.isPriority).length;
  
  const needAttentionItems = checklist.filter(item => 
    item.status === 'requires_attention' || item.notes?.toLowerCase().includes('attention')
  ).length;
  
  const toReplaceItems = checklist.filter(item => 
    item.actionRequired === 'replace'
  ).length;
  
  const toRefurbishItems = checklist.filter(item => 
    item.actionRequired === 'refurbish'
  ).length;

  const summaryItems = [
    { 
      label: 'Items Assessed', 
      value: `${assessedItems}/${totalItems}`, 
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    { 
      label: 'Priority Items', 
      value: priorityItems, 
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    { 
      label: 'Need Attention', 
      value: needAttentionItems, 
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    { 
      label: 'To Replace', 
      value: toReplaceItems, 
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    { 
      label: 'To Refurbish', 
      value: toRefurbishItems, 
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    { 
      label: 'Early Procurement', 
      value: earlyProcurementCount, 
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
  ];

  return (
    <Card>
      <CardHeader className="pb-2 sm:pb-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
          <CardTitle className="flex items-center gap-2 text-sm sm:text-base lg:text-lg">
            <FileText className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 shrink-0" />
            <span className="leading-tight">Pre-Refurbishment Material Assessment Summary</span>
          </CardTitle>
          {hasChanges && (
            <Button 
              onClick={onSave} 
              size="sm"
              className="w-full sm:w-auto"
            >
              <Save className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="text-xs sm:text-sm">Save Changes</span>
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0 px-3 sm:px-6 pb-3 sm:pb-6">
        <div className={`grid ${isMobile ? 'grid-cols-2 gap-2' : 'grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4'}`}>
          {summaryItems.map((item, index) => (
            <div 
              key={index} 
              className={`${item.bgColor} rounded-lg p-2 sm:p-3 lg:p-4 text-center`}
            >
              <div className={`text-base sm:text-lg lg:text-2xl font-bold ${item.color} mb-0.5 sm:mb-1`}>
                {item.value}
              </div>
              <div className="text-xs sm:text-sm text-gray-600 leading-tight">
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AssessmentSummary;
