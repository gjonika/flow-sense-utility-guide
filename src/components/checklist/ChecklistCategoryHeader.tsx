
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronRight, AlertTriangle } from 'lucide-react';

interface ChecklistCategoryHeaderProps {
  category: string;
  isExpanded: boolean;
  categoryResponses: number;
  totalQuestions: number;
  hasMandatoryItems: boolean;
  onToggle: () => void;
}

const ChecklistCategoryHeader = ({
  category,
  isExpanded,
  categoryResponses,
  totalQuestions,
  hasMandatoryItems,
  onToggle,
}: ChecklistCategoryHeaderProps) => {
  return (
    <div 
      className="cursor-pointer hover:bg-gray-50 transition-colors p-4"
      onClick={onToggle}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isExpanded ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
          <h3 className="text-lg font-semibold">{category}</h3>
          <Badge variant="outline">
            {categoryResponses}/{totalQuestions}
          </Badge>
        </div>
        <div className="flex gap-1">
          {hasMandatoryItems && (
            <Badge variant="destructive" className="text-xs">
              <AlertTriangle className="h-3 w-3 mr-1" />
              Mandatory Items
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChecklistCategoryHeader;
