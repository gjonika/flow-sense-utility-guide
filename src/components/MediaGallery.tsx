
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  ChevronDown, 
  ChevronRight, 
  Trash2, 
  Edit2, 
  Save, 
  X,
  Image as ImageIcon,
  FileText,
  Video,
  File
} from 'lucide-react';
import { SurveyMedia, SurveyZone } from '@/types/survey';
import { useToast } from '@/hooks/use-toast';
import MediaViewer from './MediaViewer';

interface MediaGalleryProps {
  media: SurveyMedia[];
  zones: SurveyZone[];
  onDelete: (mediaId: string) => void;
  onUpdate: (mediaId: string, updates: Partial<SurveyMedia>) => void;
}

interface MediaWithMetadata extends SurveyMedia {
  title?: string;
  description?: string;
}

const MediaGallery = ({ media, zones, onDelete, onUpdate }: MediaGalleryProps) => {
  const [editingMedia, setEditingMedia] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ title: '', description: '', zone_id: '' });
  const [selectedMedia, setSelectedMedia] = useState<SurveyMedia | null>(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [openZones, setOpenZones] = useState<Set<string>>(new Set(['no-zone']));
  const { toast } = useToast();

  // Group media by zone
  const groupedMedia = media.reduce((groups, mediaItem) => {
    const zoneId = mediaItem.zone_id || 'no-zone';
    if (!groups[zoneId]) {
      groups[zoneId] = [];
    }
    groups[zoneId].push(mediaItem);
    return groups;
  }, {} as Record<string, SurveyMedia[]>);

  const getZoneName = (zoneId: string) => {
    if (zoneId === 'no-zone') return 'No Zone';
    const zone = zones.find(z => z.id === zoneId);
    return zone ? `${zone.zone_name} (${zone.zone_type})` : 'Unknown Zone';
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return <ImageIcon className="h-4 w-4 text-blue-600" />;
    if (fileType.startsWith('video/')) return <Video className="h-4 w-4 text-purple-600" />;
    if (fileType.includes('pdf')) return <FileText className="h-4 w-4 text-red-600" />;
    return <File className="h-4 w-4 text-gray-600" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const handleEdit = (mediaItem: SurveyMedia) => {
    setEditingMedia(mediaItem.id);
    setEditForm({
      title: (mediaItem as MediaWithMetadata).title || mediaItem.file_name,
      description: (mediaItem as MediaWithMetadata).description || '',
      zone_id: mediaItem.zone_id || ''
    });
  };

  const handleSave = async (mediaId: string) => {
    try {
      await onUpdate(mediaId, {
        ...editForm,
        zone_id: editForm.zone_id || undefined
      });
      setEditingMedia(null);
      toast({
        title: "Media Updated",
        description: "Media metadata has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update media metadata.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = (mediaId: string, fileName: string) => {
    if (window.confirm(`Are you sure you want to delete "${fileName}"?`)) {
      onDelete(mediaId);
    }
  };

  const handleMediaClick = (mediaItem: SurveyMedia) => {
    setSelectedMedia(mediaItem);
    setIsViewerOpen(true);
  };

  const toggleZone = (zoneId: string) => {
    const newOpenZones = new Set(openZones);
    if (newOpenZones.has(zoneId)) {
      newOpenZones.delete(zoneId);
    } else {
      newOpenZones.add(zoneId);
    }
    setOpenZones(newOpenZones);
  };

  const truncateFileName = (fileName: string, maxLength: number = 25) => {
    if (fileName.length <= maxLength) return fileName;
    const extension = fileName.split('.').pop();
    const nameWithoutExt = fileName.substring(0, fileName.lastIndexOf('.'));
    const truncated = nameWithoutExt.substring(0, maxLength - extension!.length - 3) + '...';
    return `${truncated}.${extension}`;
  };

  if (Object.keys(groupedMedia).length === 0) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center">
            <ImageIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No media files yet</h3>
            <p className="text-gray-500 text-sm">Upload photos and videos to see them here.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {Object.entries(groupedMedia).map(([zoneId, zoneMedia]) => (
        <Card key={zoneId}>
          <Collapsible
            open={openZones.has(zoneId)}
            onOpenChange={() => toggleZone(zoneId)}
          >
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
                <CardTitle className="flex items-center justify-between text-lg">
                  <div className="flex items-center gap-2">
                    {openZones.has(zoneId) ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                    <span>{getZoneName(zoneId)}</span>
                    <Badge variant="secondary">{zoneMedia.length} file{zoneMedia.length !== 1 ? 's' : ''}</Badge>
                  </div>
                </CardTitle>
              </CardHeader>
            </CollapsibleTrigger>
            
            <CollapsibleContent>
              <CardContent>
                <div className="space-y-4">
                  {zoneMedia.map((mediaItem) => (
                    <div key={mediaItem.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          {/* Thumbnail or Icon */}
                          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                            {mediaItem.file_type?.startsWith('image/') && mediaItem.local_file_data ? (
                              <img
                                src={mediaItem.local_file_data}
                                alt={mediaItem.file_name}
                                className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
                                onClick={() => handleMediaClick(mediaItem)}
                              />
                            ) : (
                              <div className="cursor-pointer" onClick={() => handleMediaClick(mediaItem)}>
                                {getFileIcon(mediaItem.file_type)}
                              </div>
                            )}
                          </div>

                          {/* File Info */}
                          <div className="flex-1 min-w-0">
                            {editingMedia === mediaItem.id ? (
                              <div className="space-y-2">
                                <Input
                                  value={editForm.title}
                                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                                  placeholder="Title"
                                  className="text-sm"
                                />
                                <Textarea
                                  value={editForm.description}
                                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                  placeholder="Description or survey note"
                                  rows={2}
                                  className="text-sm"
                                />
                                <select
                                  value={editForm.zone_id}
                                  onChange={(e) => setEditForm({ ...editForm, zone_id: e.target.value })}
                                  className="w-full p-2 border rounded text-sm"
                                >
                                  <option value="">No Zone</option>
                                  {zones.map((zone) => (
                                    <option key={zone.id} value={zone.id}>
                                      {zone.zone_name} ({zone.zone_type})
                                    </option>
                                  ))}
                                </select>
                              </div>
                            ) : (
                              <div>
                                <p 
                                  className="font-medium text-sm cursor-pointer hover:text-blue-600"
                                  title={mediaItem.file_name}
                                  onClick={() => handleMediaClick(mediaItem)}
                                >
                                  {(mediaItem as MediaWithMetadata).title || truncateFileName(mediaItem.file_name)}
                                </p>
                                {(mediaItem as MediaWithMetadata).description && (
                                  <p className="text-xs text-gray-600 mt-1">
                                    {(mediaItem as MediaWithMetadata).description}
                                  </p>
                                )}
                                <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                                  <span>{formatFileSize(mediaItem.file_size || 0)}</span>
                                  <span>{formatTimestamp(mediaItem.created_at)}</span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1 flex-shrink-0">
                          {editingMedia === mediaItem.id ? (
                            <>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleSave(mediaItem.id)}
                                className="h-8 w-8 p-0"
                              >
                                <Save className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setEditingMedia(null)}
                                className="h-8 w-8 p-0"
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleEdit(mediaItem)}
                                className="h-8 w-8 p-0"
                                title="Edit metadata"
                              >
                                <Edit2 className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDelete(mediaItem.id, mediaItem.file_name)}
                                className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                                title="Delete file"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>
      ))}

      {/* Media Viewer Modal */}
      <MediaViewer
        media={selectedMedia}
        isOpen={isViewerOpen}
        onClose={() => {
          setIsViewerOpen(false);
          setSelectedMedia(null);
        }}
        onDelete={(mediaId) => {
          const mediaItem = media.find(m => m.id === mediaId);
          if (mediaItem) {
            handleDelete(mediaId, mediaItem.file_name);
          }
        }}
      />
    </div>
  );
};

export default MediaGallery;
