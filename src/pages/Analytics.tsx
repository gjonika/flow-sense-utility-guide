
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSurveys } from '@/hooks/useSurveys';
import { Ship, Users, MapPin, CheckCircle } from 'lucide-react';
import MainHeader from '@/components/MainHeader';
import ChecklistProgressCard from '@/components/analytics/ChecklistProgressCard';
import PriorityReviewCard from '@/components/analytics/PriorityReviewCard';
import MediaCountCard from '@/components/analytics/MediaCountCard';
import SurveyorActivityCard from '@/components/analytics/SurveyorActivityCard';
import SurveyTimelineChart from '@/components/analytics/SurveyTimelineChart';
import SurveyCompletionRadar from '@/components/analytics/SurveyCompletionRadar';

const Analytics = () => {
  const { surveys } = useSurveys();

  const totalSurveys = surveys.length;
  const completedSurveys = surveys.filter(s => s.status === 'completed').length;
  const inProgressSurveys = surveys.filter(s => s.status === 'in-progress').length;
  
  // Fixed: Use survey_location instead of client_country for actual survey locations
  const uniqueLocations = new Set(surveys.map(s => s.survey_location).filter(Boolean)).size;
  
  // Extract countries from survey_location (assumes format like "Port of Miami, Florida, USA")
  const extractCountryFromLocation = (location: string): string => {
    if (!location) return '';
    const parts = location.split(',');
    return parts.length > 0 ? parts[parts.length - 1].trim() : location;
  };
  
  const surveyCountries = surveys
    .map(s => extractCountryFromLocation(s.survey_location))
    .filter(Boolean);
  
  const uniqueCountries = new Set(surveyCountries).size;

  return (
    <div className="min-h-screen bg-gray-50">
      <MainHeader />
      
      <div className="container mx-auto px-4 sm:px-6 py-6">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
          <p className="text-gray-600">Survey performance and insights</p>
        </div>

        {/* Overview Cards - Updated with new metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Surveys</CardTitle>
              <Ship className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalSurveys}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{completedSurveys}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{inProgressSurveys}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Survey Locations</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{uniqueLocations}</div>
              <p className="text-xs text-muted-foreground">{uniqueCountries} countries</p>
            </CardContent>
          </Card>
        </div>

        {/* New Insight Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <ChecklistProgressCard surveys={surveys} />
          <PriorityReviewCard surveys={surveys} />
          <MediaCountCard surveys={surveys} />
          <SurveyorActivityCard surveys={surveys} />
        </div>

        {/* Visual Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <SurveyTimelineChart surveys={surveys} />
          <SurveyCompletionRadar surveys={surveys} />
        </div>

        {/* Status Distribution and Recent Surveys */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Status Distribution</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Completed</span>
                <span className="text-sm text-muted-foreground">{completedSurveys}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">In Progress</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                  <span className="text-sm text-muted-foreground">{inProgressSurveys}</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Draft</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div className="bg-gray-400 h-2 rounded-full" style={{ width: '40%' }}></div>
                  </div>
                  <span className="text-sm text-muted-foreground">{surveys.filter(s => s.status === 'draft').length}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Surveys</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {surveys.slice(0, 5).map((survey) => (
                  <div key={survey.id} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{survey.ship_name || 'Unnamed Ship'}</p>
                      <p className="text-sm text-muted-foreground">{survey.survey_location || 'Unknown Location'}</p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                        survey.status === 'completed' ? 'bg-green-100 text-green-800' :
                        survey.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {survey.status}
                      </span>
                      <p className="text-sm text-muted-foreground mt-1">
                        {survey.survey_date ? new Date(survey.survey_date).toLocaleDateString() : 'No date'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Fixed Survey Locations - now using actual survey locations */}
        <Card>
          <CardHeader>
            <CardTitle>Survey Locations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Array.from(new Set(surveyCountries)).map((country) => {
                const countryCount = surveyCountries.filter(c => c === country).length;
                return (
                  <div key={country} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{country}</span>
                    </div>
                    <span className="text-sm font-medium">{countryCount}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Sync Status */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Sync Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Synced</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-green-600">{surveys.filter(s => !('needs_sync' in s) || !s.needs_sync).length}</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Pending Sync</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-orange-600">{surveys.filter(s => 'needs_sync' in s && s.needs_sync).length}</span>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: '100%' }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
