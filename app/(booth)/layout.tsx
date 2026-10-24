import { EyeLogo } from '@/components/EyeLogo'
import { PhotoSessionProvider } from '@/components/PhotoSession'

export default function BoothLayout({ children }: { children: React.ReactNode }) {
  return (
    <PhotoSessionProvider>
      <main className="booth-app">
        <header className="topbar">
          <div className="brand-lockup">
            <EyeLogo />
            <h1>Way Kurap</h1>
          </div>
        </header>

        <div className="checker-rule" aria-hidden="true" />

        {children}
      </main>
    </PhotoSessionProvider>
  )
}
