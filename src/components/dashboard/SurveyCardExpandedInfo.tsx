
import { User, Building, Calendar, FileText } from 'lucide-react';
import { Survey } from '@/types/survey';
import { StoredSurvey } from '@/types/storage';

interface SurveyCardExpandedInfoProps {
  survey: Survey | StoredSurvey;
}

const SurveyCardExpandedInfo = ({ survey }: SurveyCardExpandedInfoProps) => {
  const clientName = survey.client_name || 'Unknown Client';
  const clientCountry = survey.client_country || 'Unknown Country';
  const contactCount = survey.client_contacts?.length || 0;

  return (
    <div className="mt-3 space-y-2 pt-3 border-t border-gray-100">
      {/* Client Information - Hidden under "More Details" */}
      <div className="flex items-center text-sm text-gray-600">
        <User className="mr-2 h-4 w-4" />
        <span><strong>Client:</strong> {clientName}</span>
      </div>

      {/* Client HQ Location - Separate from Survey Location */}
      <div className="flex items-center text-sm text-gray-600">
        <Building className="mr-2 h-4 w-4" />
        <span><strong>Client HQ:</strong> {clientCountry}</span>
      </div>

      {/* Client Contacts */}
      {contactCount > 0 && (
        <div className="flex items-center text-sm text-gray-600">
          <Building className="mr-2 h-4 w-4" />
          <span>{contactCount} contact{contactCount !== 1 ? 's' : ''}</span>
        </div>
      )}

      {/* Project Metadata - Developer info */}
      <div className="text-xs text-gray-500 space-y-1">
        <div>Project ID: {survey.id.slice(0, 8)}...</div>
        <div className="flex items-center justify-between">
          <span>Created: {survey.created_at ? new Date(survey.created_at).toLocaleDateString() : 'Unknown'}</span>
          {('needs_sync' in survey && survey.needs_sync) && (
            <span className="text-yellow-600">• Pending sync</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default SurveyCardExpandedInfo;
