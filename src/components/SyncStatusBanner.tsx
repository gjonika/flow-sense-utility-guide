
import React from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, Wifi, WifiOff, RefreshCw, Upload } from "lucide-react";
import { useSyncQueue } from '@/hooks/useSyncQueue';
import { masterSyncService } from '@/services/masterSyncService';

const SyncStatusBanner = () => {
  const { 
    syncing, 
    isOnline, 
    failedSurveys, 
    queuedItems,
    syncAllPending,
    forceSyncAll 
  } = useSyncQueue();

  const progress = masterSyncService.getCurrentProgress();
  const progressPercentage = progress.total > 0 ? (progress.current / progress.total) * 100 : 0;

  if (!isOnline) {
    return (
      <Alert className="mb-6 border-yellow-200 bg-yellow-50">
        <WifiOff className="h-4 w-4 text-yellow-600" />
        <AlertDescription className="text-yellow-800">
          <div className="flex items-center justify-between">
            <span>
              You're offline. {queuedItems.length > 0 && `${queuedItems.length} items will sync when connection is restored.`}
            </span>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  if (syncing) {
    return (
      <Alert className="mb-6 border-blue-200 bg-blue-50">
        <RefreshCw className="h-4 w-4 text-blue-600 animate-spin" />
        <AlertDescription className="text-blue-800">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span>
                Syncing surveys... ({progress.current}/{progress.total})
              </span>
              <span className="text-sm text-blue-600">
                {Math.round(progressPercentage)}%
              </span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
            {progress.currentSurvey && (
              <div className="text-sm text-blue-600">
                Current: {progress.currentSurvey}
                {progress.currentPhase && ` - ${progress.currentPhase}`}
              </div>
            )}
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  if (failedSurveys.length > 0) {
    return (
      <Alert className="mb-6 border-red-200 bg-red-50">
        <AlertCircle className="h-4 w-4 text-red-600" />
        <AlertDescription className="text-red-800">
          <div className="flex items-center justify-between">
            <span>
              {failedSurveys.length} survey{failedSurveys.length !== 1 ? 's' : ''} failed to sync. 
              Check the diagnostics panel for details.
            </span>
            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant="outline" 
                onClick={syncAllPending}
                className="text-red-700 border-red-200 hover:bg-red-100"
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Retry
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={forceSyncAll}
                className="text-red-700 border-red-200 hover:bg-red-100"
              >
                <Upload className="h-3 w-3 mr-1" />
                Force Upload
              </Button>
            </div>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  if (queuedItems.length > 0) {
    return (
      <Alert className="mb-6 border-orange-200 bg-orange-50">
        <Upload className="h-4 w-4 text-orange-600" />
        <AlertDescription className="text-orange-800">
          <div className="flex items-center justify-between">
            <span>
              {queuedItems.length} item{queuedItems.length !== 1 ? 's' : ''} pending sync.
            </span>
            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant="outline" 
                onClick={syncAllPending}
                className="text-orange-700 border-orange-200 hover:bg-orange-100"
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Sync Now
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={forceSyncAll}
                className="text-orange-700 border-orange-200 hover:bg-orange-100"
              >
                <Upload className="h-3 w-3 mr-1" />
                Force Upload
              </Button>
            </div>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  return null;
};

export default SyncStatusBanner;
