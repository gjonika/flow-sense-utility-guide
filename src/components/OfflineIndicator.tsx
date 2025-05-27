
import { Badge } from '@/components/ui/badge';
import { Wifi, WifiOff, Database, Upload } from 'lucide-react';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { useSyncQueue } from '@/hooks/useSyncQueue';

const OfflineIndicator = () => {
  const isOnline = useOnlineStatus();
  const { queuedItems, syncing } = useSyncQueue();

  if (isOnline && queuedItems.length === 0) {
    return (
      <Badge variant="default" className="bg-green-100 text-green-800 border-green-300">
        <Wifi className="h-3 w-3 mr-1" />
        Online
      </Badge>
    );
  }

  if (isOnline && queuedItems.length > 0) {
    return (
      <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-300">
        {syncing ? (
          <Upload className="h-3 w-3 mr-1 animate-pulse" />
        ) : (
          <Database className="h-3 w-3 mr-1" />
        )}
        {syncing ? 'Syncing...' : `${queuedItems.length} pending`}
      </Badge>
    );
  }

  return (
    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-300">
      <WifiOff className="h-3 w-3 mr-1" />
      Offline Mode
    </Badge>
  );
};

export default OfflineIndicator;
