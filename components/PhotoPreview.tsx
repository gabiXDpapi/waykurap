'use client'

import { useEffect, useState } from 'react'
import { renderPhotos } from '@/lib/exportPhotos'

export function PhotoPreview({ photos, selectedFrame, isVertical }: {
  photos: string[]
  selectedFrame: string
  isVertical: boolean
}) {
  const [result, setResult] = useState<{ src?: string; error?: string } | null>(null)

  useEffect(() => {
    let cancelled = false
    renderPhotos(photos, selectedFrame, isVertical).then(
      src => { if (!cancelled) setResult({ src }) },
      () => { if (!cancelled) setResult({ error: 'Could not prepare the preview. Choose another frame to retry.' }) },
    )
    return () => { cancelled = true }
  }, [photos, selectedFrame, isVertical])

  if (result?.error) return <p role="alert">{result.error}</p>
  if (!result?.src) return <p role="status">Preparing your photos…</p>

  return (
    // The locally generated PNG is also the export format; no image optimization is needed.
    // eslint-disable-next-line @next/next/no-img-element
    <img className="photo-preview" src={result.src} alt={`${photos.length} photos in ${isVertical ? 'vertical' : 'horizontal'} ${selectedFrame} layout with the Waykurap eye logo watermark at the bottom right`} />
  )
}
