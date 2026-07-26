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

  const handleExportPhoto = async (selectedFrame: string = "Polaroid") => {
    if (photos.length === 0) return;

    const isFilmStrip = selectedFrame === "Film Strip";

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

    // The preview is roughly 400px wide. Use a scaling factor to keep proportions identical.
    const scale = imgWidth / 400;

    // Values match CameraPreview.tsx exactly (px-10/py-8 for film, p-4/pb-16 for polaroid)
    const paddingX = (isFilmStrip ? 40 : 16) * scale;
    const paddingY = (isFilmStrip ? 32 : 16) * scale;
    const paddingBottom = (isFilmStrip ? 32 : 64) * scale;
    const gap = (isFilmStrip ? 24 : 16) * scale;

    const canvasWidth = imgWidth + paddingX * 2;
    const canvasHeight = paddingY + (imgHeight * loadedImages.length) + (gap * (loadedImages.length - 1)) + paddingBottom;

    const canvas = document.createElement("canvas");
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (isFilmStrip) {
      // Draw black background for film strip
      ctx.fillStyle = "#0f0f0f";
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);
      
      // Draw sprocket holes
      ctx.fillStyle = "#e5e5e5";
      const holeWidth = 12 * scale;
      const holeHeight = 12 * scale;
      const holeSpacing = 24 * scale;
      const leftHoleX = 12 * scale;
      const rightHoleX = canvasWidth - 12 * scale - holeWidth;
      const borderRadius = 2 * scale;
      
      for (let y = 12 * scale; y < canvasHeight - (12 * scale); y += holeSpacing) {
        // Simple rounded rect approximation for holes
        ctx.beginPath();
        ctx.roundRect(leftHoleX, y, holeWidth, holeHeight, borderRadius);
        ctx.fill();
        
        ctx.beginPath();
        ctx.roundRect(rightHoleX, y, holeWidth, holeHeight, borderRadius);
        ctx.fill();
      }
    } else {
      // Draw white background for Polaroid
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    }

    // Draw each image onto the strip
    let currentY = paddingY;
    loadedImages.forEach((img) => {
      ctx.drawImage(img, paddingX, currentY, imgWidth, imgHeight);

      if (!isFilmStrip) {
        // Draw subtle border around each photo for Polaroid
        ctx.strokeStyle = "rgba(0, 0, 0, 0.05)";
        ctx.lineWidth = Math.max(1, 2 * scale);
        ctx.strokeRect(paddingX, currentY, imgWidth, imgHeight);
      }

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
