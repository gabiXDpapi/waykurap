import Image from 'next/image'
import { PhotoSessionProvider } from '@/components/PhotoSession'

export default function BoothLayout({ children }: { children: React.ReactNode }) {
  return (
    <PhotoSessionProvider>
      <main className="booth-app">
        <header className="topbar">
          <div className="brand-lockup">
            <Image className="brand-mark" src="/way-kurap-logo.svg" alt="" width={42} height={42} />
            <h1>Way Kurap</h1>
          </div>
        </header>

        <div className="checker-rule" aria-hidden="true" />

        {children}
      </main>
    </PhotoSessionProvider>
  )
}
