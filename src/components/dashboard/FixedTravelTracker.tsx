import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Ship, Calendar, Globe } from 'lucide-react';

interface FixedTravelTrackerProps {
  surveys: any[];
}

const FixedTravelTracker = ({ surveys }: FixedTravelTrackerProps) => {
  const travelStats = useMemo(() => {
    const countries = new Set<string>();
    const shipyards = new Set<string>();
    const vessels = new Set<string>();
    let longestSurveyDays = 0;

    surveys.forEach(survey => {
      // Fix: Extract country from SURVEY LOCATION, not client country
      if (survey.survey_location) {
        // Parse survey location to extract country
        const location = survey.survey_location;
        let country = '';
        
        // If location contains comma, assume format is "City, Country"
        if (location.includes(',')) {
          const parts = location.split(',');
          country = parts[parts.length - 1].trim();
        } else {
          // Otherwise, treat entire location as country/region
          country = location.trim();
        }
        
        if (country) {
          countries.add(country);
        }
      }
      
      // Shipyards from survey location (port/city level)
      if (survey.survey_location) {
        shipyards.add(survey.survey_location);
      }
      
      // Vessels from ship name
      if (survey.ship_name) {
        vessels.add(survey.ship_name);
      }
      
      // Calculate survey duration in days
      if (survey.duration) {
        const durationStr = survey.duration.toLowerCase();
        // Extract numbers from duration string
        const numbers = durationStr.match(/\d+/g);
        if (numbers && numbers.length > 0) {
          const days = parseInt(numbers[0]);
          if (days > longestSurveyDays) {
            longestSurveyDays = days;
          }
        }
      }
    });

    return {
      countries: countries.size,
      shipyards: shipyards.size,
      vessels: vessels.size,
      totalSurveys: surveys.length,
      longestSurvey: longestSurveyDays || 'N/A'
    };
  }, [surveys]);

  if (surveys.length === 0) return null;

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-900">
          <MapPin className="h-5 w-5" />
          Your Surveyor Journey
        </CardTitle>
        <p className="text-sm text-gray-600">Track your maritime inspection adventures by survey locations</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <Globe className="h-6 w-6 mx-auto mb-2 text-blue-600" />
            <div className="text-2xl font-bold text-blue-700">{travelStats.countries}</div>
            <div className="text-xs text-blue-600">Countries Surveyed</div>
          </div>
          
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <MapPin className="h-6 w-6 mx-auto mb-2 text-green-600" />
            <div className="text-2xl font-bold text-green-700">{travelStats.shipyards}</div>
            <div className="text-xs text-green-600">Ports & Shipyards</div>
          </div>
          
          <div className="bg-purple-50 rounded-lg p-4 text-center">
            <Ship className="h-6 w-6 mx-auto mb-2 text-purple-600" />
            <div className="text-2xl font-bold text-purple-700">{travelStats.vessels}</div>
            <div className="text-xs text-purple-600">Vessels Inspected</div>
          </div>
          
          <div className="bg-orange-50 rounded-lg p-4 text-center">
            <Calendar className="h-6 w-6 mx-auto mb-2 text-orange-600" />
            <div className="text-2xl font-bold text-orange-700">{travelStats.longestSurvey}</div>
            <div className="text-xs text-orange-600">Longest Survey (days)</div>
          </div>
        </div>
        
        <div className="mt-4 text-xs text-gray-500 text-center">
          * Countries based on survey boarding locations, not client headquarters
        </div>
      </CardContent>
    </Card>
  );
};

export default FixedTravelTracker;
