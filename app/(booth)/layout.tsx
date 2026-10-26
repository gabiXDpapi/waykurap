import { EyeLogo } from '@/components/EyeLogo'
import { PhotoSessionProvider } from '@/components/PhotoSession'
import Link from 'next/link'
import { EndSession } from '@/components/EndSession'

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
        <footer className="px-6 pb-6 text-center text-sm">
          <EndSession />
          <p>End session clears your photos from the booth and turns off the camera. Files you downloaded stay on your device.</p>
        </footer>
      </main>
    </PhotoSessionProvider>
  )
}
