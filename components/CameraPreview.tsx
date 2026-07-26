import { RefObject } from "react";

interface CameraPreviewProps {
  videoRef: RefObject<HTMLVideoElement | null>;
  stream: MediaStream | null;
  error: string;
  photos?: string[];
  isComplete?: boolean;
  countdown?: number | null;
  showFlash?: boolean;
  selectedFrame?: string;
}

export function CameraPreview({ videoRef, stream, error, photos = [], isComplete = false, countdown = null, showFlash = false, selectedFrame = "Polaroid" }: CameraPreviewProps) {
  const isFilmStrip = selectedFrame === "Film Strip";
  const isPolaroid = selectedFrame === "Polaroid";

  let containerClasses = 'aspect-video bg-zinc-900 rounded-[2rem] overflow-hidden shadow-2xl border border-zinc-200';
  if (isComplete && photos.length > 0) {
    if (isFilmStrip) {
      containerClasses = 'bg-[#0f0f0f] py-8 px-10 max-w-sm mx-auto shadow-2xl relative';
    } else if (isPolaroid) {
      containerClasses = 'bg-[#8B7355] py-12 px-8 max-w-md mx-auto shadow-2xl relative overflow-hidden';
    } else {
      containerClasses = 'bg-white p-4 pb-16 max-w-sm mx-auto shadow-2xl relative';
    }
  }

  return (
    <div className="w-full max-w-4xl flex flex-col items-center gap-8">
      {error && (
        <div className="w-full px-6 py-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-600 text-center shadow-sm">
          <p className="font-semibold text-lg mb-1">Unable to access camera</p>
          <p className="text-sm opacity-90">{error}</p>
        </div>
      )}

      <div className={`relative w-full ${containerClasses}`}>
        {!stream && !error && !isComplete && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-400 bg-zinc-50">
            <div className="w-10 h-10 mb-6 border-4 border-[#5B45FF]/30 border-t-[#5B45FF] rounded-full animate-spin" />
            <p className="text-lg font-medium text-zinc-600">Waiting for camera permission...</p>
            <p className="text-sm text-zinc-500 mt-2">Please accept the browser popup to continue</p>
          </div>
        )}

        {isComplete && photos.length > 0 && (
          <>
            {isFilmStrip && (
              <>
                <div className="absolute left-3 top-0 bottom-0 w-3 bg-[repeating-linear-gradient(to_bottom,transparent,transparent_12px,#e5e5e5_12px,#e5e5e5_24px)] opacity-90" />
                <div className="absolute right-3 top-0 bottom-0 w-3 bg-[repeating-linear-gradient(to_bottom,transparent,transparent_12px,#e5e5e5_12px,#e5e5e5_24px)] opacity-90" />
                <div className="w-full flex flex-col gap-6">
                  {photos.map((p, i) => (
                    <img key={i} src={p} alt={`Captured ${i + 1}`} className="w-full object-cover shadow-sm" />
                  ))}
                </div>
              </>
            )}
            
            {isPolaroid && (
              <div className="w-full flex flex-col items-center relative py-4">
                {photos.map((p, i) => {
                  const polaroidRotations = [-6, 4, -3, 5, -5, 3];
                  const polaroidTranslations = [-10, 10, -5, 15, -10, 8];
                  const rot = polaroidRotations[i % polaroidRotations.length];
                  const transX = polaroidTranslations[i % polaroidTranslations.length];
                  
                  return (
                    <div 
                      key={i} 
                      className="bg-white p-3 pb-12 shadow-2xl border border-black/5 transition-transform hover:scale-[1.02] hover:z-50 relative cursor-pointer"
                      style={{ 
                        transform: `rotate(${rot}deg) translateX(${transX}px)`,
                        marginTop: i === 0 ? '0' : '-60px',
                        zIndex: i
                      }}
                    >
                      <img src={p} alt={`Captured ${i + 1}`} className="w-full aspect-square object-cover" />
                      <p 
                        className="text-center text-slate-700 mt-4 text-xl tracking-wide"
                        style={{ fontFamily: "'Caveat', 'Comic Sans MS', cursive" }}
                      >
                        Your Text Here
                      </p>
                    </div>
                  );
                })}
              </div>
            )}

            {!isFilmStrip && !isPolaroid && (
              <div className="w-full flex flex-col gap-4">
                {photos.map((p, i) => (
                  <img key={i} src={p} alt={`Captured ${i + 1}`} className="w-full object-cover shadow-sm border border-black/5" />
                ))}
              </div>
            )}
          </>
        )}
        
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`w-full h-full object-cover transition-opacity duration-1000 ${stream ? 'opacity-100' : 'opacity-0'} ${isComplete && photos.length > 0 ? 'hidden' : 'block'}`}
        />

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
