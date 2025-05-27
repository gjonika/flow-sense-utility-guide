
import { Survey } from '@/types/survey';
import { useSurveys } from '@/hooks/useSurveys';
import { useSurveyZones } from '@/hooks/useSurveyZones';
import SurveyDetailsHeader from './SurveyDetailsHeader';
import SurveyOverviewCard from './SurveyOverviewCard';
import SurveyDetailsTabs from './SurveyDetailsTabs';

interface SurveyDetailsProps {
  survey: Survey;
  onUpdate: (id: string, updates: Partial<Survey>) => Promise<Survey>;
  onBack: () => void;
}

const SurveyDetails = ({ survey, onUpdate, onBack }: SurveyDetailsProps) => {
  const { zones, loading: zonesLoading } = useSurveyZones(survey.id);
  const { isOnline, updateSurveyStatus } = useSurveys();

  const handleStatusChange = async (newStatus: Survey['status']) => {
    console.log('[SurveyDetails] Updating status to:', newStatus);
    await updateSurveyStatus(survey.id, newStatus);
    console.log('[SurveyDetails] Status updated successfully');
  };

  const handleSurveyUpdate = async (updates: Partial<Survey>) => {
    console.log('[SurveyDetails] Updating survey with:', updates);
    await onUpdate(survey.id, updates);
    console.log('[SurveyDetails] Survey updated successfully');
  };

  const handleSurveyUpdateDirect = (updatedSurvey: Survey) => {
    handleSurveyUpdate(updatedSurvey);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SurveyDetailsHeader 
        survey={survey}
        isOnline={isOnline}
        onBack={onBack}
      />

      <div className="container mx-auto px-2 sm:px-4 lg:px-6 py-3 sm:py-6 space-y-4 sm:space-y-6">
        {/* General Information & Survey Overview - kept above tabs as requested */}
        <SurveyOverviewCard 
          survey={survey}
          onStatusChange={handleStatusChange}
          onUpdate={handleSurveyUpdate}
        />

        {/* Tabs section */}
        <SurveyDetailsTabs 
          survey={survey}
          zones={zones}
          onUpdate={handleSurveyUpdateDirect}
        />
      </div>
    </div>
  );
};

export default SurveyDetails;
