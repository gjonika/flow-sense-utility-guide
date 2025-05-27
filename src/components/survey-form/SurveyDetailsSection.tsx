
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, X } from "lucide-react";

interface SurveyDetailsSectionProps {
  shipName: string;
  surveyLocation: string;
  surveyDate: string;
  duration: string;
  projectScope: string;
  kam?: string;
  projectNumber?: string;
  surveyors?: string[];
  onShipNameChange: (value: string) => void;
  onSurveyLocationChange: (value: string) => void;
  onSurveyDateChange: (value: string) => void;
  onDurationChange: (value: string) => void;
  onProjectScopeChange: (value: string) => void;
  onKamChange?: (value: string) => void;
  onProjectNumberChange?: (value: string) => void;
  onSurveyorsChange?: (surveyors: string[]) => void;
}

const SurveyDetailsSection = ({
  shipName,
  surveyLocation,
  surveyDate,
  duration,
  projectScope,
  kam = '',
  projectNumber = '',
  surveyors = [],
  onShipNameChange,
  onSurveyLocationChange,
  onSurveyDateChange,
  onDurationChange,
  onProjectScopeChange,
  onKamChange,
  onProjectNumberChange,
  onSurveyorsChange,
}: SurveyDetailsSectionProps) => {
  
  const addSurveyor = () => {
    if (onSurveyorsChange) {
      onSurveyorsChange([...surveyors, '']);
    }
  };

  const removeSurveyor = (index: number) => {
    if (onSurveyorsChange) {
      onSurveyorsChange(surveyors.filter((_, i) => i !== index));
    }
  };

  const updateSurveyor = (index: number, value: string) => {
    if (onSurveyorsChange) {
      const updated = [...surveyors];
      updated[index] = value;
      onSurveyorsChange(updated);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-blue-700 text-lg sm:text-xl">Survey Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="shipName">Ship Name</Label>
            <Input
              id="shipName"
              value={shipName}
              onChange={(e) => onShipNameChange(e.target.value)}
              required
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="surveyLocation">Survey Location</Label>
            <Input
              id="surveyLocation"
              value={surveyLocation}
              onChange={(e) => onSurveyLocationChange(e.target.value)}
              placeholder="City, Country (e.g., Barcelona, Spain)"
              required
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="surveyDate">Survey Date</Label>
            <div className="mt-1">
              <DatePicker
                value={surveyDate}
                onChange={onSurveyDateChange}
                placeholder="Select survey date"
                required
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="duration">Duration (days)</Label>
            <Input
              id="duration"
              value={duration}
              onChange={(e) => onDurationChange(e.target.value)}
              placeholder="e.g., 3-5 days"
              required
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="kam">Key Account Manager (KAM)</Label>
            <Input
              id="kam"
              value={kam}
              onChange={(e) => onKamChange?.(e.target.value)}
              placeholder="Internal team member"
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="projectNumber">Project Number</Label>
            <Input
              id="projectNumber"
              value={projectNumber}
              onChange={(e) => onProjectNumberChange?.(e.target.value)}
              placeholder="Internal project reference"
              className="mt-1"
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="projectScope">Project Scope</Label>
          <Textarea
            id="projectScope"
            value={projectScope}
            onChange={(e) => onProjectScopeChange(e.target.value)}
            placeholder="Describe the survey scope and objectives..."
            required
            className="mt-1 min-h-[100px]"
          />
        </div>

        {/* Surveyors Section */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <Label className="text-base font-medium">Internal Team / Surveyors</Label>
            <Button 
              type="button" 
              variant="outline"
              onClick={addSurveyor}
              size="sm"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Surveyor
            </Button>
          </div>
          
          {surveyors.length > 0 ? (
            <div className="space-y-2">
              {surveyors.map((surveyor, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder="Surveyor name"
                    value={surveyor}
                    onChange={(e) => updateSurveyor(index, e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => removeSurveyor(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-gray-500 p-3 bg-gray-50 rounded border">
              No surveyors assigned yet. Click "Add Surveyor" to assign team members.
            </div>
          )}
          
          <div className="mt-2 text-xs text-blue-600">
            💡 Surveyors added here will automatically sync with the Travel tab for flight/hotel booking
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SurveyDetailsSection;
