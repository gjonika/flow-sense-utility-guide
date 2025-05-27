
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Ship, Plus, Settings, TrendingUp } from 'lucide-react';
import { useSurveys } from '@/hooks/useSurveys';
import SurveyCard from '@/components/dashboard/SurveyCard';
import SyncStatusIndicator from '@/components/SyncStatusIndicator';
import SyncStatusBanner from '@/components/SyncStatusBanner';
import UserMenu from '@/components/UserMenu';
import SurveySortDropdown from '@/components/dashboard/SurveySortDropdown';
import SurveyorMoodMeter from '@/components/dashboard/SurveyorMoodMeter';
import CaptainsTip from '@/components/dashboard/CaptainsTip';
import FixedTravelTracker from '@/components/dashboard/FixedTravelTracker';
import FunModeSettings from '@/components/dashboard/FunModeSettings';
import { useIsMobile } from '@/hooks/use-mobile';
import { usePageTitle } from '@/hooks/usePageTitle';
import { 
  sortSurveys, 
  getSortFromQuery, 
  getSavedSortPreference, 
  saveSortPreference,
  SortOption 
} from '@/utils/surveySorting';

const Dashboard = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { surveys, loading, isOnline, refreshSurveys } = useSurveys();
  const isMobile = useIsMobile();
  const [showSettings, setShowSettings] = useState(false);

  // Set page title
  usePageTitle({ pageType: 'dashboard' });

  // Initialize sort preference - default to nearest date first
  const [sortBy, setSortBy] = useState<SortOption>(() => {
    const querySort = getSortFromQuery(searchParams);
    if (querySort !== 'upcoming_first') {
      return querySort;
    }
    return getSavedSortPreference();
  });

  // Sort surveys based on current sort option
  const sortedSurveys = useMemo(() => {
    return sortSurveys(surveys, sortBy);
  }, [surveys, sortBy]);

  // Handle sort change
  const handleSortChange = (newSortBy: SortOption) => {
    setSortBy(newSortBy);
    saveSortPreference(newSortBy);

    // Update URL params for developer testing
    if (newSortBy !== 'upcoming_first') {
      searchParams.set('sort', newSortBy);
    } else {
      searchParams.delete('sort');
    }
    setSearchParams(searchParams);
  };

  // Update sort when URL changes (for developer testing)
  useEffect(() => {
    const querySort = getSortFromQuery(searchParams);
    if (querySort !== sortBy) {
      setSortBy(querySort);
    }
  }, [searchParams, sortBy]);

  const handleCreateSurvey = () => {
    navigate('/new-survey');
  };

  const handleViewSurvey = (survey: any) => {
    navigate(`/survey/${survey.id}`);
  };

  const handleEditSurvey = (survey: any) => {
    navigate(`/survey/${survey.id}/edit`);
  };

  const handleDeleteSurvey = async () => {
    // Refresh the surveys list after deletion
    await refreshSurveys();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-6">
        <div className="container mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin h-8 w-8 border-2 border-blue-600 border-t-transparent rounded-full"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Surveyor Mood Meter */}
      <SurveyorMoodMeter surveys={sortedSurveys} />

      <div className="container mx-auto p-4 sm:p-6">
        {/* Header */}
        <div className="flex flex-col gap-4 mb-6 sm:mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 sm:gap-4">
              <Ship className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-blue-900">Survey Dashboard</h1>
                <p className="text-sm sm:text-base text-blue-600">Manage your marine surveys</p>
              </div>
            </div>
            <UserMenu />
          </div>
          
          {/* Mobile-optimized button layout */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 sm:gap-4">
              <SyncStatusIndicator />
            </div>
            
            <div className="flex flex-wrap gap-2 sm:gap-4">
              <Button 
                onClick={() => navigate('/analytics')} 
                variant="outline" 
                size={isMobile ? "sm" : "default"}
                className="flex-1 sm:flex-none"
              >
                <TrendingUp className="h-4 w-4 mr-1 sm:mr-2" />
                {isMobile ? 'Analytics' : 'Analytics'}
              </Button>
              <Button 
                onClick={() => navigate('/projects')} 
                variant="outline"
                size={isMobile ? "sm" : "default"}
                className="flex-1 sm:flex-none"
              >
                <Ship className="h-4 w-4 mr-1 sm:mr-2" />
                {isMobile ? 'Projects' : 'Projects'}
              </Button>
              <Button 
                onClick={() => navigate('/dev')} 
                variant="outline" 
                size="sm"
                className="flex-1 sm:flex-none"
              >
                <Settings className="h-4 w-4 mr-1 sm:mr-2" />
                {isMobile ? 'Dev' : 'Diagnostics'}
              </Button>
              <Button 
                onClick={() => setShowSettings(!showSettings)} 
                variant="outline" 
                size="sm"
                className="flex-1 sm:flex-none"
              >
                <Settings className="h-4 w-4 mr-1 sm:mr-2" />
                Settings
              </Button>
              <Button 
                onClick={handleCreateSurvey} 
                className="bg-blue-600 hover:bg-blue-700 flex-1 sm:flex-none"
                size={isMobile ? "sm" : "default"}
              >
                <Plus className="h-4 w-4 mr-1 sm:mr-2" />
                {isMobile ? 'New' : 'New Survey'}
              </Button>
            </div>
          </div>
        </div>

        {/* Sync Status Banner */}
        <SyncStatusBanner />

        {/* Captain's Tip */}
        <CaptainsTip />

        {/* Fun Mode Settings */}
        {showSettings && (
          <div className="mb-6">
            <FunModeSettings />
          </div>
        )}

        {/* Sort Controls */}
        {surveys.length > 0 && (
          <div className="flex justify-between items-center mb-6">
            <div className="text-sm text-gray-600">
              {sortedSurveys.length} survey{sortedSurveys.length !== 1 ? 's' : ''} found
            </div>
            <SurveySortDropdown value={sortBy} onChange={handleSortChange} />
          </div>
        )}

        {/* Surveys Grid */}
        {sortedSurveys.length === 0 ? (
          <Card className="border-dashed border-2 border-blue-200">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Ship className="h-16 w-16 text-blue-300 mb-4" />
              <h3 className="text-xl font-semibold text-blue-900 mb-2">No surveys yet</h3>
              <p className="text-blue-600 text-center mb-6 max-w-md">
                Create your first marine survey to get started with inspection management.
              </p>
              <Button onClick={handleCreateSurvey} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Create First Survey
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedSurveys.map((survey) => (
              <SurveyCard
                key={survey.id}
                survey={survey}
                isOnline={isOnline}
                onView={handleViewSurvey}
                onEdit={handleEditSurvey}
                onDelete={handleDeleteSurvey}
              />
            ))}
          </div>
        )}

        {/* Stats Cards */}
        {sortedSurveys.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Total Surveys</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-900">{sortedSurveys.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Completed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {sortedSurveys.filter(s => s.status === 'completed').length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">In Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {sortedSurveys.filter(s => s.status === 'in-progress').length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Pending Sync</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">
                  {sortedSurveys.filter(s => 'needs_sync' in s && s.needs_sync).length}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Fixed Travel Tracker */}
        <FixedTravelTracker surveys={sortedSurveys} />
      </div>
    </div>
  );
};

export default Dashboard;
