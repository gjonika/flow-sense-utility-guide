
import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Settings } from 'lucide-react';

interface MoodMeterProps {
  surveys: any[];
  onToggleSettings?: () => void;
}

const SurveyorMoodMeter = ({ surveys, onToggleSettings }: MoodMeterProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const showMoodMeter = localStorage.getItem('showMoodMeter');
    if (showMoodMeter === 'false') {
      setIsVisible(false);
    }
  }, []);

  if (!isVisible) return null;

  const totalSurveys = surveys.length;
  const completedSurveys = surveys.filter(s => s.status === 'completed').length;
  const progressPercentage = totalSurveys > 0 ? (completedSurveys / totalSurveys) * 100 : 0;

  const getMoodData = (percentage: number) => {
    if (percentage <= 10) return { text: "☕ Still waking up…", emoji: "🐌" };
    if (percentage <= 40) return { text: "Let's get this ship sorted", emoji: "🛠️" };
    if (percentage <= 70) return { text: "Cruising through it", emoji: "🚢" };
    if (percentage <= 90) return { text: "Almost drydock-ready!", emoji: "⚓" };
    return { text: "Captain approved.", emoji: "🧑‍✈️✅" };
  };

  const mood = getMoodData(progressPercentage);

  return (
    <div className="fixed top-4 right-4 z-50">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge 
              variant="secondary" 
              className="px-3 py-2 bg-blue-50 text-blue-700 border-blue-200 cursor-pointer hover:bg-blue-100 transition-colors"
            >
              <span className="mr-2">{mood.emoji}</span>
              {Math.round(progressPercentage)}%
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <div className="text-center">
              <p className="font-medium">{mood.text}</p>
              <p className="text-sm text-gray-600">
                {completedSurveys} of {totalSurveys} surveys completed
              </p>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default SurveyorMoodMeter;
