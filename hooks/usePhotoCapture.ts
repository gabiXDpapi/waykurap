import { useState, RefObject } from "react";

export function usePhotoCapture(videoRef: RefObject<HTMLVideoElement | null>) {
  const [photo, setPhoto] = useState<string | null>(null);

  const handleTakePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL("image/png");
        setPhoto(dataUrl);
      }
    }
  };

  const handleExportPhoto = () => {
    if (photo) {
      const a = document.createElement("a");
      a.href = photo;
      a.download = `photo-${Date.now()}.png`;
      a.click();
    }
  };

  const handleRetake = () => {
    setPhoto(null);
  };

  return {
    photo,
    handleTakePhoto,
    handleExportPhoto,
    handleRetake,
  };
}
