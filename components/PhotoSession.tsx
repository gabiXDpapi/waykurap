'use client'

import { createContext, useContext, useState } from 'react'
import { PHOTO_COUNTS } from '@/constants/config'

function useSessionState() {
  const [sessionId, setSessionId] = useState(0)
  const [photos, setPhotos] = useState<string[]>([])
  const [photoCount, setPhotoCount] = useState(PHOTO_COUNTS[1] || 4)
  const [selectedFrame, setSelectedFrame] = useState('Film Strip')
  const [isVertical, setIsVertical] = useState(true)
  function endSession() {
    setPhotos([])
    setSessionId(id => id + 1)
  }
  return { sessionId, endSession, photos, setPhotos, photoCount, setPhotoCount, selectedFrame, setSelectedFrame, isVertical, setIsVertical }
}

const PhotoSession = createContext<ReturnType<typeof useSessionState> | null>(null)

export function PhotoSessionProvider({ children }: { children: React.ReactNode }) {
  const session = useSessionState()
  // Remount the booth to stop camera tracks and cancel pending captures, even on the same route.
  return <PhotoSession.Provider key={session.sessionId} value={session}>{children}</PhotoSession.Provider>
}

export function usePhotoSession() {
  const session = useContext(PhotoSession)
  if (!session) throw new Error('Photo session requires PhotoSessionProvider')
  return session
}
