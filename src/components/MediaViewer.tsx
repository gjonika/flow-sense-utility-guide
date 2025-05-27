
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, Download, Trash2 } from 'lucide-react';
import { SurveyMedia } from '@/types/survey';

interface MediaViewerProps {
  media: SurveyMedia | null;
  isOpen: boolean;
  onClose: () => void;
  onDelete?: (mediaId: string) => void;
}

const MediaViewer = ({ media, isOpen, onClose, onDelete }: MediaViewerProps) => {
  const [imageError, setImageError] = useState(false);

  if (!media) return null;

  const isImage = media.file_type?.startsWith('image/');
  const isVideo = media.file_type?.startsWith('video/');
  // Use local_file_data if available, otherwise fall back to storage_path
  const mediaData = media.local_file_data || media.storage_path;

  const handleDownload = () => {
    if (mediaData) {
      const link = document.createElement('a');
      link.href = mediaData;
      link.download = media.file_name || 'media-file';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleDelete = () => {
    if (onDelete && window.confirm(`Are you sure you want to delete "${media.file_name}"?`)) {
      onDelete(media.id);
      onClose();
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span className="truncate">{media.file_name}</span>
            <div className="flex items-center gap-2">
              {mediaData && (
                <Button variant="outline" size="sm" onClick={handleDownload}>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              )}
              {onDelete && (
                <Button variant="destructive" size="sm" onClick={handleDelete}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col space-y-4">
          {/* Media Content */}
          <div className="flex-1 flex items-center justify-center bg-gray-50 rounded-lg min-h-[300px] max-h-[60vh] overflow-hidden">
            {isImage && mediaData && !imageError ? (
              <img
                src={mediaData}
                alt={media.file_name}
                className="max-w-full max-h-full object-contain"
                onError={() => setImageError(true)}
              />
            ) : isVideo && mediaData ? (
              <video
                controls
                className="max-w-full max-h-full"
                preload="metadata"
              >
                <source src={mediaData} type={media.file_type} />
                Your browser does not support the video tag.
              </video>
            ) : (
              <div className="text-center p-8">
                <div className="text-6xl mb-4">📄</div>
                <p className="text-gray-600">Preview not available</p>
                <p className="text-sm text-gray-500">File type: {media.file_type}</p>
              </div>
            )}
          </div>

          {/* Media Info */}
          <div className="grid grid-cols-2 gap-4 text-sm bg-gray-50 p-4 rounded-lg">
            <div>
              <span className="font-medium">File Size:</span>
              <span className="ml-2">{formatFileSize(media.file_size || 0)}</span>
            </div>
            <div>
              <span className="font-medium">Type:</span>
              <span className="ml-2">{media.file_type}</span>
            </div>
            {media.zone_id && (
              <div className="col-span-2">
                <span className="font-medium">Zone:</span>
                <span className="ml-2">{media.zone_id}</span>
              </div>
            )}
            {media.created_at && (
              <div className="col-span-2">
                <span className="font-medium">Created:</span>
                <span className="ml-2">{new Date(media.created_at).toLocaleString()}</span>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MediaViewer;
