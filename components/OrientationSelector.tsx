interface OrientationSelectorProps {
  isVertical: boolean;
  onSelectOrientation: (isVertical: boolean) => void;
}

export function OrientationSelector({ isVertical, onSelectOrientation }: OrientationSelectorProps) {
  return (
    <div className="w-full xl:w-[380px] bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-100 p-8 flex flex-col shrink-0">
      <div className="flex items-center justify-center xl:justify-start gap-3 mb-8">
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#5B45FF]">
          <path d="M12 22v-4" />
          <path d="M12 2v4" />
          <path d="M22 12h-4" />
          <path d="M2 12h4" />
          <path d="M19.071 4.929l-2.828 2.828" />
          <path d="M4.929 19.071l2.828-2.828" />
          <path d="M19.071 19.071l-2.828-2.828" />
          <path d="M4.929 4.929l2.828 2.828" />
        </svg>
        <h2 className="text-[22px] font-extrabold text-[#0F172A] tracking-tight">Choose Orientation</h2>
      </div>

      <div className="flex flex-col gap-4">
        {[
          { label: "Vertical", value: true },
          { label: "Horizontal", value: false },
        ].map((option) => (
          <button
            key={option.label}
            onClick={() => onSelectOrientation(option.value)}
            className={`flex items-center justify-between w-full py-4 px-5 rounded-2xl text-left transition-all duration-200 border-2 ${
              isVertical === option.value
                ? "border-[#5B45FF] bg-[#F5F3FF]"
                : "border-[#F1F5F9] bg-white hover:border-[#E2E8F0]"
            }`}
          >
            <span className={`font-semibold text-base ${isVertical === option.value ? "text-[#1E1B4B]" : "text-[#475569]"}`}>
              {option.label}
            </span>
            {isVertical === option.value && (
              <div className="w-3 h-3 rounded-full bg-[#5B45FF] shadow-sm" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
