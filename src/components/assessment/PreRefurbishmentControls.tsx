
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface PreRefurbishmentControlsProps {
  expandedCategories: string[];
  onToggleAllSections: () => void;
}

const PreRefurbishmentControls = ({ expandedCategories, onToggleAllSections }: PreRefurbishmentControlsProps) => {
  const isAllExpanded = expandedCategories.length > 0;
  
  return (
    <Button 
      variant="outline" 
      onClick={onToggleAllSections}
      className="flex items-center gap-2 text-sm font-medium"
    >
      {isAllExpanded ? (
        <>
          <ChevronUp className="h-4 w-4" />
          Collapse All
        </>
      ) : (
        <>
          <ChevronDown className="h-4 w-4" />
          Expand All
        </>
      )}
    </Button>
  );
};

export default PreRefurbishmentControls;
