
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import MainHeader from '@/components/MainHeader';
import { usePageTitle } from '@/hooks/usePageTitle';
import { useSurveys } from '@/hooks/useSurveys';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  RefreshCw, 
  Brain,
  Zap,
  FileText,
  Camera,
  MapPin,
  Plane
} from 'lucide-react';

interface AIInsight {
  type: 'warning' | 'info' | 'success' | 'critical';
  title: string;
  description: string;
  category: 'checklist' | 'estimator' | 'priority' | 'travel' | 'media' | 'general';
}

interface AIAnalysis {
  summary: string;
  insights: AIInsight[];
  completeness: {
    checklist: number;
    estimator: number;
    priority: number;
    travel: number;
    media: number;
  };
  recommendations: string[];
  readyForExport: boolean;
}

const AIAssistant = () => {
  usePageTitle('AI Assistant');
  
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedSurveyId, setSelectedSurveyId] = useState<string>('');
  const { surveys } = useSurveys();
  const { toast } = useToast();

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'critical': return <AlertTriangle className="h-5 w-5 text-red-600" />;
      case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case 'success': return <CheckCircle className="h-5 w-5 text-green-600" />;
      default: return <Info className="h-5 w-5 text-blue-600" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'checklist': return <CheckCircle className="h-4 w-4" />;
      case 'estimator': return <FileText className="h-4 w-4" />;
      case 'priority': return <Zap className="h-4 w-4" />;
      case 'travel': return <Plane className="h-4 w-4" />;
      case 'media': return <Camera className="h-4 w-4" />;
      default: return <MapPin className="h-4 w-4" />;
    }
  };

  const runAnalysis = async () => {
    if (!selectedSurveyId) {
      toast({
        title: "No Survey Selected",
        description: "Please select a survey to analyze",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Get survey data - in a real implementation, you'd fetch comprehensive survey data
      const selectedSurvey = surveys.find(s => s.id === selectedSurveyId);
      
      if (!selectedSurvey) {
        throw new Error('Survey not found');
      }

      // Call the AI analysis edge function
      const { data, error } = await supabase.functions.invoke('survey-ai-analysis', {
        body: { 
          surveyData: {
            survey: selectedSurvey,
            // In a real implementation, you'd include:
            // checklist responses, assessment items, zones, notes, media, etc.
          }
        }
      });

      if (error) throw error;

      setAnalysis(data);
      toast({
        title: "Analysis Complete",
        description: "AI has analyzed your survey data",
      });
    } catch (error) {
      console.error('Analysis failed:', error);
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "Failed to analyze survey",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getInsightVariant = (type: string) => {
    switch (type) {
      case 'critical': return 'destructive';
      case 'warning': return 'secondary';
      case 'success': return 'default';
      default: return 'outline';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <MainHeader />
      
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Brain className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">AI Assistant</h1>
          </div>
          <p className="text-lg text-gray-600">
            Get intelligent insights and recommendations for your survey data
          </p>
        </div>

        {/* Survey Selection & Analysis Controls */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-blue-600" />
              Survey Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-2">Select Survey to Analyze</label>
                <select
                  value={selectedSurveyId}
                  onChange={(e) => setSelectedSurveyId(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md text-base"
                >
                  <option value="">Choose a survey...</option>
                  {surveys.map((survey) => (
                    <option key={survey.id} value={survey.id}>
                      {survey.ship_name} - {survey.client_name} ({new Date(survey.survey_date).toLocaleDateString()})
                    </option>
                  ))}
                </select>
              </div>
              <Button 
                onClick={runAnalysis} 
                disabled={loading || !selectedSurveyId}
                className="whitespace-nowrap"
              >
                {loading ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Run AI Analysis
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {analysis && (
          <>
            {/* Summary Card */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Analysis Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">{analysis.summary}</p>
                <div className="flex items-center gap-2">
                  <Badge variant={analysis.readyForExport ? "default" : "secondary"}>
                    {analysis.readyForExport ? "Ready for Export" : "Needs Attention"}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Completeness Overview */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Completeness Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  {Object.entries(analysis.completeness).map(([category, percentage]) => (
                    <div key={category} className="space-y-2">
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(category)}
                        <span className="text-sm font-medium capitalize">{category}</span>
                      </div>
                      <Progress value={percentage} className="h-2" />
                      <span className="text-xs text-gray-600">{percentage}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Insights */}
            {analysis.insights.length > 0 && (
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Key Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analysis.insights.map((insight, index) => (
                      <div key={index} className="flex gap-3 p-4 border rounded-lg">
                        {getInsightIcon(insight.type)}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-gray-900">{insight.title}</h4>
                            <Badge variant={getInsightVariant(insight.type)} className="text-xs">
                              {insight.category}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">{insight.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Recommendations */}
            {analysis.recommendations.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {analysis.recommendations.map((recommendation, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                        <span className="text-sm text-gray-700">{recommendation}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </>
        )}

        {/* Empty State */}
        {!analysis && (
          <Card>
            <CardContent className="text-center py-12">
              <Brain className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Analysis Ready</h3>
              <p className="text-gray-600 mb-6">
                Select a survey and run AI analysis to get intelligent insights about your data quality, 
                completeness, and recommendations for improvement.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-2xl mx-auto">
                <div className="text-center">
                  <CheckCircle className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-sm font-medium">Data Completeness</p>
                  <p className="text-xs text-gray-600">Check missing fields and sections</p>
                </div>
                <div className="text-center">
                  <AlertTriangle className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                  <p className="text-sm font-medium">Risk Assessment</p>
                  <p className="text-xs text-gray-600">Identify potential issues</p>
                </div>
                <div className="text-center">
                  <Zap className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <p className="text-sm font-medium">Smart Recommendations</p>
                  <p className="text-xs text-gray-600">Get actionable next steps</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AIAssistant;
