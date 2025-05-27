
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Plus, X, Wrench } from 'lucide-react';

interface ToolPreset {
  name: string;
  defaultSelected: boolean;
  category: 'essential' | 'optional' | 'custom';
}

const DEFAULT_TOOL_PRESETS: ToolPreset[] = [
  { name: "Flashlight", defaultSelected: true, category: 'essential' },
  { name: "Measurement Tape", defaultSelected: true, category: 'essential' },
  { name: "Laser Distance Meter", defaultSelected: true, category: 'essential' },
  { name: "Camera / Phone", defaultSelected: true, category: 'essential' },
  { name: "Notebook & Pen", defaultSelected: true, category: 'essential' },
  { name: "Drawings / Plans", defaultSelected: false, category: 'optional' },
  { name: "Powerbank", defaultSelected: false, category: 'optional' },
  { name: "Laptop / Tablet", defaultSelected: false, category: 'optional' },
  { name: "Safety Shoes", defaultSelected: false, category: 'optional' },
  { name: "Helmet", defaultSelected: false, category: 'optional' },
];

interface EnhancedToolsFormProps {
  tools: string[];
  onChange: (tools: string[]) => void;
}

const EnhancedToolsForm = ({ tools, onChange }: EnhancedToolsFormProps) => {
  const [newTool, setNewTool] = useState("");
  const [selectedPresets, setSelectedPresets] = useState<Set<string>>(
    new Set(tools.length > 0 ? tools : DEFAULT_TOOL_PRESETS.filter(p => p.defaultSelected).map(p => p.name))
  );

  // Initialize tools with defaults if empty
  if (tools.length === 0 && selectedPresets.size > 0) {
    onChange(Array.from(selectedPresets));
  }

  const handlePresetToggle = (toolName: string, checked: boolean) => {
    const newSelected = new Set(selectedPresets);
    if (checked) {
      newSelected.add(toolName);
    } else {
      newSelected.delete(toolName);
    }
    setSelectedPresets(newSelected);
    onChange(Array.from(newSelected));
  };

  const addCustomTool = () => {
    if (newTool.trim() && !selectedPresets.has(newTool.trim())) {
      const newSelected = new Set(selectedPresets);
      newSelected.add(newTool.trim());
      setSelectedPresets(newSelected);
      onChange(Array.from(newSelected));
      setNewTool("");
    }
  };

  const removeCustomTool = (toolName: string) => {
    const isPreset = DEFAULT_TOOL_PRESETS.some(p => p.name === toolName);
    if (!isPreset) {
      const newSelected = new Set(selectedPresets);
      newSelected.delete(toolName);
      setSelectedPresets(newSelected);
      onChange(Array.from(newSelected));
    }
  };

  const getCategoryTools = (category: 'essential' | 'optional') => {
    return DEFAULT_TOOL_PRESETS.filter(preset => preset.category === category);
  };

  const getCustomTools = () => {
    const presetNames = DEFAULT_TOOL_PRESETS.map(p => p.name);
    return Array.from(selectedPresets).filter(tool => !presetNames.includes(tool));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-blue-700 flex items-center gap-2">
          <Wrench className="h-5 w-5" />
          Tools & Equipment
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Essential Tools */}
        <div>
          <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
            <Badge variant="default" className="bg-green-100 text-green-800">Essential</Badge>
            Recommended Tools
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {getCategoryTools('essential').map((preset) => (
              <div key={preset.name} className="flex items-center space-x-2">
                <Checkbox
                  id={`essential-${preset.name}`}
                  checked={selectedPresets.has(preset.name)}
                  onCheckedChange={(checked) => handlePresetToggle(preset.name, checked as boolean)}
                />
                <label 
                  htmlFor={`essential-${preset.name}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {preset.name}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Optional Tools */}
        <div>
          <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
            <Badge variant="outline" className="bg-blue-50 text-blue-700">Optional</Badge>
            Additional Tools
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {getCategoryTools('optional').map((preset) => (
              <div key={preset.name} className="flex items-center space-x-2">
                <Checkbox
                  id={`optional-${preset.name}`}
                  checked={selectedPresets.has(preset.name)}
                  onCheckedChange={(checked) => handlePresetToggle(preset.name, checked as boolean)}
                />
                <label 
                  htmlFor={`optional-${preset.name}`}
                  className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {preset.name}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Custom Tools */}
        {getCustomTools().length > 0 && (
          <div>
            <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
              <Badge variant="outline" className="bg-purple-50 text-purple-700">Custom</Badge>
              Your Tools
            </h4>
            <div className="space-y-2">
              {getCustomTools().map((tool) => (
                <div key={tool} className="flex items-center justify-between bg-purple-50 p-2 rounded">
                  <span className="text-sm">{tool}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeCustomTool(tool)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add Custom Tool */}
        <div>
          <h4 className="font-medium text-gray-700 mb-3">Add Custom Tool</h4>
          <div className="flex gap-2">
            <Input
              value={newTool}
              onChange={(e) => setNewTool(e.target.value)}
              placeholder="Enter custom tool name..."
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomTool())}
              className="flex-1"
            />
            <Button type="button" onClick={addCustomTool} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add
            </Button>
          </div>
        </div>

        {/* Selected Summary */}
        <div className="pt-3 border-t">
          <p className="text-sm text-gray-600 mb-2">
            Selected Tools ({selectedPresets.size}):
          </p>
          <div className="flex flex-wrap gap-1">
            {Array.from(selectedPresets).map((tool) => (
              <Badge key={tool} variant="secondary" className="text-xs">
                {tool}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedToolsForm;
