
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, Wifi, WifiOff } from 'lucide-react';
import { SurveyZone } from '@/types/survey';
import { useMediaSync } from '@/hooks/useMediaSync';
import { useSyncManager } from '@/hooks/useSyncManager';
import { mediaUploadService } from '@/services/mediaUploadService';
import { useToast } from '@/hooks/use-toast';
import MobileCameraCapture from './MobileCameraCapture';
import MediaGallery from './MediaGallery';
import { useIsMobile } from '@/hooks/use-mobile';

interface EnhancedMediaSectionProps {
  surveyId: string;
  zones: SurveyZone[];
}

const EnhancedMediaSection = ({ surveyId, zones }: EnhancedMediaSectionProps) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [selectedZoneId, setSelectedZoneId] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [offlineMedia, setOfflineMedia] = useState<any[]>([]);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: boolean }>({});
  
  const { saveMediaOffline, getOfflineMediaForSurvey, syncingMedia } = useMediaSync();
  const { isOnline } = useSyncManager();
  const { toast } = useToast();
  const isMobile = useIsMobile();

  // Load offline media for this survey
  useEffect(() => {
    const loadOfflineMedia = async () => {
      const media = await getOfflineMediaForSurvey(surveyId);
      setOfflineMedia(media);
    };
    loadOfflineMedia();
  }, [surveyId, getOfflineMediaForSurvey]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setSelectedFiles(Array.from(files));
    }
  };

  const handleCameraCapture = (file: File) => {
    setSelectedFiles([file]);
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    setUploading(true);
    let successCount = 0;
    let errorCount = 0;

    try {
      for (const file of selectedFiles) {
        const fileKey = `${file.name}_${Date.now()}`;
        setUploadProgress(prev => ({ ...prev, [fileKey]: true }));

        try {
          if (isOnline) {
            // Direct upload to Supabase Storage
            console.log('[EnhancedMedia] Uploading directly to Supabase Storage');
            const uploadResult = await mediaUploadService.uploadFile(surveyId, file, selectedZoneId || undefined);
            
            if (uploadResult.success) {
              successCount++;
              toast({
                title: "Upload Successful",
                description: `${file.name} uploaded successfully`,
              });
            } else {
              throw new Error(uploadResult.error || 'Upload failed');
            }
          } else {
            // Save offline for later sync
            console.log('[EnhancedMedia] Saving offline for later sync');
            await saveMediaOffline(surveyId, file, selectedZoneId || undefined);
            successCount++;
          }
        } catch (error) {
          console.error(`[EnhancedMedia] Failed to upload ${file.name}:`, error);
          errorCount++;
          toast({
            title: "Upload Failed",
            description: `Failed to upload ${file.name}: ${error instanceof Error ? error.message : 'Unknown error'}`,
            variant: "destructive",
          });
        } finally {
          setUploadProgress(prev => {
            const newProgress = { ...prev };
            delete newProgress[fileKey];
            return newProgress;
          });
        }
      }

      // Show summary
      if (successCount > 0) {
        toast({
          title: "Upload Complete",
          description: `${successCount} file(s) ${isOnline ? 'uploaded' : 'saved offline'}${errorCount > 0 ? `, ${errorCount} failed` : ''}`,
        });
      }
      
      // Refresh media list
      const updatedMedia = await getOfflineMediaForSurvey(surveyId);
      setOfflineMedia(updatedMedia);
      setSelectedFiles([]);
    } catch (error) {
      console.error('[EnhancedMedia] Upload process failed:', error);
      toast({
        title: "Upload Error",
        description: "Failed to process uploads",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      setUploadProgress({});
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleMediaDelete = async (mediaId: string) => {
    // TODO: Implement media deletion
    toast({
      title: "Feature Coming Soon",
      description: "Media deletion will be available in a future update",
    });
  };

  const handleMediaUpdate = async (mediaId: string, updates: any) => {
    // TODO: Implement media update
    console.log('Updating media:', mediaId, updates);
    toast({
      title: "Feature Coming Soon", 
      description: "Media editing will be available in a future update",
    });
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Connection Status */}
      <div className="flex items-center gap-2 text-sm mb-4 p-3 rounded-lg bg-gray-50">
        {isOnline ? (
          <>
            <Wifi className="h-4 w-4 text-green-600 flex-shrink-0" />
            <span className="text-green-600">Online - Files will upload to cloud storage</span>
          </>
        ) : (
          <>
            <WifiOff className="h-4 w-4 text-yellow-600 flex-shrink-0" />
            <span className="text-yellow-600">Offline - Files saved locally for later upload</span>
          </>
        )}
      </div>

      {/* Media Capture */}
      <Card>
        <CardHeader>
          <CardTitle className="text-blue-700 text-lg sm:text-xl">Capture Media</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <MobileCameraCapture 
                onCapture={handleCameraCapture}
                disabled={uploading}
              />
              
              <label className="flex-1">
                <Button 
                  asChild
                  variant="outline"
                  className="w-full sm:w-auto"
                  disabled={uploading}
                >
                  <span>
                    <Upload className="h-4 w-4 mr-2" />
                    {isMobile ? 'Browse Files' : 'Upload Files'}
                  </span>
                </Button>
                <Input
                  type="file"
                  accept="image/*,video/*"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </label>
            </div>

            {zones.length > 0 && (
              <div>
                <label className="block text-sm font-medium mb-2">Associate with zone (optional):</label>
                <select
                  value={selectedZoneId}
                  onChange={(e) => setSelectedZoneId(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md text-base"
                >
                  <option value="">No specific zone</option>
                  {zones.map((zone) => (
                    <option key={zone.id} value={zone.id}>
                      {zone.zone_name} ({zone.zone_type})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {selectedFiles.length > 0 && (
              <div className="space-y-4">
                <h4 className="font-medium">Selected Files:</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="border rounded p-3 text-center">
                      <div className="h-8 w-8 mx-auto mb-2 flex items-center justify-center">
                        {file.type.startsWith('image/') ? '📷' : 
                         file.type.startsWith('video/') ? '🎥' : '📄'}
                      </div>
                      <p className="text-xs truncate">{file.name}</p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                  ))}
                </div>
                <Button 
                  onClick={handleUpload} 
                  className="w-full"
                  disabled={uploading || Object.keys(uploadProgress).length > 0}
                >
                  {uploading || Object.keys(uploadProgress).length > 0 
                    ? `Processing ${Object.keys(uploadProgress).length} file(s)...` 
                    : `${isOnline ? 'Upload' : 'Save'} ${selectedFiles.length} file(s)`
                  }
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Media Gallery */}
      <MediaGallery
        media={offlineMedia}
        zones={zones}
        onDelete={handleMediaDelete}
        onUpdate={handleMediaUpdate}
      />
    </div>
  );
};

export default EnhancedMediaSection;
