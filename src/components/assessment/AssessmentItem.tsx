
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { AssessmentItem as AssessmentItemType } from '@/types/assessment';

interface AssessmentItemProps {
  item: AssessmentItemType;
  onStatusUpdate: (status: AssessmentItemType['status']) => void;
  onNotesUpdate: (notes: string) => void;
}

const AssessmentItem = ({ item, onStatusUpdate, onNotesUpdate }: AssessmentItemProps) => {
  const getStatusIcon = (status: AssessmentItemType['status']) => {
    switch (status) {
      case 'noted':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'requires_attention':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case 'not_applicable':
        return <XCircle className="h-5 w-5 text-gray-600" />;
      default:
        return <div className="h-5 w-5 rounded-full border-2 border-gray-300" />;
    }
  };

  const getStatusBadge = (status: AssessmentItemType['status']) => {
    switch (status) {
      case 'noted':
        return <Badge className="bg-green-100 text-green-800">Noted</Badge>;
      case 'requires_attention':
        return <Badge className="bg-yellow-100 text-yellow-800">Attention</Badge>;
      case 'not_applicable':
        return <Badge className="bg-gray-100 text-gray-800">N/A</Badge>;
      default:
        return <Badge variant="secondary">Pending</Badge>;
    }
  };

  return (
    <div className="border rounded-lg p-4 space-y-3">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-start gap-3">
            {getStatusIcon(item.status)}
            <div className="flex-1">
              <p className="font-medium flex items-center gap-2">
                {item.question}
                {item.isPriority && (
                  <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                    Priority
                  </Badge>
                )}
              </p>
              {getStatusBadge(item.status)}
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-2 ml-8">
        <Button
          size="sm"
          variant={item.status === 'noted' ? 'default' : 'outline'}
          onClick={() => onStatusUpdate('noted')}
          className="text-xs"
        >
          Noted
        </Button>
        <Button
          size="sm"
          variant={item.status === 'requires_attention' ? 'default' : 'outline'}
          onClick={() => onStatusUpdate('requires_attention')}
          className="text-xs"
        >
          Needs Attention
        </Button>
        <Button
          size="sm"
          variant={item.status === 'not_applicable' ? 'default' : 'outline'}
          onClick={() => onStatusUpdate('not_applicable')}
          className="text-xs"
        >
          N/A
        </Button>
      </div>

      <div className="ml-8">
        <Textarea
          placeholder="Material details, dimensions, quantities, condition notes, supplier information, etc..."
          value={item.notes}
          onChange={(e) => onNotesUpdate(e.target.value)}
          rows={3}
          className="text-sm"
        />
      </div>
    </div>
  );
};

export default AssessmentItem;
