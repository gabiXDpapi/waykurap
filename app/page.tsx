"use client";

import { useState } from "react";
import { useCamera } from "../hooks/useCamera";
import { CameraPreview } from "../components/CameraPreview";
import { ActionButtons } from "../components/ActionButtons";
import { FrameSelector } from "../components/FrameSelector";

const FRAMES = ["No Frame", "Polaroid", "Film Strip", "Neon Lights", "Elegant Gold"];

export default function Home() {
  const { videoRef, stream, error } = useCamera();
  const [selectedFrame, setSelectedFrame] = useState(FRAMES[1]); // Default to Polaroid

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#F8FAFC] font-sans p-6 md:p-12">
      <div className="flex flex-col xl:flex-row items-center xl:items-start justify-center w-full max-w-7xl gap-8">
      
        {/* Video & Action Buttons Area */}
        <div className="w-full max-w-4xl flex flex-col items-center">
          <CameraPreview videoRef={videoRef} stream={stream} error={error} />
          <ActionButtons />
        </div>

        {/* Sidebar UI (Frames only) */}
        <FrameSelector 
          frames={FRAMES} 
          selectedFrame={selectedFrame} 
          onSelectFrame={setSelectedFrame} 
        />

      </div>
    </div>
  );
}
