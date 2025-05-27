
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { AssessmentItem } from '@/types/assessment';

interface QuantityInputsProps {
  item: AssessmentItem;
  onUpdate: (updates: Partial<AssessmentItem>) => void;
  showFields?: {
    surfaceArea?: boolean;
    linearMeters?: boolean;
    unitCount?: boolean;
    sets?: boolean;
  };
}

const QuantityInputs = ({ item, onUpdate, showFields = {} }: QuantityInputsProps) => {
  const quantities = item.quantities || {};

  const updateQuantity = (field: keyof typeof quantities, value: number) => {
    onUpdate({
      quantities: {
        ...quantities,
        [field]: value || undefined
      }
    });
  };

  const {
    surfaceArea = true,
    linearMeters = false,
    unitCount = false,
    sets = false
  } = showFields;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-3 bg-gray-50 rounded-md">
      <h4 className="col-span-full text-sm font-medium text-gray-700 mb-2">Dimensions & Quantities</h4>
      
      {surfaceArea && (
        <div>
          <Label htmlFor="surfaceArea" className="text-xs">Surface Area (m²)</Label>
          <Input
            type="number"
            step="0.1"
            min="0"
            value={quantities.surfaceArea || ''}
            onChange={(e) => updateQuantity('surfaceArea', parseFloat(e.target.value))}
            placeholder="0.0"
            className="text-sm"
          />
        </div>
      )}

      {linearMeters && (
        <div>
          <Label htmlFor="linearMeters" className="text-xs">Linear Meters (lm)</Label>
          <Input
            type="number"
            step="0.1"
            min="0"
            value={quantities.linearMeters || ''}
            onChange={(e) => updateQuantity('linearMeters', parseFloat(e.target.value))}
            placeholder="0.0"
            className="text-sm"
          />
        </div>
      )}

      {unitCount && (
        <div>
          <Label htmlFor="unitCount" className="text-xs">Unit Count (pcs)</Label>
          <Input
            type="number"
            min="0"
            value={quantities.unitCount || ''}
            onChange={(e) => updateQuantity('unitCount', parseInt(e.target.value))}
            placeholder="0"
            className="text-sm"
          />
        </div>
      )}

      {sets && (
        <div>
          <Label htmlFor="sets" className="text-xs">Sets</Label>
          <Input
            type="number"
            min="0"
            value={quantities.sets || ''}
            onChange={(e) => updateQuantity('sets', parseInt(e.target.value))}
            placeholder="0"
            className="text-sm"
          />
        </div>
      )}
    </div>
  );
};

export default QuantityInputs;
