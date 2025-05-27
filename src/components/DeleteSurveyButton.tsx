
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface DeleteSurveyButtonProps {
  surveyId: string;
  surveyName: string;
  isOnline?: boolean;
  onDelete?: () => void;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

const DeleteSurveyButton: React.FC<DeleteSurveyButtonProps> = ({
  surveyId,
  surveyName,
  isOnline = true,
  onDelete,
  variant = 'outline',
  size = 'icon'
}) => {
  const [deleting, setDeleting] = useState(false);
  const { toast } = useToast();

  const handleDelete = async () => {
    setDeleting(true);
    
    try {
      if (!isOnline) {
        throw new Error('Cannot delete survey while offline. Please check your internet connection.');
      }

      // Delete from Supabase
      const { supabase } = await import('@/integrations/supabase/client');
      const { error } = await supabase
        .from('surveys')
        .delete()
        .eq('id', surveyId);

      if (error) throw error;
      
      toast({
        title: "Survey Deleted",
        description: `"${surveyName}" has been deleted successfully.`,
      });
      
      // Call the onDelete callback to refresh the list
      onDelete?.();
    } catch (error) {
      console.error('Failed to delete survey:', error);
      toast({
        title: "Delete Failed",
        description: error instanceof Error ? error.message : "Failed to delete survey. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button 
          variant={variant} 
          size={size}
          disabled={deleting}
          className="flex items-center gap-1"
        >
          <Trash2 className="h-4 w-4" />
          {size !== 'icon' && 'Delete'}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Do you really want to delete this survey?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete "{surveyName}"? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700"
            disabled={deleting}
          >
            {deleting ? 'Deleting...' : 'Yes, Delete Survey'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteSurveyButton;
