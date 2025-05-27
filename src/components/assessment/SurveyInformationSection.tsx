
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, Plus, X } from 'lucide-react';
import { Survey } from '@/types/survey';

interface SurveyInformationSectionProps {
  survey: Survey;
  onMainFieldUpdate: (field: keyof Survey, value: string) => void;
  onUpdate: (field: string, value: string) => void;
}

const SurveyInformationSection = ({ survey, onMainFieldUpdate, onUpdate }: SurveyInformationSectionProps) => {
  const surveyors = survey.custom_fields?.surveyors ? JSON.parse(survey.custom_fields.surveyors) : [];

  const handleSurveyorsUpdate = (newSurveyors: string[]) => {
    onUpdate('surveyors', JSON.stringify(newSurveyors));
    
    // Sync with travel section - ensure travelers are updated when surveyors change
    const existingTravelers = survey.custom_fields?.travelers ? 
      JSON.parse(survey.custom_fields.travelers) : [];
    
    // Update travelers to match surveyors
    const updatedTravelers = newSurveyors.map(surveyor => {
      const existingTraveler = existingTravelers.find((t: any) => t.surveyor === surveyor);
      return existingTraveler || { surveyor };
    });
    
    onUpdate('travelers', JSON.stringify(updatedTravelers));
    console.log('[SurveyInformationSection] Synced surveyors with travel tab:', updatedTravelers);
  };

  const addSurveyor = () => {
    const newSurveyors = [...surveyors, ''];
    handleSurveyorsUpdate(newSurveyors);
  };

  const removeSurveyor = (index: number) => {
    const newSurveyors = surveyors.filter((_: string, i: number) => i !== index);
    handleSurveyorsUpdate(newSurveyors);
  };

  const updateSurveyor = (index: number, value: string) => {
    const newSurveyors = [...surveyors];
    newSurveyors[index] = value;
    handleSurveyorsUpdate(newSurveyors);
  };

  return (
    <div>
      <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center gap-2">
        <Calendar className="h-4 w-4" />
        Survey Details
      </h4>
      
      {/* Basic Survey Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div>
          <Label htmlFor="shipName">Ship Name</Label>
          <Input
            id="shipName"
            value={survey.ship_name || ''}
            onChange={(e) => onMainFieldUpdate('ship_name', e.target.value)}
            placeholder="Enter vessel name"
          />
        </div>

        <div>
          <Label htmlFor="surveyLocation">Survey Location</Label>
          <Input
            id="surveyLocation"
            value={survey.survey_location || ''}
            onChange={(e) => onMainFieldUpdate('survey_location', e.target.value)}
            placeholder="Port or city where ship is boarded"
          />
        </div>

        <div>
          <Label htmlFor="inspectionDate">Survey Date</Label>
          <Input
            id="inspectionDate"
            type="date"
            value={survey.survey_date || ''}
            onChange={(e) => onMainFieldUpdate('survey_date', e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="duration">Duration</Label>
          <Input
            id="duration"
            value={survey.duration || ''}
            onChange={(e) => onMainFieldUpdate('duration', e.target.value)}
            placeholder="e.g., 4 days"
          />
        </div>

        <div>
          <Label htmlFor="kam">Key Account Manager (KAM)</Label>
          <Input
            id="kam"
            value={survey.custom_fields?.kam || ''}
            onChange={(e) => onUpdate('kam', e.target.value)}
            placeholder="Internal team member"
          />
        </div>

        <div>
          <Label htmlFor="projectNumber">Project Number</Label>
          <Input
            id="projectNumber"
            value={survey.custom_fields?.project_number || ''}
            onChange={(e) => onUpdate('project_number', e.target.value)}
            placeholder="Internal project reference"
          />
        </div>
      </div>

      {/* Project Scope */}
      <div className="mb-6">
        <Label htmlFor="projectScope">Project Scope</Label>
        <Textarea
          id="projectScope"
          value={survey.project_scope || ''}
          onChange={(e) => onMainFieldUpdate('project_scope', e.target.value)}
          placeholder="Describe what is being inspected and the survey objectives..."
          className="mt-1 min-h-[80px]"
        />
      </div>

      {/* Surveyors */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <Label className="text-sm font-medium">Surveyors</Label>
          <Button 
            type="button" 
            variant="outline"
            onClick={addSurveyor}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Surveyor
          </Button>
        </div>
        
        {surveyors.length > 0 ? (
          <div className="space-y-2">
            {surveyors.map((surveyor: string, index: number) => (
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
    </div>
  );
};

export default SurveyInformationSection;
