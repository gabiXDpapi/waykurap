interface ActionButtonsProps {
  onTakePhoto?: () => void;
  onExportPhoto?: () => void;
  onRetake?: () => void;
  hasPhoto?: boolean;
}

export function ActionButtons({ onTakePhoto, onExportPhoto, onRetake, hasPhoto }: ActionButtonsProps) {
  return (
    <div className="w-full flex flex-col items-center justify-center gap-6 mt-8">
      {/* Main Take Photo Button */}
      {!hasPhoto && (
        <button 
          onClick={onTakePhoto}
          className="group relative flex items-center justify-center gap-3 px-10 py-4 bg-[#5B45FF] text-white rounded-full font-bold text-lg shadow-xl shadow-[#5B45FF]/30 hover:bg-[#4E39E0] hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:rotate-12 transition-transform">
            <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/>
            <circle cx="12" cy="13" r="3"/>
          </svg>
          Take Photo
        </button>
      )}

      {/* Secondary Actions */}
      {hasPhoto && (
        <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-4">
          <button 
            onClick={onExportPhoto}
            className="flex items-center justify-center gap-3 w-full sm:w-64 py-4 bg-white border border-[#E2E8F0] text-[#0F172A] rounded-2xl font-semibold text-[15px] shadow-sm hover:bg-slate-50 hover:border-slate-300 transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" x2="12" y1="15" y2="3"/>
            </svg>
            Export Photo
          </button>
          
          <button 
            onClick={onRetake}
            className="flex items-center justify-center gap-3 w-full sm:w-64 py-4 bg-white border border-[#E2E8F0] text-[#334155] rounded-2xl font-semibold text-[15px] hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
              <path d="M3 3v5h5"/>
            </svg>
            Retake
          </button>
        </div>
      )}
    </div>
  );
}
