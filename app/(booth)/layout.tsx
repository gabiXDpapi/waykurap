import Image from 'next/image'
import { PhotoSessionProvider } from '@/components/PhotoSession'

export default function BoothLayout({ children }: { children: React.ReactNode }) {
  return (
    <PhotoSessionProvider>
      <main className="booth-app">
        <header className="topbar">
          <div className="brand-lockup">
            <Image className="brand-mark" src="/way-kurap-logo.svg" alt="" width={42} height={42} />
            <div>
              <p className="eyebrow">PHOTO BOOTH</p>
              <h1>Way Kurap</h1>
            </div>
          </div>
        </header>

        <div className="checker-rule" aria-hidden="true" />

        {children}
      </main>
    </PhotoSessionProvider>
  )
}
