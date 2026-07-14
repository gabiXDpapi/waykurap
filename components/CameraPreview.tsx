import { RefObject } from "react";

interface CameraPreviewProps {
  videoRef: RefObject<HTMLVideoElement | null>;
  stream: MediaStream | null;
  error: string;
  photos?: string[];
  isComplete?: boolean;
  countdown?: number | null;
  showFlash?: boolean;
}

export function CameraPreview({ videoRef, stream, error, photos = [], isComplete = false, countdown = null, showFlash = false }: CameraPreviewProps) {
  return (
    <div className="w-full max-w-4xl flex flex-col items-center gap-8">
      {error && (
        <div className="w-full px-6 py-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-600 text-center shadow-sm">
          <p className="font-semibold text-lg mb-1">Unable to access camera</p>
          <p className="text-sm opacity-90">{error}</p>
        </div>
      )}

      <div className="relative w-full aspect-video bg-zinc-900 rounded-[2rem] overflow-hidden shadow-2xl border border-zinc-200">
        {!stream && !error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-400 bg-zinc-50">
            <div className="w-10 h-10 mb-6 border-4 border-[#5B45FF]/30 border-t-[#5B45FF] rounded-full animate-spin" />
            <p className="text-lg font-medium text-zinc-600">Waiting for camera permission...</p>
            <p className="text-sm text-zinc-500 mt-2">Please accept the browser popup to continue</p>
          </div>
        )}

        {isComplete && photos.length > 0 ? (
          <div className={`w-full h-full grid gap-2 p-2 ${photos.length === 1 ? 'grid-cols-1' : photos.length === 2 ? 'grid-cols-2' : 'grid-cols-2 lg:grid-cols-3'} bg-zinc-100`}>
            {photos.map((p, i) => (
              <img key={i} src={p} alt={`Captured ${i + 1}`} className="w-full h-full object-cover rounded-xl shadow-sm" />
            ))}
          </div>
        ) : (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={`w-full h-full object-cover transition-opacity duration-1000 ${stream ? 'opacity-100' : 'opacity-0'}`}
          />
        )}

        {/* Capture Flash Overlay */}
        <div className={`absolute inset-0 bg-white pointer-events-none transition-opacity duration-75 z-20 ${showFlash ? 'opacity-100' : 'opacity-0'}`} />

        {countdown !== null && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 z-10 backdrop-blur-sm">
            <span className="text-[180px] font-black text-white drop-shadow-[0_0_40px_rgba(255,255,255,0.4)] animate-pulse">
              {countdown}
            </span>
          </div>
        )}

        {stream && !isComplete && countdown === null && (
          <div className="absolute top-6 left-6 flex items-center gap-3 px-4 py-2 bg-black/40 backdrop-blur-md rounded-full border border-white/20 shadow-xl">
            <div className="w-3 h-3 rounded-full bg-rose-500 animate-pulse" />
            <span className="text-sm font-bold text-white tracking-wider uppercase">Live</span>
          </div>
        )}
      </div>
    </div>
  );
}
