"use client";

import { useState } from "react";
import { useCamera } from "../hooks/useCamera";
import { usePhotoCapture } from "../hooks/usePhotoCapture";
import { CameraPreview } from "../components/CameraPreview";
import { ActionButtons } from "../components/ActionButtons";
import { FrameSelector } from "../components/FrameSelector";
import { PhotoCountSelector } from "../components/PhotoCountSelector";
import { FRAMES, PHOTO_COUNTS } from "../constants/config";

export default function Home() {
  const { videoRef, stream, error } = useCamera();
  const { photo, handleTakePhoto, handleExportPhoto, handleRetake } = usePhotoCapture(videoRef);
  const [selectedFrame, setSelectedFrame] = useState(FRAMES[1]); // Default to Polaroid
  const [photoCount, setPhotoCount] = useState(PHOTO_COUNTS[0]); // Default to 3

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#F8FAFC] font-sans p-6 md:p-12">
      <div className="flex flex-col xl:flex-row items-center xl:items-start justify-center w-full max-w-7xl gap-8">
      
        {/* Video & Action Buttons Area */}
        <div className="w-full max-w-4xl flex flex-col items-center">
          <CameraPreview videoRef={videoRef} stream={stream} error={error} photo={photo} />
          <ActionButtons 
            onTakePhoto={handleTakePhoto}
            onExportPhoto={handleExportPhoto}
            onRetake={handleRetake}
            hasPhoto={!!photo}
          />
        </div>

        {/* Sidebar UI (Options) */}
        <div className="flex flex-col gap-6 w-full xl:w-auto items-center xl:items-start">
          <FrameSelector 
            frames={FRAMES} 
            selectedFrame={selectedFrame} 
            onSelectFrame={setSelectedFrame} 
          />
          <PhotoCountSelector 
            counts={PHOTO_COUNTS}
            selectedCount={photoCount}
            onSelectCount={setPhotoCount}
          />
        </div>

      </div>
    </div>
  );
}
