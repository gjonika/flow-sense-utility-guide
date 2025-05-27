
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, FileText, RefreshCw } from 'lucide-react';

interface ChecklistEmptyStateProps {
  loading: boolean;
  onLoadDefaultChecklist: () => void;
}

const ChecklistEmptyState = ({ loading, onLoadDefaultChecklist }: ChecklistEmptyStateProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-blue-700 flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Survey Compliance Checklist
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8">
          <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No checklist loaded</h3>
          <p className="text-gray-500 mb-6">Load the default compliance checklist to begin assessment.</p>
          <Button onClick={onLoadDefaultChecklist} disabled={loading}>
            {loading ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Loading...
              </>
            ) : (
              <>
                <Shield className="h-4 w-4 mr-2" />
                Load Default Compliance Checklist
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChecklistEmptyState;
