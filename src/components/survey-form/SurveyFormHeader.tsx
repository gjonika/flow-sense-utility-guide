
import { Button } from "@/components/ui/button";
import { ArrowLeft, Wifi, WifiOff } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import MainHeader from "@/components/MainHeader";

interface SurveyFormHeaderProps {
  isEdit: boolean;
  onCancel: () => void;
  isOnline: boolean;
}

const SurveyFormHeader = ({ isEdit, onCancel, isOnline }: SurveyFormHeaderProps) => {
  const isMobile = useIsMobile();

  return (
    <>
      <MainHeader />
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={onCancel} className="p-2 sm:p-3">
              <ArrowLeft className="h-4 w-4 mr-1 sm:mr-2" />
              {isMobile ? 'Back' : 'Back to Projects'}
            </Button>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                {isEdit ? 'Edit Survey Project' : 'New Survey Project'}
              </h1>
              <p className="text-sm text-gray-600">Ship interior inspection details</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-sm bg-gray-50 px-3 py-2 rounded-lg">
            {isOnline ? (
              <>
                <Wifi className="h-4 w-4 text-green-600" />
                <span className="text-green-600">Online</span>
              </>
            ) : (
              <>
                <WifiOff className="h-4 w-4 text-yellow-600" />
                <span className="text-yellow-600">Offline</span>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SurveyFormHeader;
