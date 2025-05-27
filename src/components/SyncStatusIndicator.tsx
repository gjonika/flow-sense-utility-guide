
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Wifi, WifiOff, Cloud, Upload, CheckCircle, Clock } from "lucide-react";
import { useSurveys } from '@/hooks/useSurveys';

const SyncStatusIndicator = () => {
  const { isOnline, hasOfflineSurveys, uploadLocalSurveys } = useSurveys();

  if (!isOnline) {
    return (
      <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-300 flex items-center gap-1">
        <WifiOff className="h-3 w-3" />
        Offline{hasOfflineSurveys && ' (surveys saved locally)'}
      </Badge>
    );
  }

  if (hasOfflineSurveys) {
    return (
      <div className="flex items-center gap-2">
        <Badge variant="secondary" className="bg-orange-100 text-orange-800 border-orange-300 flex items-center gap-1">
          <Clock className="h-3 w-3" />
          Offline surveys ready
        </Badge>
        <Button 
          size="sm" 
          variant="outline" 
          onClick={uploadLocalSurveys}
          className="h-6 px-2 text-xs"
        >
          <Upload className="h-3 w-3 mr-1" />
          Upload All
        </Button>
      </div>
    );
  }

  return (
    <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-300 flex items-center gap-1">
      <CheckCircle className="h-3 w-3" />
      <Wifi className="h-3 w-3" />
      Online
    </Badge>
  );
};

export default SyncStatusIndicator;
