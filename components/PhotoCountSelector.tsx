interface PhotoCountSelectorProps {
  counts: number[];
  selectedCount: number;
  onSelectCount: (count: number) => void;
}

export function PhotoCountSelector({ counts, selectedCount, onSelectCount }: PhotoCountSelectorProps) {
  return (
    <div className="w-full xl:w-[380px] bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-100 p-8 flex flex-col shrink-0">
      <div className="flex items-center justify-center xl:justify-start gap-3 mb-8">
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#5B45FF]">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
          <circle cx="8.5" cy="8.5" r="1.5"/>
          <polyline points="21 15 16 10 5 21"/>
        </svg>
        <h2 className="text-[22px] font-extrabold text-[#0F172A] tracking-tight">Number of Photos</h2>
      </div>

      <div className="flex flex-col gap-4">
        {counts.map((count) => (
          <button
            key={count}
            onClick={() => onSelectCount(count)}
            className={`flex items-center justify-between w-full py-4 px-5 rounded-2xl text-left transition-all duration-200 border-2 ${
              selectedCount === count
                ? "border-[#5B45FF] bg-[#F5F3FF]"
                : "border-[#F1F5F9] bg-white hover:border-[#E2E8F0]"
            }`}
          >
            <span className={`font-semibold text-base ${selectedCount === count ? "text-[#1E1B4B]" : "text-[#475569]"}`}>
              {count} Photos
            </span>
            {selectedCount === count && (
              <div className="w-3 h-3 rounded-full bg-[#5B45FF] shadow-sm" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
