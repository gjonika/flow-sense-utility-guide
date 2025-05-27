
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Survey } from "@/types/survey";
import { StoredSurvey } from "@/types/storage";
import SyncStatusBadge from "@/components/SyncStatusBadge";
import DeleteSurveyButton from "@/components/DeleteSurveyButton";
import SurveyCardHeader from "./SurveyCardHeader";
import { useState } from "react";

interface SurveyCardProps {
  survey: Survey | StoredSurvey;
  isOnline: boolean;
  onView: (survey: Survey | StoredSurvey) => void;
  onEdit: (survey: Survey | StoredSurvey) => void;
  onDelete?: () => void;
}

const SurveyCard = ({ survey, isOnline, onView, onEdit, onDelete }: SurveyCardProps) => {
  const [showClientDetails, setShowClientDetails] = useState(false);

  const getStatusColor = (status: Survey['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  // Check if this is a local survey
  const isLocalSurvey = 'local_only' in survey && survey.local_only;
  const shipName = survey.ship_name || 'Unnamed Ship';

  return (
    <Card className="border-blue-200 hover:shadow-lg transition-all duration-200 cursor-pointer relative">
      {/* Delete button positioned in top right corner */}
      <div className="absolute top-3 right-3 z-10">
        <DeleteSurveyButton
          surveyId={survey.id}
          surveyName={shipName}
          isOnline={!isLocalSurvey}
          onDelete={onDelete}
          variant="ghost"
        />
      </div>

      <CardHeader className="pb-3 pr-16">
        <SurveyCardHeader survey={survey} getStatusColor={getStatusColor} />
        
        {/* Main survey information - always visible */}
        <div className="space-y-2 mt-3">
          <div className="flex items-center gap-2 text-sm">
            <span className="font-medium text-gray-700">📍 Survey Location:</span>
            <span className="text-gray-900">{survey.survey_location || 'Location not specified'}</span>
          </div>
          
          {survey.survey_date && (
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium text-gray-700">📅 Date:</span>
              <span className="text-gray-900">{new Date(survey.survey_date).toLocaleDateString()}</span>
            </div>
          )}
          
          {survey.duration && (
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium text-gray-700">⏱️ Duration:</span>
              <span className="text-gray-900">{survey.duration}</span>
            </div>
          )}
          
          {survey.custom_fields?.project_number && (
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium text-gray-700">🔢 Project:</span>
              <span className="text-gray-900">{survey.custom_fields.project_number}</span>
            </div>
          )}
        </div>
        
        <div className="flex flex-wrap gap-2 mt-3">
          <SyncStatusBadge survey={survey} isOnline={isOnline} />
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {/* Expandable section for client details */}
        <div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowClientDetails(!showClientDetails);
            }}
            className="flex items-center text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            {showClientDetails ? <ChevronUp className="h-4 w-4 mr-1" /> : <ChevronDown className="h-4 w-4 mr-1" />}
            {showClientDetails ? 'Hide Client Details' : 'Show Client Details'}
          </button>
          
          {showClientDetails && (
            <div className="mt-3 space-y-2 p-3 bg-gray-50 rounded">
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium text-gray-700">Client:</span>
                <span className="text-gray-900">{survey.client_name || 'Unknown Client'}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium text-gray-700">Client HQ:</span>
                <span className="text-gray-900">{survey.client_country || 'Unknown Country'}</span>
              </div>
              {survey.custom_fields?.kam && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium text-gray-700">KAM:</span>
                  <span className="text-gray-900">{survey.custom_fields.kam}</span>
                </div>
              )}
              {survey.client_contacts && survey.client_contacts.length > 0 && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium text-gray-700">Contacts:</span>
                  <span className="text-gray-900">{survey.client_contacts.length} contact{survey.client_contacts.length !== 1 ? 's' : ''}</span>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Project scope */}
        {survey.project_scope && (
          <div className="pt-3 border-t border-gray-100">
            <p className="text-sm text-gray-700 line-clamp-2 mb-3">
              {survey.project_scope}
            </p>
          </div>
        )}

        {/* Action buttons */}
        <div className="pt-3 border-t border-gray-100">
          <div className="flex gap-2">
            <Button 
              variant="outline"
              onClick={() => onView(survey)}
              className="flex-1"
            >
              View Details
            </Button>
            <Button 
              onClick={() => onEdit(survey)}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              Edit
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SurveyCard;
