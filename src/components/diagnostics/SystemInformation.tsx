
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const SystemInformation = () => {
  const [systemInfo, setSystemInfo] = useState({
    browser: '',
    platform: '',
    onlineStatus: '',
    localStorage: '',
    indexedDB: '',
  });

  useEffect(() => {
    const info = {
      browser: navigator.userAgent.split(' ').pop() || 'Unknown',
      platform: navigator.platform || 'Unknown',
      onlineStatus: navigator.onLine ? 'Connected' : 'Offline',
      localStorage: typeof Storage !== 'undefined' ? 'Available' : 'Not Available',
      indexedDB: typeof indexedDB !== 'undefined' ? 'Available' : 'Not Available',
    };
    setSystemInfo(info);
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>System Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="font-medium">Browser:</span>
              <span>{systemInfo.browser}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Platform:</span>
              <span>{systemInfo.platform}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Online Status:</span>
              <span>{systemInfo.onlineStatus}</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="font-medium">Local Storage:</span>
              <span>{systemInfo.localStorage}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">IndexedDB:</span>
              <span>{systemInfo.indexedDB}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">React Version:</span>
              <span>18.3.1</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SystemInformation;
