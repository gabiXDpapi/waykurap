import { EyeLogo } from '@/components/EyeLogo'
import { PhotoSessionProvider } from '@/components/PhotoSession'
import Link from 'next/link'
import { EndSession } from '@/components/EndSession'
import { CreatorCredit } from '@/components/CreatorCredit'

export default function BoothLayout({ children }: { children: React.ReactNode }) {
  return (
    <PhotoSessionProvider>
      <main className="booth-app">
        <header className="topbar">
          <Link href="/" className="brand-lockup" aria-label="Way Kurap home">
            <EyeLogo />
            <h1>Way Kurap</h1>
          </Link>
        </header>

        <div className="checker-rule" aria-hidden="true" />

        {children}
        <footer className="booth-footer">
          <div className="session-end">
            <EndSession />
            <p>End session clears your photos and turns off the camera. Choose Enable camera on the capture screen to start again. Files you downloaded stay on your device.</p>
          </div>
          <div className="booth-creator">
            <CreatorCredit />
          </div>
        </footer>
      </main>
    </PhotoSessionProvider>
  )
}
