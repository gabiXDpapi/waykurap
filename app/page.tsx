import Link from 'next/link'
import { EyeLogo } from '@/components/EyeLogo'
import styles from './page.module.css'

export default function Page() {
  return (
    <div className={styles.landing}>
      <a className={styles.skipLink} href="#main">Skip to content</a>
      <header className={`topbar ${styles.header}`}>
        <div className="brand-lockup"><EyeLogo /><h1>Way Kurap</h1></div>
        <nav className={styles.navigation} aria-label="Main navigation"><a href="#how-it-works">How it works</a><a href="#frames">Frames</a></nav>
        <Link className={styles.button} href="/step-1">Start photobooth</Link>
      </header>
      <div className="checker-rule" aria-hidden="true" />
      <main id="main">
        <section className={styles.hero} aria-labelledby="hero-title">
          <div>
            <p className={styles.badge}>↗ The photo booth in your browser</p>
            <h2 id="hero-title">Strike a pose. Take<br />home <em>the magic.</em></h2>
            <p className={styles.intro}>Snap those kulit shots with a proper countdown, dress your strip in a frame you love, and download it before the party moves on.</p>
            <div className={styles.actions}>
              <Link className={styles.button} href="/step-1">Start your session <span aria-hidden="true">→</span></Link>
              <a className={`${styles.button} ${styles.secondary}`} href="#how-it-works">See how it works</a>
            </div>
            <p className={styles.finePrint}>No sign up · Phone or laptop · Photos stay on your device</p>
          </div>
          <div className={styles.heroArt} aria-hidden="true">
            <span className={styles.roll}>Roll 04</span>
            <div className={styles.film}><span /><span /><span /><span /></div>
            <div className={styles.artCaption}><em>Way Kurap</em><span>Good times</span></div>
            <div className={styles.checkerSticker} />
          </div>
        </section>
        <div className={styles.ticker} aria-hidden="true"><span>Share ✶ Repeat ✶ Pose ✶ Print ✶ Share ✶ Repeat ✶ Pose ✶ Print ✶ Share ✶ Repeat ✶ Pose ✶ Print ✶</span></div>
        <section className={styles.section} id="how-it-works" aria-labelledby="steps-title">
          <p className={styles.eyebrow}>Step by step</p><h2 id="steps-title">From “ready?” to a strip you<br />keep</h2>
          <div className={styles.grid}>
            <article className={styles.step}><span className={styles.number}>01</span><h3>Capture</h3><p>Hit the shutter and the booth takes over — five seconds to get ready, then three between each shot.</p></article>
            <article className={styles.step}><span className={styles.number}>02</span><h3>Make it yours</h3><p>Pick a frame, flip the strip vertical or horizontal, and see it change before you commit.</p></article>
            <article className={styles.step}><span className={styles.number}>03</span><h3>Export</h3><p>Download the finished strip in one tap and drop it straight into the group chat.</p></article>
          </div>
        </section>
        <section className={styles.section} id="frames" aria-labelledby="frames-title">
          <p className={styles.eyebrow}>The frames</p><h2 id="frames-title">Three looks, one booth</h2>
          <div className={styles.grid}>
            <article className={styles.frame}>
              <div className={styles.preview} aria-hidden="true"><div className={styles.plainPhotos}><span /><span /><span /></div></div>
              <div className={styles.frameCopy}><h3>No frame</h3><p className={styles.tagline}>Clean &amp; simple</p><p>Bare photos on cream, nothing to distract from the faces.</p></div>
            </article>
            <article className={styles.frame}>
              <div className={styles.preview} aria-hidden="true"><div className={styles.polaroid}><span /></div></div>
              <div className={styles.frameCopy}><h3>Polaroid</h3><p className={styles.tagline}>Classic white border</p><p>Thick white border with space at the bottom to write your own caption.</p></div>
            </article>
            <article className={styles.frame}>
              <div className={`${styles.preview} ${styles.darkPreview}`} aria-hidden="true"><div className={`${styles.film} ${styles.miniFilm}`}><span /><span /><span /></div></div>
              <div className={styles.frameCopy}><h3>Film strip</h3><p className={styles.tagline}>The vintage favourite</p><p>Black strip with sprocket holes, straight off the reel.</p></div>
            </article>
          </div>
        </section>
      </main>
      <footer className={styles.footer}>
        <div className={styles.footerGrid}>
          <div><div className="brand-lockup"><EyeLogo /><span className={styles.footerBrand}>Way Kurap</span></div><p className={styles.footerCopy}>A browser photo booth for weddings, birthdays and<br />every night worth remembering.</p></div>
          <nav className={styles.footerNav} aria-label="Footer navigation"><p className={styles.eyebrow}>Explore</p><a href="#how-it-works">How it works</a><a href="#frames">Frames</a></nav>
          <div className={styles.footerStart}><p className={styles.eyebrow}>Start</p><p>Ready to say cheese?</p><Link className={styles.button} href="/step-1">Open the booth</Link></div>
        </div>
        <div className={styles.footerChecker} aria-hidden="true" /><p className={styles.copyright}>© 2026 Way Kurap</p>
      </footer>
    </div>
  )
}
