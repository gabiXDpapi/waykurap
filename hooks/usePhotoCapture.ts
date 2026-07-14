import { useState, RefObject } from "react";

export function usePhotoCapture(videoRef: RefObject<HTMLVideoElement | null>) {
  const [photos, setPhotos] = useState<string[]>([]);

  const handleTakePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL("image/png");
        setPhotos((prev) => [...prev, dataUrl]);
      }
    }
  };

  const handleExportPhoto = () => {
    if (photos.length > 0) {
      photos.forEach((photo, index) => {
        const a = document.createElement("a");
        a.href = photo;
        a.download = `photo-${Date.now()}-${index + 1}.png`;
        a.click();
      });
    }
  };

  const handleRetake = () => {
    setPhotos([]);
  };

  return {
    photos,
    handleTakePhoto,
    handleExportPhoto,
    handleRetake,
  };
}
