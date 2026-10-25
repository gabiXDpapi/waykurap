import { EyeLogo } from '@/components/EyeLogo'
import { PhotoSessionProvider } from '@/components/PhotoSession'
import Link from 'next/link'

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
      </main>
    </PhotoSessionProvider>
  )
}
