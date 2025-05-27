
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { 
  RefreshCw, 
  Trash2, 
  Upload, 
  Download, 
  AlertCircle, 
  CheckCircle, 
  Clock,
  Database,
  Wifi,
  WifiOff
} from 'lucide-react';
import { useSyncQueue } from '@/hooks/useSyncQueue';
import { useLocalSurveys } from '@/hooks/useLocalSurveys';
import { validationService } from '@/services/validationService';
import { useToast } from '@/hooks/use-toast';

const EnhancedDevPanel = () => {
  const [syncLog, setSyncLog] = useState<any[]>([]);
  const [loadingLog, setLoadingLog] = useState(true);
  const [validationResults, setValidationResults] = useState<any[]>([]);
  const [validating, setValidating] = useState(false);
  
  const { 
    syncing, 
    isOnline, 
    queuedItems, 
    failedSurveys, 
    errorSurveys,
    syncAllPending,
    forceSyncAll 
  } = useSyncQueue();
  
  const { localSurveys, refetch: refreshLocalSurveys } = useLocalSurveys();
  const { toast } = useToast();

  // Load sync log (placeholder for online-only mode)
  const loadSyncLog = async () => {
    setLoadingLog(true);
    try {
      console.log('[EnhancedDevPanel] Sync log not available in online-only mode');
      setSyncLog([]);
    } catch (error) {
      console.error('Failed to load sync log:', error);
    } finally {
      setLoadingLog(false);
    }
  };

  // Validate all local surveys
  const validateAllSurveys = async () => {
    setValidating(true);
    try {
      const results = localSurveys.map(survey => {
        const validation = validationService.validateSurveyStructure(survey);
        return {
          surveyId: survey.id,
          shipName: survey.ship_name,
          validation
        };
      });
      setValidationResults(results);
    } catch (error) {
      console.error('Validation failed:', error);
      toast({
        title: "Validation Error",
        description: "Failed to validate surveys",
        variant: "destructive",
      });
    } finally {
      setValidating(false);
    }
  };

  // Clear sync log (placeholder for online-only mode)
  const clearLog = async () => {
    try {
      setSyncLog([]);
      toast({
        title: "Log Cleared",
        description: "Sync log has been cleared",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to clear log",
        variant: "destructive",
      });
    }
  };

  // Repair corrupted survey
  const repairSurvey = async (surveyId: string) => {
    try {
      const survey = localSurveys.find(s => s.id === surveyId);
      if (!survey) return;

      const repaired = validationService.repairSurveyStructure(survey);
      const withChecklist = validationService.ensureChecklistTemplate(repaired as any);
      
      // Save repaired survey online
      await import('@/services/surveyStorageService').then(s => 
        s.surveyStorageService.saveOnline(withChecklist, surveyId)
      );
      
      await refreshLocalSurveys();
      await validateAllSurveys();
      
      toast({
        title: "Survey Repaired",
        description: `Survey ${survey.ship_name} has been repaired`,
      });
    } catch (error) {
      toast({
        title: "Repair Failed",
        description: "Failed to repair survey",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    loadSyncLog();
    validateAllSurveys();
  }, [localSurveys]);

  const getSyncStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600';
      case 'error': return 'text-red-600';
      case 'partial': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  const getValidationStatusColor = (canSync: boolean, hasErrors: boolean) => {
    if (!canSync || hasErrors) return 'text-red-600';
    return 'text-green-600';
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-blue-700">Developer Panel</h1>
        <div className="flex items-center gap-2">
          {isOnline ? (
            <Badge className="bg-green-100 text-green-800 border-green-300">
              <Wifi className="h-3 w-3 mr-1" />
              Online
            </Badge>
          ) : (
            <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
              <WifiOff className="h-3 w-3 mr-1" />
              Offline
            </Badge>
          )}
        </div>
      </div>

      {/* Sync Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Online Surveys</p>
                <p className="text-xl font-bold">{localSurveys.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-sm text-gray-600">Queued</p>
                <p className="text-xl font-bold">{queuedItems.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-sm text-gray-600">Failed</p>
                <p className="text-xl font-bold">{failedSurveys.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <RefreshCw className={`h-5 w-5 ${syncing ? 'animate-spin text-blue-600' : 'text-gray-400'}`} />
              <div>
                <p className="text-sm text-gray-600">Syncing</p>
                <p className="text-xl font-bold">{syncing ? 'Yes' : 'No'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sync Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Sync Controls</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button 
              onClick={syncAllPending}
              disabled={!isOnline || syncing}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${syncing ? 'animate-spin' : ''}`} />
              Sync Pending
            </Button>
            
            <Button 
              onClick={forceSyncAll}
              disabled={!isOnline || syncing}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              Force Upload All
            </Button>
            
            <Button 
              onClick={refreshLocalSurveys}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Refresh Online
            </Button>
            
            <Button 
              onClick={validateAllSurveys}
              disabled={validating}
              variant="outline"
              className="flex items-center gap-2"
            >
              <CheckCircle className="h-4 w-4" />
              Validate All
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Survey Validation Results */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Survey Validation
            {validating && <RefreshCw className="h-4 w-4 animate-spin" />}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {validationResults.length > 0 ? (
            <div className="space-y-3">
              {validationResults.map((result, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <p className="font-medium">{result.shipName || 'Unnamed Survey'}</p>
                    <p className="text-sm text-gray-600">ID: {result.surveyId}</p>
                    <div className="flex items-center gap-4 mt-1">
                      <span className={`text-sm ${getValidationStatusColor(result.validation.canSync, result.validation.errors.length > 0)}`}>
                        {result.validation.canSync ? 'Can Sync' : 'Cannot Sync'}
                      </span>
                      {result.validation.errors.length > 0 && (
                        <span className="text-sm text-red-600">
                          {result.validation.errors.length} error(s)
                        </span>
                      )}
                      {result.validation.warnings.length > 0 && (
                        <span className="text-sm text-yellow-600">
                          {result.validation.warnings.length} warning(s)
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {result.validation.requiresRepair && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => repairSurvey(result.surveyId)}
                    >
                      Repair
                    </Button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No validation results available</p>
          )}
        </CardContent>
      </Card>

      {/* Sync Log */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Sync Log
            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant="outline" 
                onClick={loadSyncLog}
                disabled={loadingLog}
              >
                <RefreshCw className={`h-4 w-4 ${loadingLog ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={clearLog}
              >
                <Trash2 className="h-4 w-4" />
                Clear Log
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">Sync log not available in online-only mode</p>
        </CardContent>
      </Card>

      {/* Debug Information */}
      <Card>
        <CardHeader>
          <CardTitle>Debug Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm font-mono">
            <p><strong>Navigator Online:</strong> {navigator.onLine.toString()}</p>
            <p><strong>React Version:</strong> {React.version}</p>
            <p><strong>User Agent:</strong> {navigator.userAgent}</p>
            <p><strong>Storage Mode:</strong> Online Only</p>
            <p><strong>IndexedDB Available:</strong> {typeof indexedDB !== 'undefined' ? 'Yes' : 'No'}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedDevPanel;
