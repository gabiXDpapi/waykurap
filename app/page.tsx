'use client'

import { useState } from 'react'
import { ArrowDown, ArrowRight, Camera, Check, ChevronDown, CircleHelp, Download, RotateCcw, Sparkles, Star, X } from 'lucide-react'
import { useCamera } from "../hooks/useCamera";
import { usePhotoCapture } from "../hooks/usePhotoCapture";
import { PHOTO_COUNTS } from "../constants/config";

const frames = [
  { name: 'No Frame', icon: '▦', detail: 'Clean & simple' },
  { name: 'Polaroid', icon: '▱', detail: 'Classic white border' },
  { name: 'Film Strip', icon: '▥', detail: 'The vintage favorite' },
]

export default function Page() {
  const { videoRef, stream, error } = useCamera();
  const { photos, countdown, isCapturing, showFlash, handleTakePhoto, handleExportPhoto, handleRetake } = usePhotoCapture(videoRef);

  const [photoCount, setPhotoCount] = useState(PHOTO_COUNTS[1] || 4)
  const [selectedFrame, setSelectedFrame] = useState('Film Strip')
  const [isVertical, setIsVertical] = useState(true)

  const isComplete = photos.length >= photoCount;
  const mode = isComplete ? 'review' : 'capture';

  return (
    <main className="booth-app">
      <header className="topbar">
        <div className="brand-lockup">
          <div className="brand-mark">P</div>
          <div>
            <p className="eyebrow">THE OFFICIAL</p>
            <h1>PHOTO BOOTH</h1>
          </div>
        </div>
      </header>

      <div className="checker-rule" aria-hidden="true" />

      <section className="workspace">
        <div className="stage-column">
          <div className="stage-heading">
            <div>
              <p className="kicker">{mode === 'capture' ? 'STEP 01 / CAPTURE' : 'STEP 02 / MAKE IT YOURS'}</p>
            </div>
            <div className="step-pills" aria-label="Photo booth progress">
              <span className={mode === 'capture' ? 'active' : 'done'}>{mode === 'capture' ? '1' : '✓'}</span>
              <i />
              <span className={mode === 'review' ? 'active' : ''}>2</span>
            </div>
          </div>

          {mode === 'capture' ? (
            <div className="camera-card">
              <div className="camera-view relative w-full max-w-[600px] mx-auto aspect-[4/3]">
                <div className="corner corner-tl z-10" /><div className="corner corner-tr z-10" /><div className="corner corner-bl z-10" /><div className="corner corner-br z-10" />

                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${stream ? 'opacity-100' : 'opacity-0'}`}
                />

                <div className={`absolute inset-0 bg-white pointer-events-none transition-opacity duration-75 z-20 ${showFlash ? 'opacity-100' : 'opacity-0'}`} />

                {!stream && (
                  <div className="view-content relative z-10 bg-black/40 p-6 rounded-xl backdrop-blur-sm m-4">
                    <div className="view-copy">
                      <Camera size={31} strokeWidth={1.5} />
                      <span>{error ? 'Camera Access Denied' : 'Waiting for camera...'}</span>
                      <small>{error || 'Please allow camera permissions'}</small>
                    </div>
                  </div>
                )}

                <div className="absolute top-4 left-4 z-10">
                  {stream && <div className="live-badge"><span /> LIVE</div>}
                </div>

                {countdown !== null && (
                  <div className="countdown z-10">{countdown}</div>
                )}
              </div>
              <div className="mt-4 flex justify-center items-center">
                <button
                  onClick={() => handleTakePhoto(photoCount)}
                  disabled={isCapturing || !stream}
                  className="w-16 h-16 bg-[#ff3b30] rounded-full flex items-center justify-center text-white shadow-[0_2px_4px_rgba(0,0,0,0.2),inset_0_1px_2px_rgba(255,255,255,0.4)] border border-[#d63028] hover:bg-[#ff2d20] active:scale-95 transition-all disabled:opacity-50 disabled:active:scale-100"
                  aria-label="Take Photo"
                >
                  <Camera size={28} fill="currentColor" strokeWidth={1} />
                </button>
              </div>
            </div>
          ) : (
            <div className={`review-card ${isVertical ? 'vertical' : 'horizontal'}`}>
              <div className={`photo-layout ${selectedFrame.toLowerCase().replace(' ', '-')}`}>
                {photos.map((photo, index) => (
                  <img key={index} src={photo} alt={`Captured photobooth moment ${index + 1}`} />
                ))}
              </div>
            </div>
          )}
        </div>

        <aside className="control-panel">
          <div className="panel-ribbon">{mode === 'capture' ? "LET'S MAKE SOME MAGIC" : 'THE FINISHING TOUCHES'}</div>
          {mode === 'capture' ? (
            <>
              <div className="panel-section">
                <div className="section-label"><span>HOW MANY PHOTOS?</span></div>
                <div className="count-grid">{PHOTO_COUNTS.map(option => <button key={option} className={photoCount === option ? 'count-option selected' : 'count-option'} onClick={() => setPhotoCount(option)}><strong>{option}</strong><span>photos</span>{photoCount === option && <Check size={15} />}</button>)}</div>
              </div>
              <div className="panel-divider" />
            </>
          ) : (
            <>
              <div className="panel-section"><div className="section-label"><span>CHOOSE A FRAME</span></div><div className="frame-list">{frames.map(item => <button key={item.name} className={selectedFrame === item.name ? 'frame-option selected' : 'frame-option'} onClick={() => setSelectedFrame(item.name)}><span className="frame-icon">{item.icon}</span><span><strong>{item.name}</strong><small>{item.detail}</small></span>{selectedFrame === item.name && <Check size={17} />}</button>)}</div></div>
              <div className="panel-divider" />
              <div className="panel-section"><div className="section-label"><span>ORIENTATION</span></div><div className="orientation-toggle"><button className={isVertical ? 'selected' : ''} onClick={() => setIsVertical(true)}>VERTICAL</button><button className={!isVertical ? 'selected' : ''} onClick={() => setIsVertical(false)}>HORIZONTAL</button></div></div>
              <button className="primary-button export" onClick={() => handleExportPhoto(selectedFrame, isVertical)}><Download size={20} /> EXPORT PHOTOS</button>
              <button className="secondary-button" onClick={handleRetake}><RotateCcw size={17} /> RETAKE</button>
            </>
          )}
        </aside>
      </section>
    </main>
  )
}
