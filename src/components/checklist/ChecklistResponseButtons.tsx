
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, MinusCircle, SkipForward } from 'lucide-react';

interface ChecklistResponseButtonsProps {
  selectedResponse: 'yes' | 'no' | 'na' | 'skipped' | null;
  onResponseSelect: (responseType: 'yes' | 'no' | 'na' | 'skipped') => void;
}

const ChecklistResponseButtons = ({ selectedResponse, onResponseSelect }: ChecklistResponseButtonsProps) => {
  return (
    <div className="grid grid-cols-4 gap-2">
      <Button
        variant={selectedResponse === 'yes' ? 'default' : 'outline'}
        className={`${selectedResponse === 'yes' ? 'bg-green-600 hover:bg-green-700' : ''}`}
        onClick={() => onResponseSelect('yes')}
      >
        <CheckCircle className="h-4 w-4 mr-1" />
        Yes
      </Button>
      <Button
        variant={selectedResponse === 'no' ? 'default' : 'outline'}
        className={`${selectedResponse === 'no' ? 'bg-red-600 hover:bg-red-700' : ''}`}
        onClick={() => onResponseSelect('no')}
      >
        <XCircle className="h-4 w-4 mr-1" />
        No
      </Button>
      <Button
        variant={selectedResponse === 'na' ? 'default' : 'outline'}
        className={`${selectedResponse === 'na' ? 'bg-gray-600 hover:bg-gray-700' : ''}`}
        onClick={() => onResponseSelect('na')}
      >
        <MinusCircle className="h-4 w-4 mr-1" />
        N/A
      </Button>
      <Button
        variant={selectedResponse === 'skipped' ? 'default' : 'outline'}
        className={`${selectedResponse === 'skipped' ? 'bg-yellow-600 hover:bg-yellow-700' : ''}`}
        onClick={() => onResponseSelect('skipped')}
      >
        <SkipForward className="h-4 w-4 mr-1" />
        Skip
      </Button>
    </div>
  );
};

export default ChecklistResponseButtons;
