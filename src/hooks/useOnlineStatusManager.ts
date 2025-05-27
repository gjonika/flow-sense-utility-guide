
import { useState, useEffect } from 'react';

export const useOnlineStatusManager = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [retryAttempts, setRetryAttempts] = useState(0);

  useEffect(() => {
    const handleOnline = () => {
      console.log('Network status: ONLINE');
      setIsOnline(true);
      setRetryAttempts(0);
    };
    
    const handleOffline = () => {
      console.log('Network status: OFFLINE');
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return {
    isOnline,
    retryAttempts,
    setRetryAttempts,
  };
};
