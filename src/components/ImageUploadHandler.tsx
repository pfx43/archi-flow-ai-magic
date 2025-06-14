
import React from 'react';
import { FabricImage } from 'fabric';

interface ImageUploadHandlerProps {
  fabricCanvas: any;
  onImageUpload: (file: File) => void;
}

export const ImageUploadHandler: React.FC<ImageUploadHandlerProps> = ({
  fabricCanvas,
  onImageUpload,
}) => {
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !fabricCanvas) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const imgElement = new Image();
      imgElement.onload = () => {
        const fabricImg = new FabricImage(imgElement, {
          left: 100,
          top: 100,
          scaleX: 0.5,
          scaleY: 0.5,
        });
        fabricCanvas.add(fabricImg);
        fabricCanvas.renderAll();
      };
      imgElement.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
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
