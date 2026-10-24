import { useState, RefObject, useRef, useEffect } from "react";

export function usePhotoCapture(videoRef: RefObject<HTMLVideoElement | null>) {
  const [photos, setPhotos] = useState<string[]>([]);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [showFlash, setShowFlash] = useState(false);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
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
      const timerDuration = i === 0 ? 5 : 3;
      for (let sec = timerDuration; sec > 0; sec--) {
        if (!isMounted.current) return;
        setCountdown(sec);
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      if (!isMounted.current) return;
      setCountdown(null);

      const photo = captureSinglePhoto();
      if (photo) {
        setShowFlash(true);
        newPhotos.push(photo);
        setPhotos([...newPhotos]);

        setTimeout(() => {
          if (isMounted.current) {
            setShowFlash(false);
          }
        }, 150);
      }

      // Small pause before the next countdown
      if (i < count - 1 && isMounted.current) {
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    }

    if (isMounted.current) {
      setIsCapturing(false);
      return newPhotos;
    }
  };

  return {
    photos,
    countdown,
    isCapturing,
    showFlash,
    handleTakePhoto,
  };
}
