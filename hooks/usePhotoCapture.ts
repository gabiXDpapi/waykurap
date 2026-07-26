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

  const handleExportPhoto = async (selectedFrame: string = "Polaroid", isVertical: boolean = true) => {
    if (photos.length === 0) return;

    const isFilmStrip = selectedFrame === "Film Strip";
    const isPolaroid = selectedFrame === "Polaroid";

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
    const scale = imgWidth / 400;

    let canvasWidth, canvasHeight;
    const canvas = document.createElement("canvas");

    if (isPolaroid) {
      const pPadX = 12 * scale;
      const pPadTop = 12 * scale;
      const pPadBottom = 32 * scale;
      const cardWidth = imgWidth + pPadX * 2;
      const cardHeight = imgHeight + pPadTop + pPadBottom;
      
      const padding = 64 * scale;
      const overlap = -60 * scale;

      if (isVertical) {
        canvasWidth = cardWidth + padding * 2;
        canvasHeight = padding * 2 + cardHeight + (cardHeight + overlap) * (loadedImages.length - 1);
      } else {
        canvasWidth = padding * 2 + cardWidth + (cardWidth + overlap) * (loadedImages.length - 1);
        canvasHeight = cardHeight + padding * 2;
      }
      
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Draw white background
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);

      const polaroidRotations = [-6, 4, -3, 5, -5, 3];
      const polaroidShifts = [-10, 10, -5, 15, -10, 8];

      let currentX = padding;
      let currentY = padding;

      loadedImages.forEach((img, i) => {
        ctx.save();
        
        const rot = polaroidRotations[i % polaroidRotations.length] * Math.PI / 180;
        const shift = polaroidShifts[i % polaroidShifts.length] * scale;

        if (i > 0) {
          if (isVertical) {
            currentY += cardHeight + overlap;
          } else {
            currentX += cardWidth + overlap;
          }
        }
        
        const cx = currentX + cardWidth / 2 + (isVertical ? shift : 0);
        const cy = currentY + cardHeight / 2 + (!isVertical ? shift : 0);
        
        ctx.translate(cx, cy);
        ctx.rotate(rot);
        
        // Draw shadow
        ctx.shadowColor = "rgba(0,0,0,0.15)";
        ctx.shadowBlur = 20 * scale;
        ctx.shadowOffsetY = 10 * scale;
        
        // Draw white card
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(-cardWidth / 2, -cardHeight / 2, cardWidth, cardHeight);
        
        ctx.shadowColor = "transparent";

        // Draw image
        const imgX = -cardWidth / 2 + pPadX;
        const imgY = -cardHeight / 2 + pPadTop;
        ctx.drawImage(img, imgX, imgY, imgWidth, imgHeight);

        // Draw subtle border around card
        ctx.strokeStyle = "rgba(0, 0, 0, 0.05)";
        ctx.lineWidth = Math.max(1, 2 * scale);
        ctx.strokeRect(-cardWidth / 2, -cardHeight / 2, cardWidth, cardHeight);

        ctx.restore();
      });

    } else {
      // Film Strip or default layout
      const paddingX = (isFilmStrip ? 40 : 16) * scale;
      const paddingY = (isFilmStrip ? 32 : 16) * scale;
      const paddingBottom = (isFilmStrip ? 32 : 64) * scale;
      const gap = (isFilmStrip ? 24 : 16) * scale;

      canvasWidth = imgWidth + paddingX * 2;
      canvasHeight = paddingY + (imgHeight * loadedImages.length) + (gap * (loadedImages.length - 1)) + paddingBottom;
      
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      if (isFilmStrip) {
        ctx.fillStyle = "#0f0f0f";
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        
        ctx.fillStyle = "#e5e5e5";
        const holeWidth = 12 * scale;
        const holeHeight = 12 * scale;
        const holeSpacing = 24 * scale;
        const leftHoleX = 12 * scale;
        const rightHoleX = canvasWidth - 12 * scale - holeWidth;
        const borderRadius = 2 * scale;
        
        for (let y = 12 * scale; y < canvasHeight - (12 * scale); y += holeSpacing) {
          ctx.beginPath();
          ctx.roundRect(leftHoleX, y, holeWidth, holeHeight, borderRadius);
          ctx.fill();
          
          ctx.beginPath();
          ctx.roundRect(rightHoleX, y, holeWidth, holeHeight, borderRadius);
          ctx.fill();
        }
      } else {
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
      }

      let currentY = paddingY;
      loadedImages.forEach((img) => {
        ctx.drawImage(img, paddingX, currentY, imgWidth, imgHeight);

        if (!isFilmStrip) {
          ctx.strokeStyle = "rgba(0, 0, 0, 0.05)";
          ctx.lineWidth = Math.max(1, 2 * scale);
          ctx.strokeRect(paddingX, currentY, imgWidth, imgHeight);
        }

        currentY += imgHeight + gap;
      });
    }

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
