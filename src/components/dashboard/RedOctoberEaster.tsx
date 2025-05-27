
import { useEffect, useState } from 'react';

interface RedOctoberEasterProps {
  zoneName: string;
}

const RedOctoberEaster = ({ zoneName }: RedOctoberEasterProps) => {
  const [showSonar, setShowSonar] = useState(false);

  useEffect(() => {
    const easterEggNames = ['red october', 'nautilus'];
    const normalizedZoneName = zoneName.toLowerCase().trim();
    
    if (easterEggNames.includes(normalizedZoneName)) {
      const sessionKey = `easter_egg_${normalizedZoneName}_${new Date().toDateString()}`;
      const alreadyTriggered = sessionStorage.getItem(sessionKey);
      
      if (!alreadyTriggered) {
        // Check if fun mode is enabled
        const funMode = localStorage.getItem('funModeEnabled');
        const isDev = process.env.NODE_ENV === 'development';
        
        if (funMode === 'true' || isDev) {
          setShowSonar(true);
          sessionStorage.setItem(sessionKey, 'true');
          
          // Hide after 3 seconds
          setTimeout(() => {
            setShowSonar(false);
          }, 3000);
        }
      }
    }
  }, [zoneName]);

  if (!showSonar) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-50 flex items-center justify-center">
      <div className="relative">
        {/* Sonar ping animation */}
        <div className="absolute inset-0 rounded-full border-2 border-green-400 animate-ping opacity-75"></div>
        <div className="absolute inset-0 rounded-full border-2 border-green-400 animate-ping animation-delay-500 opacity-50"></div>
        <div className="absolute inset-0 rounded-full border-2 border-green-400 animate-ping animation-delay-1000 opacity-25"></div>
        
        {/* Center dot */}
        <div className="w-4 h-4 bg-green-400 rounded-full"></div>
        
        {/* Text */}
        <div className="absolute top-8 left-1/2 transform -translate-x-1/2 text-green-400 font-mono text-sm whitespace-nowrap">
          🔍 Sonar Contact Detected
        </div>
      </div>
    </div>
  );
};

export default RedOctoberEaster;
