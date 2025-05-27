
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Wifi, WifiOff, Database, Upload, HardDrive, Trash2 } from 'lucide-react';
import { useOfflineStorage } from '@/hooks/useOfflineStorage';
import { useSyncQueue } from '@/hooks/useSyncQueue';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { cleanupOldData } from '@/lib/offlineStorage';
import { useToast } from '@/hooks/use-toast';

const OfflineStorageStatus = () => {
  const { isInitialized, storageInfo, getItemsNeedingSync, updateStorageInfo } = useOfflineStorage();
  const { syncing, syncProgress, queuedItems, processSyncQueue } = useSyncQueue();
  const isOnline = useOnlineStatus();
  const [pendingCounts, setPendingCounts] = useState({ surveys: 0, zones: 0, notes: 0, media: 0, checklistResponses: 0 });
  const { toast } = useToast();

  // Load pending items count
  useEffect(() => {
    if (isInitialized) {
      const loadCounts = async () => {
        const items = await getItemsNeedingSync();
        setPendingCounts({
          surveys: items.surveys.length,
          zones: items.zones.length,
          notes: items.notes.length,
          media: items.media.length,
          checklistResponses: items.checklistResponses.length
        });
      };
      loadCounts();
      const interval = setInterval(loadCounts, 5000);
      return () => clearInterval(interval);
    }
  }, [isInitialized, getItemsNeedingSync]);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const totalPendingItems = Object.values(pendingCounts).reduce((sum, count) => sum + count, 0);
  const storageUsedPercent = storageInfo.available > 0 ? (storageInfo.used / storageInfo.available) * 100 : 0;

  const handleCleanup = async () => {
    try {
      await cleanupOldData(30);
      await updateStorageInfo();
      toast({
        title: "Cleanup Complete",
        description: "Old synchronized data has been removed from local storage.",
      });
    } catch (error) {
      toast({
        title: "Cleanup Failed",
        description: "Failed to clean up old data. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!isInitialized) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 text-yellow-600">
            <Database className="h-4 w-4 animate-spin" />
            <span>Initializing offline storage...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Offline Storage Status
          {isOnline ? (
            <Badge variant="default" className="bg-green-100 text-green-800">
              <Wifi className="h-3 w-3 mr-1" />
              Online
            </Badge>
          ) : (
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
              <WifiOff className="h-3 w-3 mr-1" />
              Offline
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Storage Usage */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Storage Used</span>
            <span>{formatBytes(storageInfo.used)} / {formatBytes(storageInfo.available)}</span>
          </div>
          <Progress value={storageUsedPercent} className="h-2" />
          {storageUsedPercent > 80 && (
            <p className="text-xs text-yellow-600">Storage is getting full. Consider cleaning up old data.</p>
          )}
        </div>

        {/* Pending Sync Items */}
        {totalPendingItems > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Pending Sync ({totalPendingItems} items)</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {pendingCounts.surveys > 0 && <div>Surveys: {pendingCounts.surveys}</div>}
              {pendingCounts.zones > 0 && <div>Zones: {pendingCounts.zones}</div>}
              {pendingCounts.notes > 0 && <div>Notes: {pendingCounts.notes}</div>}
              {pendingCounts.media > 0 && <div>Media: {pendingCounts.media}</div>}
              {pendingCounts.checklistResponses > 0 && <div>Responses: {pendingCounts.checklistResponses}</div>}
            </div>
          </div>
        )}

        {/* Sync Progress */}
        {syncing && syncProgress.isActive && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Syncing...</span>
              <span>{syncProgress.current} / {syncProgress.total}</span>
            </div>
            <Progress value={(syncProgress.current / syncProgress.total) * 100} className="h-2" />
            {syncProgress.currentItem && (
              <p className="text-xs text-gray-600">Current: {syncProgress.currentItem}</p>
            )}
          </div>
        )}

        {/* Sync Queue Status */}
        {queuedItems.length > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Sync Queue: {queuedItems.length} items</span>
              {isOnline && !syncing && (
                <Button size="sm" onClick={processSyncQueue}>
                  <Upload className="h-3 w-3 mr-1" />
                  Sync Now
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handleCleanup}
            className="flex-1"
          >
            <Trash2 className="h-3 w-3 mr-1" />
            Cleanup Old Data
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={updateStorageInfo}
            className="flex-1"
          >
            <HardDrive className="h-3 w-3 mr-1" />
            Refresh
          </Button>
        </div>

        {/* Status Messages */}
        {!isOnline && totalPendingItems === 0 && (
          <p className="text-xs text-gray-600">
            You're offline. Any changes will be saved locally and synced when you reconnect.
          </p>
        )}
        
        {isOnline && totalPendingItems === 0 && (
          <p className="text-xs text-green-600">
            All data is synchronized and up to date.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default OfflineStorageStatus;
