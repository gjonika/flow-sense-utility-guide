
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface ChecklistSkipConfirmationProps {
  onCancel: () => void;
  onConfirm: () => void;
}

const ChecklistSkipConfirmation = ({ onCancel, onConfirm }: ChecklistSkipConfirmationProps) => {
  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
      <div className="flex items-center gap-2 text-yellow-800 mb-2">
        <AlertTriangle className="h-4 w-4" />
        <span className="font-medium">This is a mandatory question</span>
      </div>
      <p className="text-sm text-yellow-700 mb-3">
        Skipping mandatory questions may affect compliance reporting. Are you sure?
      </p>
      <div className="flex gap-2">
        <Button size="sm" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          size="sm"
          variant="default"
          className="bg-yellow-600 hover:bg-yellow-700"
          onClick={onConfirm}
        >
          Skip Anyway
        </Button>
      </div>
    </div>
  );
};

export default ChecklistSkipConfirmation;
