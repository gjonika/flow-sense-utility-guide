
import { Textarea } from '@/components/ui/textarea';
import ChecklistAssetTagging from './ChecklistAssetTagging';
import ChecklistMediaEvidence from './ChecklistMediaEvidence';

interface ChecklistAdditionalDetailsProps {
  notes: string;
  assetTag: string;
  qrCode: string;
  rfidTag: string;
  attachingMedia: boolean;
  onNotesChange: (value: string) => void;
  onAssetTagChange: (value: string) => void;
  onQrCodeChange: (value: string) => void;
  onRfidTagChange: (value: string) => void;
  onCameraCapture: (evidenceType: 'defect' | 'compliance' | 'reference') => void;
  onFileSelect: (evidenceType: 'defect' | 'compliance' | 'reference') => void;
}

const ChecklistAdditionalDetails = ({
  notes,
  assetTag,
  qrCode,
  rfidTag,
  attachingMedia,
  onNotesChange,
  onAssetTagChange,
  onQrCodeChange,
  onRfidTagChange,
  onCameraCapture,
  onFileSelect,
}: ChecklistAdditionalDetailsProps) => {
  return (
    <div className="space-y-3 border-t pt-3">
      {/* Notes */}
      <div>
        <label className="block text-sm font-medium mb-1">Notes</label>
        <Textarea
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          placeholder="Add notes, observations, or recommendations..."
          className="h-20"
        />
      </div>

      {/* Asset Tagging */}
      <ChecklistAssetTagging
        assetTag={assetTag}
        qrCode={qrCode}
        rfidTag={rfidTag}
        onAssetTagChange={onAssetTagChange}
        onQrCodeChange={onQrCodeChange}
        onRfidTagChange={onRfidTagChange}
      />

      {/* Media Evidence */}
      <ChecklistMediaEvidence
        attachingMedia={attachingMedia}
        onCameraCapture={onCameraCapture}
        onFileSelect={onFileSelect}
      />
    </div>
  );
};

export default ChecklistAdditionalDetails;
