
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';
import { Survey } from '@/types/survey';

interface SurveyCompletionRadarProps {
  surveys: Survey[];
}

const SurveyCompletionRadar = ({ surveys }: SurveyCompletionRadarProps) => {
  // Calculate completion percentages for each tab/section
  const calculateCompletionData = () => {
    if (surveys.length === 0) return [];
    
    // Mock completion percentages based on survey status
    const getCompletionForStatus = (status: string) => {
      switch (status) {
        case 'completed': return { checklist: 100, estimator: 100, notes: 90, travel: 95, media: 85 };
        case 'in-progress': return { checklist: 60, estimator: 45, notes: 70, travel: 80, media: 40 };
        case 'draft': return { checklist: 15, estimator: 10, notes: 25, travel: 60, media: 5 };
        default: return { checklist: 0, estimator: 0, notes: 0, travel: 0, media: 0 };
      }
    };
    
    // Calculate averages across all surveys
    const totals = { checklist: 0, estimator: 0, notes: 0, travel: 0, media: 0 };
    
    surveys.forEach(survey => {
      const completion = getCompletionForStatus(survey.status);
      Object.keys(totals).forEach(key => {
        totals[key as keyof typeof totals] += completion[key as keyof typeof completion];
      });
    });
    
    return [
      { subject: 'Checklist', A: Math.round(totals.checklist / surveys.length), fullMark: 100 },
      { subject: 'Estimator', A: Math.round(totals.estimator / surveys.length), fullMark: 100 },
      { subject: 'Notes', A: Math.round(totals.notes / surveys.length), fullMark: 100 },
      { subject: 'Travel', A: Math.round(totals.travel / surveys.length), fullMark: 100 },
      { subject: 'Media', A: Math.round(totals.media / surveys.length), fullMark: 100 },
    ];
  };

  const data = calculateCompletionData();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Completion by Section
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <RadarChart data={data}>
            <PolarGrid />
            <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12 }} />
            <PolarRadiusAxis 
              angle={90} 
              domain={[0, 100]} 
              tick={{ fontSize: 10 }}
              tickCount={5}
            />
            <Radar
              name="Completion %"
              dataKey="A"
              stroke="#3b82f6"
              fill="#3b82f6"
              fillOpacity={0.3}
              strokeWidth={2}
            />
          </RadarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default SurveyCompletionRadar;
