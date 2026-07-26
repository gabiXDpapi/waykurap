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
  const { photos, countdown, isCapturing, showFlash, handleTakePhoto, handleExportPhoto, handleRetake } = usePhotoCapture(videoRef);
  const [selectedFrame, setSelectedFrame] = useState(FRAMES[1]); // Default to Polaroid
  const [photoCount, setPhotoCount] = useState(PHOTO_COUNTS[0]); // Default to 3

  const [isVertical, setIsVertical] = useState(true);
  const isComplete = photos.length >= photoCount;

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#F8FAFC] font-sans p-6 md:p-12">
      <div className="flex flex-col xl:flex-row items-center xl:items-start justify-center w-full max-w-7xl gap-8">

        {/* Video & Action Buttons Area */}
        <div className="w-full max-w-4xl flex flex-col items-center">
          <CameraPreview
            videoRef={videoRef}
            stream={stream}
            error={error}
            photos={photos}
            isComplete={isComplete}
            countdown={countdown}
            showFlash={showFlash}
            selectedFrame={selectedFrame}
            isVertical={isVertical}
          />
          
          {isComplete && selectedFrame === "Polaroid" && (
            <button
              onClick={() => setIsVertical(!isVertical)}
              className="mt-6 flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-full font-medium hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform duration-300 ${isVertical ? 'rotate-90' : 'rotate-0'}`}>
                <path d="M3 12h18" />
                <path d="M14 5l7 7-7 7" />
              </svg>
              {isVertical ? 'Change to Horizontal' : 'Change to Vertical'}
            </button>
          )}

          <ActionButtons
            onTakePhoto={() => handleTakePhoto(photoCount)}
            onExportPhoto={() => handleExportPhoto(selectedFrame, isVertical)}
            onRetake={handleRetake}
            isComplete={isComplete}
            isCapturing={isCapturing}
          />
        </div>

        {/* Sidebar UI (Options) */}
        <div className="flex flex-col gap-6 w-full xl:w-auto items-center xl:items-start">
          {isComplete ? (
            <FrameSelector
              frames={FRAMES}
              selectedFrame={selectedFrame}
              onSelectFrame={setSelectedFrame}
            />
          ) : (
            <PhotoCountSelector
              counts={PHOTO_COUNTS}
              selectedCount={photoCount}
              onSelectCount={setPhotoCount}
            />
          )}
        </div>

      </div>
    </div>
  );
}
