'use client'

import { useRouter } from 'next/navigation'
import { usePhotoSession } from '@/components/PhotoSession'

export function EndSession() {
  const { endSession } = usePhotoSession()
  const router = useRouter()
  return <button type="button" className="text-button" onClick={() => { endSession(); router.replace('/step-1') }}>End session</button>
}
