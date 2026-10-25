'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { usePhotoSession } from '@/components/PhotoSession'
import { Check, Download, RotateCcw } from 'lucide-react'
import { exportPhotos } from '@/lib/exportPhotos'

const frames = [
  { name: 'No Frame', icon: '▦', detail: 'Clean & simple' },
  { name: 'Polaroid', icon: '▱', detail: 'Classic white border' },
  { name: 'Film Strip', icon: '▥', detail: 'The vintage favorite' },
]


export default function Page() {
  const router = useRouter()
  const { photos, setPhotos, selectedFrame, setSelectedFrame, isVertical, setIsVertical } = usePhotoSession()
  useEffect(() => {
    if (photos.length === 0) router.replace('/step-1')
  }, [photos.length, router])

  if (photos.length === 0) return null

  return (
    <section className="workspace">
      <div className="stage-column">
        <div className="stage-heading">
          <div>
            <p className="kicker">STEP 02 / MAKE IT YOURS</p>
          </div>
          <div className="step-pills" aria-label="Photo booth progress">
            <span className="done">&#10003;</span>
            <i />
            <span className="active">2</span>
          </div>
        </div>

          <div className={`review-card ${isVertical ? 'vertical' : 'horizontal'}`}>
            <div className={`photo-layout ${selectedFrame.toLowerCase().replace(' ', '-')}`}>
              {photos.map((photo, index) => (
                <img key={index} src={photo} alt={`Captured photobooth moment ${index + 1}`} />
              ))}
            </div>
          </div>
      </div>
      <aside className="control-panel">
        <div className="panel-section"><div className="section-label"><span>CHOOSE A FRAME</span></div><div className="frame-list">{frames.map(item => <button key={item.name} className={selectedFrame === item.name ? 'frame-option selected' : 'frame-option'} onClick={() => setSelectedFrame(item.name)}><span className="frame-icon">{item.icon}</span><span><strong>{item.name}</strong><small>{item.detail}</small></span>{selectedFrame === item.name && <Check size={17} />}</button>)}</div></div>
        <div className="panel-divider" />
        <div className="panel-section"><div className="section-label"><span>ORIENTATION</span></div><div className="orientation-toggle"><button className={isVertical ? 'selected' : ''} onClick={() => setIsVertical(true)}>VERTICAL</button><button className={!isVertical ? 'selected' : ''} onClick={() => setIsVertical(false)}>HORIZONTAL</button></div></div>
        <button className="primary-button export" onClick={() => exportPhotos(photos, selectedFrame, isVertical)}><Download size={20} /> EXPORT PHOTOS</button>
        <button className="secondary-button" onClick={() => { setPhotos([]); router.replace('/step-1') }}><RotateCcw size={17} /> RETAKE</button>
      </aside>
    </section>
  )
}
