
import { Badge } from "@/components/ui/badge";
import { Wifi, WifiOff } from "lucide-react";

interface StatusBannerProps {
  isOnline: boolean;
  totalSurveys: number;
  completedSurveys: number;
  inProgressSurveys: number;
  pendingSyncSurveys: number;
}

const StatusBanner = ({
  isOnline,
  totalSurveys,
  completedSurveys,
  inProgressSurveys,
  pendingSyncSurveys,
}: StatusBannerProps) => {
  return (
    <div className="space-y-4">
      {/* Connection Status */}
      <div className="flex items-center gap-2 text-sm">
        {isOnline ? (
          <>
            <Wifi className="h-4 w-4 text-green-600" />
            <span className="text-green-600">Online</span>
          </>
        ) : (
          <>
            <WifiOff className="h-4 w-4 text-yellow-600" />
            <span className="text-yellow-600">Offline Mode</span>
          </>
        )}
      </div>

      {/* Stats */}
      <div className="bg-blue-50 rounded-lg p-4">
        <h3 className="font-medium text-blue-900 mb-2">Survey Statistics</h3>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-blue-700">Total:</span>
            <span className="font-medium">{totalSurveys}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-blue-700">Completed:</span>
            <span className="font-medium">{completedSurveys}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-blue-700">In Progress:</span>
            <span className="font-medium">{inProgressSurveys}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-blue-700">Pending Sync:</span>
            <span className="font-medium">{pendingSyncSurveys}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusBanner;
