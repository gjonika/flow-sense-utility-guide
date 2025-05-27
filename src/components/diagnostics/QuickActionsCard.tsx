
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, Upload, AlertTriangle, CheckCircle } from 'lucide-react';

interface QuickActionsCardProps {
  onSyncAll: () => void;
  loading: boolean;
  pendingSyncCount: number;
}

const QuickActionsCard = ({ onSyncAll, loading, pendingSyncCount }: QuickActionsCardProps) => {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-4">
          <Button 
            onClick={onSyncAll}
            disabled={loading || pendingSyncCount === 0}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Sync All Pending
          </Button>
          <Button 
            variant="outline"
            onClick={() => window.location.reload()}
            className="flex items-center gap-2"
          >
            <Upload className="h-4 w-4" />
            Force Upload All
          </Button>
          <Button 
            variant="outline"
            onClick={() => console.log('Retrying failed syncs...')}
            className="flex items-center gap-2"
          >
            <AlertTriangle className="h-4 w-4" />
            Retry Failed Syncs
          </Button>
          <Button 
            variant="outline"
            onClick={() => console.log('Validating all data...')}
            className="flex items-center gap-2"
          >
            <CheckCircle className="h-4 w-4" />
            Validate All
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActionsCard;
