
import React from 'react';

interface ImageUploadHandlerProps {
  onImageUpload: (file: File) => void;
}

export const ImageUploadHandler: React.FC<ImageUploadHandlerProps> = ({
  onImageUpload,
}) => {
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    onImageUpload(file);
  };

  return (
    <input
      type="file"
      accept="image/*"
      onChange={handleFileUpload}
      className="hidden"
      id="file-upload"
    />
  );
};
