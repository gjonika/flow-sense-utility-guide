
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, Anchor } from 'lucide-react';

const TIPS = {
  fun: [
    "🌊 Did you know? The largest cruise ship can hold more than 9,000 people!",
    "⚓ A ship's bell traditionally marks time aboard - eight bells means end of watch!",
    "🐙 The deepest part of the ocean is over 36,000 feet deep - deeper than Mount Everest is tall!",
    "🧭 Before GPS, sailors used the stars to navigate - some still do as backup!",
    "🦜 Pirates actually rarely made people walk the plank - it was mostly a Hollywood invention!"
  ],
  professional: [
    "📋 Always document safety equipment locations during your initial walkthrough",
    "🔍 Check fire doors close properly - it's often overlooked but critical for compliance",
    "📸 Take photos from multiple angles - what's clear to you might not be clear later",
    "⚠️ Mark priority items immediately - don't wait until the end of your survey",
    "📝 Brief notes during inspection save hours of report writing later"
  ],
  marine: [
    "🚢 SOLAS requires passenger vessels to have enough lifeboats for 125% of total capacity",
    "🔥 Class A fire doors must be self-closing and capable of preventing smoke passage",
    "💡 Emergency lighting must function for at least 3 hours during power failure",
    "🚪 Watertight doors should be tested monthly as per DNV guidelines",
    "📡 GMDSS equipment must be tested weekly and logged properly"
  ]
};

const CaptainsTip = () => {
  const [currentTip, setCurrentTip] = useState('');
  const [tipMode, setTipMode] = useState<'fun' | 'professional' | 'marine'>('professional');
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const showTips = localStorage.getItem('showTips');
    const professionalOnly = localStorage.getItem('professionalTipsOnly');
    
    if (showTips === 'false') {
      setIsVisible(false);
      return;
    }

    if (professionalOnly === 'true') {
      setTipMode('professional');
    }

    loadTodaysTip();
  }, [tipMode]);

  const loadTodaysTip = () => {
    const today = new Date().toDateString();
    const savedTip = localStorage.getItem(`tip_${today}`);
    
    if (savedTip) {
      setCurrentTip(savedTip);
    } else {
      getRandomTip();
    }
  };

  const getRandomTip = () => {
    const tips = TIPS[tipMode];
    const randomTip = tips[Math.floor(Math.random() * tips.length)];
    setCurrentTip(randomTip);
    
    const today = new Date().toDateString();
    localStorage.setItem(`tip_${today}`, randomTip);
  };

  if (!isVisible || !currentTip) return null;

  return (
    <Card className="mb-6 bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Anchor className="h-4 w-4 text-blue-600" />
              <h3 className="font-medium text-blue-900">Captain's Tip</h3>
            </div>
            <p className="text-sm text-blue-800">{currentTip}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={getRandomTip}
            className="text-blue-600 hover:text-blue-800"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CaptainsTip;
