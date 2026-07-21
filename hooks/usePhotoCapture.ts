import { useState, RefObject, useRef, useEffect } from "react";

export function usePhotoCapture(videoRef: RefObject<HTMLVideoElement | null>) {
  const [photos, setPhotos] = useState<string[]>([]);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [showFlash, setShowFlash] = useState(false);
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
    }
  };

  const handleExportPhoto = async () => {
    if (photos.length === 0) return;

    const padding = 24;
    const paddingBottom = 80;
    const gap = 16;

    const loadedImages = await Promise.all(
      photos.map((src) => {
        return new Promise<HTMLImageElement>((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.onerror = reject;
          img.src = src;
        });
      })
    );

    if (loadedImages.length === 0) return;

    const imgWidth = loadedImages[0].width;
    const imgHeight = loadedImages[0].height;

    const canvasWidth = imgWidth + padding * 2;
    const canvasHeight = padding + (imgHeight * loadedImages.length) + (gap * (loadedImages.length - 1)) + paddingBottom;

    const canvas = document.createElement("canvas");
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Draw white background for the strip
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Draw each image onto the strip
    let currentY = padding;
    loadedImages.forEach((img) => {
      ctx.drawImage(img, padding, currentY, imgWidth, imgHeight);

      // Draw subtle border around each photo (mimicking the CSS border-black/5)
      ctx.strokeStyle = "rgba(0, 0, 0, 0.05)";
      ctx.lineWidth = 2;
      ctx.strokeRect(padding, currentY, imgWidth, imgHeight);

      currentY += imgHeight + gap;
    });

    const dataUrl = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = `photobooth-strip-${Date.now()}.png`;
    a.click();
  };

  const handleRetake = () => {
    setPhotos([]);
  };

  return {
    photos,
    countdown,
    isCapturing,
    showFlash,
    handleTakePhoto,
    handleExportPhoto,
    handleRetake,
  };
}
