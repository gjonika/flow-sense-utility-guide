
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { useSurveys } from '@/hooks/useSurveys';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import MainHeader from '@/components/MainHeader';
import SystemStatusCards from '@/components/diagnostics/SystemStatusCards';
import QuickActionsCard from '@/components/diagnostics/QuickActionsCard';
import SurveyHealthCheck from '@/components/diagnostics/SurveyHealthCheck';
import SyncActivityLog from '@/components/diagnostics/SyncActivityLog';
import SystemInformation from '@/components/diagnostics/SystemInformation';
import DangerZone from '@/components/diagnostics/DangerZone';

const DevDiagnosticsPanel = () => {
  const { surveys, loading, syncPendingSurveys, clearAllData } = useSurveys();
  const isOnline = useOnlineStatus();

  const pendingSyncCount = surveys.filter(s => 'needs_sync' in s && s.needs_sync).length;
  const failedSyncs = 0; // This would come from actual sync error tracking

  const handleSyncAll = async () => {
    try {
      await syncPendingSurveys();
      console.log('Sync completed successfully');
    } catch (error) {
      console.error('Sync failed:', error);
    }
  };

  const handleClearAll = async () => {
    if (window.confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      try {
        await clearAllData();
        console.log('All data cleared successfully');
      } catch (error) {
        console.error('Failed to clear data:', error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <MainHeader />
      
      <div className="container mx-auto px-4 sm:px-6 py-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">System Diagnostics</h1>
            <p className="text-gray-600">Monitor system health and manage data synchronization</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={isOnline ? "default" : "destructive"}>
              {isOnline ? 'Online' : 'Offline'}
            </Badge>
          </div>
        </div>

        <SystemStatusCards 
          totalSurveys={surveys.length}
          pendingSyncCount={pendingSyncCount}
          failedSyncs={failedSyncs}
        />

        <QuickActionsCard 
          onSyncAll={handleSyncAll}
          loading={loading}
          pendingSyncCount={pendingSyncCount}
        />

        <SurveyHealthCheck surveys={surveys} />

        <SyncActivityLog />

        <SystemInformation />

        <DangerZone onClearAll={handleClearAll} />
      </div>
    </div>
  );
};

export default DevDiagnosticsPanel;
