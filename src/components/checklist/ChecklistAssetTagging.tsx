
import { Input } from '@/components/ui/input';
import { Tag, QrCode, Radio } from 'lucide-react';

interface ChecklistAssetTaggingProps {
  assetTag: string;
  qrCode: string;
  rfidTag: string;
  onAssetTagChange: (value: string) => void;
  onQrCodeChange: (value: string) => void;
  onRfidTagChange: (value: string) => void;
}

const ChecklistAssetTagging = ({
  assetTag,
  qrCode,
  rfidTag,
  onAssetTagChange,
  onQrCodeChange,
  onRfidTagChange,
}: ChecklistAssetTaggingProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      <div>
        <label className="block text-sm font-medium mb-1">
          <Tag className="h-3 w-3 inline mr-1" />
          Asset Tag
        </label>
        <Input
          value={assetTag}
          onChange={(e) => onAssetTagChange(e.target.value)}
          placeholder="Asset ID"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">
          <QrCode className="h-3 w-3 inline mr-1" />
          QR Code
        </label>
        <Input
          value={qrCode}
          onChange={(e) => onQrCodeChange(e.target.value)}
          placeholder="QR Code Data"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">
          <Radio className="h-3 w-3 inline mr-1" />
          RFID Tag
        </label>
        <Input
          value={rfidTag}
          onChange={(e) => onRfidTagChange(e.target.value)}
          placeholder="RFID Data"
        />
      </div>
    </div>
  );
};

export default ChecklistAssetTagging;
