
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Settings } from 'lucide-react';

const FunModeSettings = () => {
  const [settings, setSettings] = useState({
    enableMoodMeter: true,
    showTips: true,
    enableFunMode: false,
    professionalTipsOnly: true,
    disableZoneIcons: false
  });

  useEffect(() => {
    // Load settings from localStorage
    const loadedSettings = {
      enableMoodMeter: localStorage.getItem('showMoodMeter') !== 'false',
      showTips: localStorage.getItem('showTips') !== 'false',
      enableFunMode: localStorage.getItem('funModeEnabled') === 'true',
      professionalTipsOnly: localStorage.getItem('professionalTipsOnly') === 'true',
      disableZoneIcons: localStorage.getItem('disableZoneIcons') === 'true'
    };
    setSettings(loadedSettings);
  }, []);

  const updateSetting = (key: string, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    
    // Save to localStorage
    const storageKey = {
      enableMoodMeter: 'showMoodMeter',
      showTips: 'showTips',
      enableFunMode: 'funModeEnabled',
      professionalTipsOnly: 'professionalTipsOnly',
      disableZoneIcons: 'disableZoneIcons'
    }[key];
    
    if (storageKey) {
      localStorage.setItem(storageKey, value.toString());
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Dashboard Preferences
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="mood-meter">Enable Mood Meter</Label>
          <Switch
            id="mood-meter"
            checked={settings.enableMoodMeter}
            onCheckedChange={(checked) => updateSetting('enableMoodMeter', checked)}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <Label htmlFor="show-tips">Show Tips</Label>
          <Switch
            id="show-tips"
            checked={settings.showTips}
            onCheckedChange={(checked) => updateSetting('showTips', checked)}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <Label htmlFor="fun-mode">Enable Fun Mode</Label>
          <Switch
            id="fun-mode"
            checked={settings.enableFunMode}
            onCheckedChange={(checked) => updateSetting('enableFunMode', checked)}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <Label htmlFor="professional-tips">Professional Tips Only</Label>
          <Switch
            id="professional-tips"
            checked={settings.professionalTipsOnly}
            onCheckedChange={(checked) => updateSetting('professionalTipsOnly', checked)}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <Label htmlFor="disable-icons">Disable Zone Icons</Label>
          <Switch
            id="disable-icons"
            checked={settings.disableZoneIcons}
            onCheckedChange={(checked) => updateSetting('disableZoneIcons', checked)}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default FunModeSettings;
