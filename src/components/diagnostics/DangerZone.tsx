
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

interface DangerZoneProps {
  onClearAll: () => void;
}

const DangerZone = ({ onClearAll }: DangerZoneProps) => {
  return (
    <Card className="mt-8 border-red-200">
      <CardHeader>
        <CardTitle className="text-red-600">Danger Zone</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 mb-4">
          These actions will permanently delete data and cannot be undone.
        </p>
        <Button 
          variant="destructive"
          onClick={onClearAll}
          className="flex items-center gap-2"
        >
          <Trash2 className="h-4 w-4" />
          Clear All Data
        </Button>
      </CardContent>
    </Card>
  );
};

export default DangerZone;
