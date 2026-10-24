import { PhotoSessionProvider } from '@/components/PhotoSession'

export default function BoothLayout({ children }: { children: React.ReactNode }) {
  return (
    <PhotoSessionProvider>
      <main className="booth-app">
        <header className="topbar">
          <div className="brand-lockup">
            <div className="brand-mark">P</div>
            <div>
              <p className="eyebrow">THE OFFICIAL</p>
              <h1>PHOTO BOOTH</h1>
            </div>
          </div>
        </header>

        <div className="checker-rule" aria-hidden="true" />

        {children}
      </main>
    </PhotoSessionProvider>
  )
}
