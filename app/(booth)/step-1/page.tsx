'use client'

import { useRouter } from 'next/navigation'
import { usePhotoSession } from '@/components/PhotoSession'
import { Camera, Check } from 'lucide-react'
import { useCamera } from '@/hooks/useCamera'
import { usePhotoCapture } from '@/hooks/usePhotoCapture'
import { PHOTO_COUNTS } from '@/constants/config'

export default function Page() {
  const router = useRouter()
  const { photoCount, setPhotoCount, setPhotos } = usePhotoSession()
  const { videoRef, stream, error } = useCamera()
  const { countdown, isCapturing, showFlash, handleTakePhoto } = usePhotoCapture(videoRef)

  async function takePhotos() {
    const photos = await handleTakePhoto(photoCount)
    if (photos?.length === photoCount) {
      setPhotos(photos)
      router.push('/step-2')
    }
  }

  return (
    <section className="workspace">
      <div className="stage-column">
        <div className="stage-heading">
          <div>
            <p className="kicker">STEP 01 / CAPTURE</p>
          </div>
          <div className="step-pills" aria-label="Photo booth progress">
            <span className="active">1</span>
            <i />
            <span>2</span>
          </div>
        </div>

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

              {countdown !== null && (
                <div className={`countdown z-10 ${countdown === 'GET READY' ? 'countdown-ready' : ''}`}>{countdown === 'GET READY' ? 'Get Ready!' : countdown}</div>
              )}
            </div>
            <div className="mt-4 flex justify-center items-center">
              <button
                onClick={takePhotos}
                disabled={isCapturing || !stream}
                className="w-16 h-16 bg-[#ff3b30] rounded-full flex items-center justify-center text-white shadow-[0_2px_4px_rgba(0,0,0,0.2),inset_0_1px_2px_rgba(255,255,255,0.4)] border border-[#d63028] hover:bg-[#ff2d20] active:scale-95 transition-all disabled:opacity-50 disabled:active:scale-100"
                aria-label="Take Photo"
              >
                <Camera size={28} fill="currentColor" strokeWidth={1} />
              </button>
            </div>
          </div>
      </div>
      <aside className="control-panel">
        <div className="panel-section">
          <div className="section-label"><span>HOW MANY PHOTOS?</span></div>
          <div className="count-grid">{PHOTO_COUNTS.map(option => <button key={option} className={photoCount === option ? 'count-option selected' : 'count-option'} disabled={isCapturing} onClick={() => setPhotoCount(option)}><strong>{option}</strong><span>photos</span>{photoCount === option && <Check size={15} />}</button>)}</div>
        </div>
        <div className="panel-divider" />
      </aside>
    </section>
  )
}
