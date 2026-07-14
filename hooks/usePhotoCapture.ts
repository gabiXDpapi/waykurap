import { useState, RefObject, useRef, useEffect } from "react";

export function usePhotoCapture(videoRef: RefObject<HTMLVideoElement | null>) {
  const [photos, setPhotos] = useState<string[]>([]);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const captureSinglePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        return canvas.toDataURL("image/png");
      }
    }
    return null;
  };

  const handleTakePhoto = async (count: number) => {
    if (isCapturing) return;
    setIsCapturing(true);
    setPhotos([]);

    const newPhotos: string[] = [];

    for (let i = 0; i < count; i++) {
      // 5-second countdown
      for (let sec = 5; sec > 0; sec--) {
        if (!isMounted.current) return;
        setCountdown(sec);
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
      
      if (!isMounted.current) return;
      setCountdown(null);
      
      const photo = captureSinglePhoto();
      if (photo) {
        newPhotos.push(photo);
        setPhotos([...newPhotos]);
      }

      // Small pause before the next countdown
      if (i < count - 1 && isMounted.current) {
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    }

    if (isMounted.current) {
      setIsCapturing(false);
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
    countdown,
    isCapturing,
    handleTakePhoto,
    handleExportPhoto,
    handleRetake,
  };
}
