interface FrameSelectorProps {
  frames: string[];
  selectedFrame: string;
  onSelectFrame: (frame: string) => void;
}

export function FrameSelector({ frames, selectedFrame, onSelectFrame }: FrameSelectorProps) {
  return (
    <div className="w-full xl:w-[380px] bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-100 p-8 flex flex-col shrink-0">
      <div className="flex items-center justify-center xl:justify-start gap-3 mb-8">
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#5B45FF]">
          <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
          <circle cx="9" cy="9" r="2"/>
          <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
        </svg>
        <h2 className="text-[22px] font-extrabold text-[#0F172A] tracking-tight">Choose a Frame</h2>
      </div>

      <div className="flex flex-col gap-4">
        {frames.map((frame) => (
          <button
            key={frame}
            onClick={() => onSelectFrame(frame)}
            className={`flex items-center justify-between w-full py-4 px-5 rounded-2xl text-left transition-all duration-200 border-2 ${
              selectedFrame === frame
                ? "border-[#5B45FF] bg-[#F5F3FF]"
                : "border-[#F1F5F9] bg-white hover:border-[#E2E8F0]"
            }`}
          >
            <span className={`font-semibold text-base ${selectedFrame === frame ? "text-[#1E1B4B]" : "text-[#475569]"}`}>
              {frame}
            </span>
            {selectedFrame === frame && (
              <div className="w-3 h-3 rounded-full bg-[#5B45FF] shadow-sm" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
