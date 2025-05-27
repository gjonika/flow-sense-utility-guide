
import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, X } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface MobileCameraCaptureProps {
  onCapture: (file: File) => void;
  disabled?: boolean;
}

const MobileCameraCapture = ({ onCapture, disabled }: MobileCameraCaptureProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isMobile = useIsMobile();

  const handleCameraClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onCapture(file);
    }
    // Reset the input so the same file can be selected again
    event.target.value = '';
  };

  return (
    <>
      <Button 
        type="button"
        onClick={handleCameraClick}
        variant="outline"
        disabled={disabled}
        className="w-full sm:w-auto"
      >
        <Camera className="h-4 w-4 mr-2" />
        {isMobile ? 'Take Photo' : 'Camera'}
      </Button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileSelect}
        className="hidden"
        aria-label="Capture photo"
      />
    </>
  );
};

export default MobileCameraCapture;
