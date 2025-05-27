
import { Button } from '@/components/ui/button';
import { Camera, Upload } from 'lucide-react';

interface ChecklistMediaEvidenceProps {
  attachingMedia: boolean;
  onCameraCapture: (evidenceType: 'defect' | 'compliance' | 'reference') => void;
  onFileSelect: (evidenceType: 'defect' | 'compliance' | 'reference') => void;
}

const ChecklistMediaEvidence = ({
  attachingMedia,
  onCameraCapture,
  onFileSelect,
}: ChecklistMediaEvidenceProps) => {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">Evidence Attachments</label>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => onCameraCapture('defect')}
          disabled={attachingMedia}
          className="flex-1"
        >
          <Camera className="h-3 w-3 mr-1" />
          Photo (Defect)
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => onFileSelect('compliance')}
          disabled={attachingMedia}
          className="flex-1"
        >
          <Upload className="h-3 w-3 mr-1" />
          Compliance
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => onFileSelect('reference')}
          disabled={attachingMedia}
          className="flex-1"
        >
          <Upload className="h-3 w-3 mr-1" />
          Reference
        </Button>
      </div>
    </div>
  );
};

export default ChecklistMediaEvidence;
