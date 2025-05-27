
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileImage } from 'lucide-react';
import { Survey } from '@/types/survey';

interface MediaCountCardProps {
  surveys: Survey[];
}

const MediaCountCard = ({ surveys }: MediaCountCardProps) => {
  // Calculate average photos per survey
  // Mock calculation - in real implementation, would query survey_media table
  const calculateMediaStats = () => {
    if (surveys.length === 0) return { total: 0, average: 0 };
    
    // Mock: assume 3-8 photos per survey based on status
    const totalPhotos = surveys.reduce((total, survey) => {
      switch (survey.status) {
        case 'completed': return total + Math.floor(Math.random() * 6) + 5; // 5-10 photos
        case 'in-progress': return total + Math.floor(Math.random() * 4) + 2; // 2-5 photos
        case 'draft': return total + Math.floor(Math.random() * 2); // 0-1 photos
        default: return total;
      }
    }, 0);
    
    return {
      total: totalPhotos,
      average: Math.round(totalPhotos / surveys.length)
    };
  };

  const { total, average } = calculateMediaStats();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Photos per Survey</CardTitle>
        <FileImage className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{average}</div>
        <p className="text-xs text-muted-foreground">
          {total} total photos across {surveys.length} surveys
        </p>
        <div className="mt-2">
          <div className="text-xs text-gray-600">
            Avg: {average} photos/survey
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MediaCountCard;
