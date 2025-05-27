
import { Button } from '@/components/ui/button';

interface PreRefurbishmentStickyActionsProps {
  hasChanges: boolean;
  onSave: () => void;
}

const PreRefurbishmentStickyActions = ({ hasChanges, onSave }: PreRefurbishmentStickyActionsProps) => {
  return (
    <div className="sticky bottom-4 flex justify-center">
      <Button 
        onClick={onSave}
        disabled={!hasChanges}
        size="lg"
        className="shadow-lg"
      >
        Save Assessment
      </Button>
    </div>
  );
};

export default PreRefurbishmentStickyActions;
