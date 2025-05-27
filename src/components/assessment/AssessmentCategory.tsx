
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { AssessmentItem as AssessmentItemType } from '@/types/assessment';
import EnhancedAssessmentItem from './EnhancedAssessmentItem';

interface AssessmentCategoryProps {
  category: string;
  items: AssessmentItemType[];
  onItemUpdate: (itemId: string, updates: Partial<AssessmentItemType>) => void;
  isExpanded?: boolean;
  onToggleExpanded?: () => void;
}

const AssessmentCategory = ({ 
  category, 
  items, 
  onItemUpdate, 
  isExpanded = false,
  onToggleExpanded 
}: AssessmentCategoryProps) => {
  const [localExpanded, setLocalExpanded] = useState(isExpanded);
  
  const expanded = onToggleExpanded ? isExpanded : localExpanded;
  const toggleExpanded = onToggleExpanded || (() => setLocalExpanded(!localExpanded));

  const completedItems = items.filter(item => item.status !== 'pending').length;
  const totalItems = items.length;

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">{category}</CardTitle>
            <p className="text-sm text-gray-500 mt-1">
              {completedItems} of {totalItems} items completed
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleExpanded}
            className="flex items-center gap-2"
          >
            {expanded ? (
              <>
                <span className="text-sm">Collapse</span>
                <ChevronUp className="h-4 w-4" />
              </>
            ) : (
              <>
                <span className="text-sm">Expand</span>
                <ChevronDown className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>
        
        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${totalItems > 0 ? (completedItems / totalItems) * 100 : 0}%` }}
          />
        </div>
      </CardHeader>
      
      {expanded && (
        <CardContent className="space-y-4">
          {items.map(item => (
            <EnhancedAssessmentItem
              key={item.id}
              item={item}
              onStatusUpdate={(status) => onItemUpdate(item.id, { status })}
              onNotesUpdate={(notes) => onItemUpdate(item.id, { notes })}
              onItemUpdate={(updates) => onItemUpdate(item.id, updates)}
            />
          ))}
        </CardContent>
      )}
    </Card>
  );
};

export default AssessmentCategory;
