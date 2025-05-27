
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import MainHeader from '@/components/MainHeader';
import { usePageTitle } from '@/hooks/usePageTitle';
import { useSurveys } from '@/hooks/useSurveys';
import { useSurveyZones } from '@/hooks/useSurveyZones';
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
  Plane,
  Users,
  Ship,
  Calendar,
  Building,
  Eye,
  TrendingUp,
  Clock
} from 'lucide-react';

interface AIInsight {
  type: 'warning' | 'info' | 'success' | 'critical';
  title: string;
  description: string;
  category: 'checklist' | 'estimator' | 'priority' | 'travel' | 'media' | 'general';
  count?: number;
  icon: React.ReactNode;
}

interface SurveyAnalysis {
  executiveSummary: string;
  insights: AIInsight[];
  completeness: {
    checklist: number;
    estimator: number;
    priority: number;
    travel: number;
    media: number;
    overall: number;
  };
  recommendations: string[];
  readyForExport: boolean;
  lastAnalyzed: string;
}

interface CommonQuestion {
  question: string;
  answer: string;
  type: 'positive' | 'warning' | 'neutral';
}

const AIAssistant = () => {
  usePageTitle({ title: 'AI Assistant' });
  
  const [analysis, setAnalysis] = useState<SurveyAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [autoAnalysis, setAutoAnalysis] = useState(true);
  const [selectedSurveyId, setSelectedSurveyId] = useState<string>('');
  const { surveys } = useSurveys();
  const { zones, notes } = useSurveyZones(selectedSurveyId);
  const { toast } = useToast();

  // Automatically select the first survey if available
  useEffect(() => {
    if (surveys.length > 0 && !selectedSurveyId) {
      setSelectedSurveyId(surveys[0].id);
    }
  }, [surveys, selectedSurveyId]);

  // Auto-analyze when survey is selected
  useEffect(() => {
    if (selectedSurveyId && autoAnalysis) {
      runAnalysis();
    }
  }, [selectedSurveyId, autoAnalysis]);

  const getInsightIcon = (category: string) => {
    switch (category) {
      case 'checklist': return <CheckCircle className="h-5 w-5" />;
      case 'estimator': return <FileText className="h-5 w-5" />;
      case 'priority': return <Zap className="h-5 w-5" />;
      case 'travel': return <Plane className="h-5 w-5" />;
      case 'media': return <Camera className="h-5 w-5" />;
      default: return <Info className="h-5 w-5" />;
    }
  };

  const generateExecutiveSummary = (survey: any): string => {
    const surveyorNames = survey.custom_fields?.kam || 'Field Surveyor';
    const companyName = survey.client_name || 'Client';
    const shipName = survey.ship_name || 'Vessel';
    const location = survey.survey_location || 'Survey Location';
    const surveyDate = new Date(survey.survey_date).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    const scope = survey.project_scope || 'comprehensive vessel assessment';

    return `This survey was conducted by **${surveyorNames}** for **${companyName}** aboard the **${shipName}** at **${location}** on **${surveyDate}**. The project scope involved ${scope.toLowerCase()}.`;
  };

  const analyzeCompletenessLocally = (survey: any) => {
    // Simulate checklist analysis
    const checklistProgress = survey.status === 'completed' ? 95 : 
                             survey.status === 'in-progress' ? 65 : 15;

    // Simulate estimator analysis
    const estimatorProgress = survey.status === 'completed' ? 88 : 
                             survey.status === 'in-progress' ? 45 : 8;

    // Simulate priority analysis
    const priorityProgress = survey.status === 'completed' ? 92 : 
                            survey.status === 'in-progress' ? 30 : 0;

    // Travel completeness based on flight and hotel details
    const hasFlightDetails = Object.keys(survey.flight_details || {}).length > 0;
    const hasHotelDetails = Object.keys(survey.hotel_details || {}).length > 0;
    const travelProgress = (hasFlightDetails && hasHotelDetails) ? 100 : hasFlightDetails || hasHotelDetails ? 50 : 0;

    // Media analysis based on zones
    const mediaProgress = zones.length > 0 ? Math.min(zones.length * 15, 100) : 0;

    const overall = Math.round((checklistProgress + estimatorProgress + priorityProgress + travelProgress + mediaProgress) / 5);

    return {
      checklist: checklistProgress,
      estimator: estimatorProgress,
      priority: priorityProgress,
      travel: travelProgress,
      media: mediaProgress,
      overall
    };
  };

  const generateInsights = (survey: any, completeness: any): AIInsight[] => {
    const insights: AIInsight[] = [];

    // Checklist insights
    if (completeness.checklist < 50) {
      insights.push({
        type: 'warning',
        title: 'Checklist Incomplete',
        description: `${Math.round((100 - completeness.checklist) / 10)} categories need attention`,
        category: 'checklist',
        count: Math.round((100 - completeness.checklist) / 10),
        icon: <CheckCircle className="h-5 w-5 text-yellow-600" />
      });
    }

    // Media insights
    const expectedZones = survey.status === 'completed' ? 8 : 5;
    if (zones.length < expectedZones) {
      insights.push({
        type: 'warning',
        title: 'Missing Zone Documentation',
        description: `${expectedZones - zones.length} zones missing media or notes`,
        category: 'media',
        count: expectedZones - zones.length,
        icon: <Camera className="h-5 w-5 text-orange-600" />
      });
    }

    // Priority insights
    if (completeness.priority < 30) {
      insights.push({
        type: 'critical',
        title: 'No Priority Review Items',
        description: 'Priority assessment not started',
        category: 'priority',
        icon: <Zap className="h-5 w-5 text-red-600" />
      });
    }

    // Travel insights
    if (completeness.travel < 100) {
      insights.push({
        type: 'info',
        title: 'Travel Details Incomplete',
        description: 'Flight or hotel information missing',
        category: 'travel',
        icon: <Plane className="h-5 w-5 text-blue-600" />
      });
    }

    // Estimator insights
    if (completeness.estimator < 50) {
      insights.push({
        type: 'warning',
        title: 'Estimator Data Missing',
        description: `${Math.round((100 - completeness.estimator) / 20)} categories lack dimensions`,
        category: 'estimator',
        count: Math.round((100 - completeness.estimator) / 20),
        icon: <FileText className="h-5 w-5 text-purple-600" />
      });
    }

    // Success insights
    if (completeness.overall > 80) {
      insights.push({
        type: 'success',
        title: 'Survey Nearly Complete',
        description: 'Ready for final review and export',
        category: 'general',
        icon: <CheckCircle className="h-5 w-5 text-green-600" />
      });
    }

    return insights;
  };

  const generateCommonQuestions = (survey: any, completeness: any): CommonQuestion[] => {
    const questions: CommonQuestion[] = [];

    questions.push({
      question: "What's incomplete?",
      answer: completeness.overall > 80 
        ? "Survey is mostly complete with minor items remaining"
        : `${Object.entries(completeness)
            .filter(([key, value]) => key !== 'overall' && (value as number) < 70)
            .map(([key]) => key.charAt(0).toUpperCase() + key.slice(1))
            .join(', ')} sections need attention`,
      type: completeness.overall > 80 ? 'positive' : 'warning'
    });

    questions.push({
      question: "Ready for export?",
      answer: completeness.overall > 85 && survey.status !== 'draft'
        ? "Yes, survey data is comprehensive enough for client delivery"
        : "Not yet - complete priority items and add missing documentation first",
      type: completeness.overall > 85 ? 'positive' : 'warning'
    });

    questions.push({
      question: "What's at risk?",
      answer: completeness.checklist < 50
        ? "Critical compliance items may be missed without checklist completion"
        : completeness.priority < 30
        ? "Client priorities not captured - survey value may be reduced"
        : "No significant risks identified",
      type: completeness.checklist < 50 || completeness.priority < 30 ? 'warning' : 'positive'
    });

    return questions;
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
      const selectedSurvey = surveys.find(s => s.id === selectedSurveyId);
      
      if (!selectedSurvey) {
        throw new Error('Survey not found');
      }

      // Generate executive summary
      const executiveSummary = generateExecutiveSummary(selectedSurvey);

      // Analyze completeness locally
      const completeness = analyzeCompletenessLocally(selectedSurvey);

      // Generate insights
      const insights = generateInsights(selectedSurvey, completeness);

      // Generate recommendations
      const recommendations = [
        completeness.checklist < 70 ? "Complete remaining checklist categories" : null,
        completeness.priority < 50 ? "Identify and document priority items" : null,
        zones.length < 5 ? "Add photos and notes for key vessel areas" : null,
        completeness.travel < 100 ? "Update travel arrangements" : null,
        completeness.overall > 80 ? "Review and finalize for client delivery" : null
      ].filter(Boolean) as string[];

      // Generate common questions
      const commonQuestions = generateCommonQuestions(selectedSurvey, completeness);

      setAnalysis({
        executiveSummary,
        insights,
        completeness,
        recommendations,
        readyForExport: completeness.overall > 85,
        lastAnalyzed: new Date().toISOString()
      });

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

  const selectedSurvey = surveys.find(s => s.id === selectedSurveyId);

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
            Intelligent insights and recommendations for your survey data
          </p>
        </div>

        {/* Survey Selection & Controls */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-blue-600" />
                Survey Analysis
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={autoAnalysis}
                    onCheckedChange={setAutoAnalysis}
                  />
                  <span className="text-sm text-gray-600">Auto-analyze</span>
                </div>
              </div>
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
                    Refresh Analysis
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {analysis && selectedSurvey && (
          <>
            {/* Executive Summary */}
            <Card className="mb-8 border-l-4 border-l-blue-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5 text-blue-600" />
                  Executive Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none">
                  <p className="text-gray-700 leading-relaxed" 
                     dangerouslySetInnerHTML={{ __html: analysis.executiveSummary.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                </div>
                <div className="flex items-center gap-4 mt-4 pt-4 border-t">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-gray-600">Overall Progress: {analysis.completeness.overall}%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-600" />
                    <span className="text-sm text-gray-600">
                      Last analyzed: {new Date(analysis.lastAnalyzed).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Analysis Tabs */}
            <Tabs defaultValue="insights" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="insights">Smart Insights</TabsTrigger>
                <TabsTrigger value="completeness">Completeness</TabsTrigger>
                <TabsTrigger value="questions">Common Questions</TabsTrigger>
              </TabsList>

              <TabsContent value="insights" className="space-y-4">
                {analysis.insights.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {analysis.insights.map((insight, index) => (
                      <Card key={index} className={`border-l-4 ${
                        insight.type === 'critical' ? 'border-l-red-500' :
                        insight.type === 'warning' ? 'border-l-yellow-500' :
                        insight.type === 'success' ? 'border-l-green-500' :
                        'border-l-blue-500'
                      }`}>
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div className={`p-2 rounded-lg ${
                              insight.type === 'critical' ? 'bg-red-50' :
                              insight.type === 'warning' ? 'bg-yellow-50' :
                              insight.type === 'success' ? 'bg-green-50' :
                              'bg-blue-50'
                            }`}>
                              {insight.icon}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-semibold text-gray-900">{insight.title}</h4>
                                {insight.count && (
                                  <Badge variant={getInsightVariant(insight.type)} className="text-xs">
                                    {insight.count}
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-gray-600">{insight.description}</p>
                              <Badge variant="outline" className="text-xs mt-2 capitalize">
                                {insight.category}
                              </Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="text-center py-8">
                      <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No Issues Found</h3>
                      <p className="text-gray-600">Your survey data looks comprehensive!</p>
                    </CardContent>
                  </Card>
                )}

                {/* Recommendations */}
                {analysis.recommendations.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Recommendations</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {analysis.recommendations.map((recommendation, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
                            <span className="text-sm text-gray-700">{recommendation}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="completeness" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Object.entries(analysis.completeness).map(([category, percentage]) => {
                    if (category === 'overall') return null;
                    return (
                      <Card key={category}>
                        <CardContent className="p-6">
                          <div className="flex items-center gap-3 mb-4">
                            {getInsightIcon(category)}
                            <h3 className="font-semibold capitalize">{category}</h3>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Progress</span>
                              <span className="font-medium">{percentage}%</span>
                            </div>
                            <Progress value={percentage} className="h-2" />
                            <p className="text-xs text-gray-600">
                              {percentage > 80 ? 'Excellent' : 
                               percentage > 60 ? 'Good progress' :
                               percentage > 30 ? 'Needs attention' : 'Just getting started'}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                {/* Overall Progress */}
                <Card className="border-2 border-blue-200">
                  <CardContent className="p-6">
                    <div className="text-center">
                      <h3 className="text-2xl font-bold text-blue-600 mb-2">
                        {analysis.completeness.overall}%
                      </h3>
                      <p className="text-gray-600 mb-4">Overall Completion</p>
                      <Progress value={analysis.completeness.overall} className="h-3 mb-4" />
                      <Badge variant={analysis.readyForExport ? "default" : "secondary"} className="text-sm">
                        {analysis.readyForExport ? "Ready for Export" : "In Progress"}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="questions" className="space-y-4">
                <div className="space-y-4">
                  {generateCommonQuestions(selectedSurvey, analysis.completeness).map((qa, index) => (
                    <Card key={index}>
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className={`p-2 rounded-lg shrink-0 ${
                            qa.type === 'positive' ? 'bg-green-50' :
                            qa.type === 'warning' ? 'bg-yellow-50' :
                            'bg-blue-50'
                          }`}>
                            {qa.type === 'positive' ? (
                              <CheckCircle className="h-5 w-5 text-green-600" />
                            ) : qa.type === 'warning' ? (
                              <AlertTriangle className="h-5 w-5 text-yellow-600" />
                            ) : (
                              <Info className="h-5 w-5 text-blue-600" />
                            )}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 mb-2">{qa.question}</h4>
                            <p className="text-gray-700">{qa.answer}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </>
        )}

        {/* Empty State */}
        {!analysis && (
          <Card>
            <CardContent className="text-center py-12">
              <Brain className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Analysis Ready</h3>
              <p className="text-gray-600 mb-6">
                Select a survey and the AI will automatically analyze data quality, 
                completeness, and provide recommendations for improvement.
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
