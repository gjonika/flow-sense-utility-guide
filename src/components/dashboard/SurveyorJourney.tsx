
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Globe, Anchor, Ship, Calendar } from 'lucide-react';
import { Survey } from '@/types/survey';

interface SurveyorJourneyProps {
  surveys: Survey[];
}

const SurveyorJourney = ({ surveys }: SurveyorJourneyProps) => {
  // Extract countries from survey locations (where surveys are conducted)
  const getSurveyCountries = () => {
    const countries = new Set<string>();
    
    surveys.forEach(survey => {
      if (survey.survey_location) {
        // Extract country from survey location (format: "Port, Country" or just "Country")
        const parts = survey.survey_location.split(',');
        const country = parts.length > 1 ? parts[parts.length - 1].trim() : survey.survey_location.trim();
        if (country) {
          countries.add(country);
        }
      }
    });
    
    return countries;
  };

  // Extract ports/shipyards from survey locations
  const getSurveyPorts = () => {
    const ports = new Set<string>();
    
    surveys.forEach(survey => {
      if (survey.survey_location) {
        const parts = survey.survey_location.split(',');
        const port = parts[0].trim();
        if (port) {
          ports.add(port);
        }
      }
    });
    
    return ports;
  };

  // Calculate analytics based on survey locations
  const surveyCountries = getSurveyCountries();
  const surveyPorts = getSurveyPorts();
  const uniqueVessels = new Set(surveys.map(s => s.ship_name).filter(Boolean));

  const longestSurvey = surveys.reduce((max, survey) => {
    const duration = survey.duration?.match(/\d+/)?.[0];
    const days = duration ? parseInt(duration) : 0;
    return days > max ? days : max;
  }, 0);

  const totalSurveys = surveys.length;

  // Fun milestones based on survey activities
  const getMilestoneText = () => {
    if (surveyCountries.size >= 10) return "🌍 Global Marine Inspector";
    if (surveyCountries.size >= 5) return "🗺️ International Surveyor";
    if (uniqueVessels.size >= 20) return "⚓ Fleet Admiral";
    if (uniqueVessels.size >= 10) return "🚢 Ship Captain";
    if (surveyPorts.size >= 15) return "🏆 Port Master";
    if (surveyPorts.size >= 8) return "🌊 Harbor Expert";
    if (totalSurveys >= 50) return "📋 Survey Master";
    if (totalSurveys >= 10) return "🔍 Survey Expert";
    if (totalSurveys >= 1) return "⭐ Survey Rookie";
    return "🆕 Getting Started";
  };

  const getNextMilestone = () => {
    if (surveyCountries.size < 5) return `${5 - surveyCountries.size} more countries to International Surveyor`;
    if (surveyCountries.size < 10) return `${10 - surveyCountries.size} more countries to Global Marine Inspector`;
    if (surveyPorts.size < 8) return `${8 - surveyPorts.size} more ports to Harbor Expert`;
    if (surveyPorts.size < 15) return `${15 - surveyPorts.size} more ports to Port Master`;
    if (uniqueVessels.size < 10) return `${10 - uniqueVessels.size} more vessels to Ship Captain`;
    if (uniqueVessels.size < 20) return `${20 - uniqueVessels.size} more vessels to Fleet Admiral`;
    if (totalSurveys < 10) return `${10 - totalSurveys} more surveys to Survey Expert`;
    if (totalSurveys < 50) return `${50 - totalSurveys} more surveys to Survey Master`;
    return "All milestones achieved! 🎉";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-blue-700 flex items-center gap-2">
          <Globe className="h-5 w-5" />
          Surveyor Journey
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Current Level */}
          <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
            <div className="text-2xl mb-2">{getMilestoneText()}</div>
            <div className="text-sm text-gray-600">{getNextMilestone()}</div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <Globe className="h-6 w-6 mx-auto mb-2 text-green-600" />
              <div className="text-xl font-bold">{surveyCountries.size}</div>
              <div className="text-xs text-gray-600">Countries Surveyed</div>
            </div>
            
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <Anchor className="h-6 w-6 mx-auto mb-2 text-blue-600" />
              <div className="text-xl font-bold">{surveyPorts.size}</div>
              <div className="text-xs text-gray-600">Ports/Shipyards</div>
            </div>
            
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <Ship className="h-6 w-6 mx-auto mb-2 text-purple-600" />
              <div className="text-xl font-bold">{uniqueVessels.size}</div>
              <div className="text-xs text-gray-600">Vessels Inspected</div>
            </div>
            
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <Calendar className="h-6 w-6 mx-auto mb-2 text-orange-600" />
              <div className="text-xl font-bold">{longestSurvey}</div>
              <div className="text-xs text-gray-600">Longest Survey (days)</div>
            </div>
          </div>

          {/* Recent Achievements */}
          {totalSurveys > 0 && (
            <div>
              <h4 className="font-medium mb-2">Recent Achievements</h4>
              <div className="flex flex-wrap gap-2">
                {totalSurveys >= 1 && <Badge variant="secondary">First Survey Complete 🎯</Badge>}
                {surveyCountries.size >= 2 && <Badge variant="secondary">Multi-Country Inspector 🌏</Badge>}
                {uniqueVessels.size >= 5 && <Badge variant="secondary">Vessel Specialist ⚓</Badge>}
                {surveyPorts.size >= 3 && <Badge variant="secondary">Port Explorer 🌊</Badge>}
                {longestSurvey >= 7 && <Badge variant="secondary">Week-Long Warrior 📅</Badge>}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SurveyorJourney;
