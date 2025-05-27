
import { Badge } from '@/components/ui/badge';
import { Wifi, WifiOff } from 'lucide-react';

interface ChecklistConnectionStatusProps {
  isOnline: boolean;
}

const ChecklistConnectionStatus = ({ isOnline }: ChecklistConnectionStatusProps) => {
  return (
    <div className="flex items-center gap-2 text-sm mb-4">
      {isOnline ? (
        <Badge variant="default" className="bg-green-100 text-green-800">
          <Wifi className="h-3 w-3 mr-1" />
          Online - Real-time sync
        </Badge>
      ) : (
        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
          <WifiOff className="h-3 w-3 mr-1" />
          Offline - Syncing when connected
        </Badge>
      )}
    </div>
  );
};

export default ChecklistConnectionStatus;
