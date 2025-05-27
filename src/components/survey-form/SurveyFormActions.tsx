
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

interface SurveyFormActionsProps {
  isEdit: boolean;
  saving: boolean;
  isOnline: boolean;
  onCancel: () => void;
}

const SurveyFormActions = ({ isEdit, saving, isOnline, onCancel }: SurveyFormActionsProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
      <Button 
        type="button" 
        variant="outline" 
        onClick={onCancel} 
        disabled={saving}
        className="w-full sm:w-auto order-2 sm:order-1"
      >
        Cancel
      </Button>
      <Button 
        type="submit" 
        className="bg-blue-600 hover:bg-blue-700 flex items-center justify-center gap-2 w-full sm:w-auto order-1 sm:order-2"
        disabled={saving}
      >
        <Save className="h-4 w-4" />
        {saving 
          ? 'Saving...' 
          : isEdit 
            ? 'Update Survey' 
            : isOnline 
              ? 'Save Online' 
              : 'Save Offline'
        }
      </Button>
    </div>
  );
};

export default SurveyFormActions;
