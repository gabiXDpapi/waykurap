'use client'

import Link from 'next/link'
import { usePhotoSession } from '@/components/PhotoSession'

export function EndSession() {
  const { setPhotos } = usePhotoSession()
  return <Link href="/" replace className="text-button" onClick={() => setPhotos([])}>End session</Link>
}
