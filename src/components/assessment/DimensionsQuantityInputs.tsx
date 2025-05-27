
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { AssessmentItem } from '@/types/assessment';

interface DimensionsQuantityInputsProps {
  item: AssessmentItem;
  onUpdate: (updates: Partial<AssessmentItem>) => void;
}

const DimensionsQuantityInputs = ({ item, onUpdate }: DimensionsQuantityInputsProps) => {
  const dimensions = item.dimensions || {};

  const updateDimension = (field: keyof typeof dimensions, value: number | undefined) => {
    const newDimensions = {
      ...dimensions,
      [field]: value || undefined
    };
    
    // Auto-calculate area if width and height are provided
    if (field === 'width' || field === 'height') {
      const width = field === 'width' ? value : dimensions.width;
      const height = field === 'height' ? value : dimensions.height;
      
      if (width && height) {
        // Convert cm to m² (width * height / 10000)
        newDimensions.area = Math.round((width * height / 10000) * 100) / 100;
      }
    }
    
    onUpdate({ dimensions: newDimensions });
  };

  const updateQuantity = (value: number | undefined) => {
    onUpdate({ quantity: value || undefined });
  };

  const updatePositionCode = (value: string) => {
    onUpdate({ positionCode: value || undefined });
  };

  return (
    <div className="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
      <h4 className="font-medium text-blue-900 text-sm">Dimensions & Quantity</h4>
      
      {/* Position Code */}
      <div>
        <Label htmlFor="positionCode" className="text-xs text-gray-600">Position Name / Code (Optional)</Label>
        <Input
          value={item.positionCode || ''}
          onChange={(e) => updatePositionCode(e.target.value)}
          placeholder="e.g., Port Side Forward, Cabin A12"
          className="text-sm"
        />
      </div>

      {/* Dimensions Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div>
          <Label htmlFor="width" className="text-xs text-gray-600">Width (cm)</Label>
          <Input
            type="number"
            step="0.1"
            min="0"
            value={dimensions.width || ''}
            onChange={(e) => updateDimension('width', parseFloat(e.target.value) || undefined)}
            placeholder="0"
            className="text-sm"
          />
        </div>
        
        <div>
          <Label htmlFor="height" className="text-xs text-gray-600">Height (cm)</Label>
          <Input
            type="number"
            step="0.1"
            min="0"
            value={dimensions.height || ''}
            onChange={(e) => updateDimension('height', parseFloat(e.target.value) || undefined)}
            placeholder="0"
            className="text-sm"
          />
        </div>
        
        <div>
          <Label htmlFor="length" className="text-xs text-gray-600">Length (cm)</Label>
          <Input
            type="number"
            step="0.1"
            min="0"
            value={dimensions.length || ''}
            onChange={(e) => updateDimension('length', parseFloat(e.target.value) || undefined)}
            placeholder="0"
            className="text-sm"
          />
        </div>
        
        <div>
          <Label htmlFor="area" className="text-xs text-gray-600">Area (m²)</Label>
          <Input
            type="number"
            step="0.01"
            min="0"
            value={dimensions.area || ''}
            onChange={(e) => updateDimension('area', parseFloat(e.target.value) || undefined)}
            placeholder="Auto-calc"
            className="text-sm"
          />
          {dimensions.width && dimensions.height && (
            <p className="text-xs text-green-600 mt-1">Auto-calculated from W×H</p>
          )}
        </div>
      </div>

      {/* Quantity */}
      <div className="max-w-32">
        <Label htmlFor="quantity" className="text-xs text-gray-600">Quantity</Label>
        <Input
          type="number"
          min="1"
          value={item.quantity || ''}
          onChange={(e) => updateQuantity(parseInt(e.target.value) || undefined)}
          placeholder="1"
          className="text-sm"
        />
      </div>
    </div>
  );
};

export default DimensionsQuantityInputs;
