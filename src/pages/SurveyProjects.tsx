import React, { useState, useMemo } from 'react';
import { useSurveys } from '@/hooks/useSurveys';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { DashboardLoadingState } from '@/components/LoadingState';
import MainHeader from '@/components/MainHeader';
import { usePageTitle } from '@/hooks/usePageTitle';
import ProjectFilters from '@/components/projects/ProjectFilters';
import ProjectTimeline from '@/components/projects/ProjectTimeline';
import EnhancedProjectCard from '@/components/projects/EnhancedProjectCard';

const SurveyProjects = () => {
  const { surveys, loading, isOnline, deleteSurvey } = useSurveys();
  const navigate = useNavigate();

  // Filter and sort states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const [clientFilter, setClientFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date-desc');

  // Set page title
  usePageTitle({ title: 'Survey Projects' });

  // Filter and sort surveys
  const filteredAndSortedSurveys = useMemo(() => {
    let filtered = surveys.filter(survey => {
      const matchesSearch = !searchTerm || 
        survey.ship_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        survey.client_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        survey.survey_location?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || survey.status === statusFilter;
      const matchesLocation = locationFilter === 'all' || survey.survey_location === locationFilter;
      const matchesClient = clientFilter === 'all' || survey.client_name === clientFilter;

      return matchesSearch && matchesStatus && matchesLocation && matchesClient;
    });

    // Sort surveys
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date-asc':
          return new Date(a.survey_date).getTime() - new Date(b.survey_date).getTime();
        case 'date-desc':
          return new Date(b.survey_date).getTime() - new Date(a.survey_date).getTime();
        case 'status':
          return a.status.localeCompare(b.status);
        case 'client':
          return (a.client_name || '').localeCompare(b.client_name || '');
        case 'location':
          return (a.survey_location || '').localeCompare(b.survey_location || '');
        default:
          return 0;
      }
    });
  }, [surveys, searchTerm, statusFilter, locationFilter, clientFilter, sortBy]);

  const handleEditSurvey = (survey: any) => {
    navigate(`/survey/${survey.id}/edit`);
  };

  const handleViewSurvey = (survey: any) => {
    navigate(`/survey/${survey.id}`);
  };

  const handleViewAnalytics = (survey: any) => {
    navigate('/analytics', { state: { selectedSurvey: survey.id } });
  };

  const handleDeleteSurvey = async (surveyId: string) => {
    if (window.confirm('Are you sure you want to delete this survey?')) {
      try {
        await deleteSurvey(surveyId);
      } catch (error) {
        console.error('Failed to delete survey:', error);
      }
    }
  };

  if (loading) {
    return <DashboardLoadingState />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <MainHeader />
      
      <div className="container mx-auto px-4 sm:px-6 py-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Survey Projects</h1>
            <p className="text-gray-600">
              Manage and organize your marine survey projects
              {filteredAndSortedSurveys.length !== surveys.length && (
                <span className="ml-2 text-sm">
                  ({filteredAndSortedSurveys.length} of {surveys.length} shown)
                </span>
              )}
            </p>
          </div>
          <Button 
            onClick={() => navigate('/new-survey')}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Survey
          </Button>
        </div>

        {surveys.length === 0 ? (
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No surveys found</h3>
            <p className="text-gray-600 mb-6">Create your first survey to get started.</p>
            <Button 
              onClick={() => navigate('/new-survey')}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create First Survey
            </Button>
          </div>
        ) : (
          <>
            {/* Filters */}
            <ProjectFilters
              surveys={surveys}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              locationFilter={locationFilter}
              setLocationFilter={setLocationFilter}
              clientFilter={clientFilter}
              setClientFilter={setClientFilter}
              sortBy={sortBy}
              setSortBy={setSortBy}
            />

            {/* Timeline View */}
            {filteredAndSortedSurveys.length > 0 && (
              <ProjectTimeline surveys={filteredAndSortedSurveys} />
            )}

            {/* Project Cards */}
            {filteredAndSortedSurveys.length === 0 ? (
              <div className="text-center py-16">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No projects match your filters</h3>
                <p className="text-gray-600 mb-6">Try adjusting your search criteria or filters.</p>
                <Button 
                  variant="outline"
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('all');
                    setLocationFilter('all');
                    setClientFilter('all');
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredAndSortedSurveys.map((survey) => (
                  <EnhancedProjectCard
                    key={survey.id}
                    survey={survey}
                    isOnline={isOnline}
                    onView={handleViewSurvey}
                    onEdit={handleEditSurvey}
                    onViewAnalytics={handleViewAnalytics}
                    onDelete={() => handleDeleteSurvey(survey.id)}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SurveyProjects;
