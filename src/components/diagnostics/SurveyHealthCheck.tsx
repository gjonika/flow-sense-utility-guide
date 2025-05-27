
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Survey } from '@/types/survey';

interface SurveyHealthCheckProps {
  surveys: Survey[];
}

const SurveyHealthCheck = ({ surveys }: SurveyHealthCheckProps) => {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Survey Health Check</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {surveys.map((survey) => (
            <div key={survey.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium">{survey.ship_name || 'Unnamed Ship'}</h3>
                <Badge variant={('needs_sync' in survey && survey.needs_sync) ? "destructive" : "default"}>
                  {('needs_sync' in survey && survey.needs_sync) ? 'Needs Sync' : 'Synced'}
                </Badge>
              </div>
              <p className="text-sm text-gray-600 mb-1">
                ID: {survey.id}
              </p>
              <p className="text-sm text-green-600">Ready to Sync</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SurveyHealthCheck;
