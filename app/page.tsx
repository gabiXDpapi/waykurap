import Link from 'next/link'
import { EyeLogo } from '@/components/EyeLogo'
import { CreatorCredit } from '@/components/CreatorCredit'
import Image from 'next/image'
import { Camera } from 'lucide-react'
import styles from './page.module.css'

export default function Page() {
  return (
    <div className={styles.landing}>
      <a className={styles.skipLink} href="#main">Skip to content</a>
      <header className={`topbar ${styles.header}`}>
        <Link href="/" className="brand-lockup" aria-label="Way Kurap home"><EyeLogo /><h1>Way Kurap</h1></Link>
        <nav className={styles.navigation} aria-label="Main navigation"><a href="#how-it-works">How it works</a><a href="#frames">Frames</a></nav>
        <Link className={styles.button} href="/step-1">Start photobooth</Link>
      </header>
      <div className="checker-rule" aria-hidden="true" />
      <main id="main">
        <section className={styles.hero} aria-labelledby="hero-title">
          <div>
            <h2 id="hero-title">Strike a pose. Take<br />home <em>the magic.</em></h2>
            <p className={styles.intro}>Snap those kulit shots with a proper countdown, dress your strip in a frame you love, and download it before the party moves on.</p>
            <div className={styles.actions}>
              <Link className={styles.button} href="/step-1">Start your session <span aria-hidden="true">→</span></Link>
              <a className={`${styles.button} ${styles.secondary}`} href="#how-it-works">See how it works</a>
            </div>
            <p className={styles.finePrint}>No sign up · Phone or laptop · Photos stay on your device</p>
          </div>
          <div className={`camera-card ${styles.heroArt}`}>
            <div className={styles.heroCamera} aria-hidden="true">
              <div className="corner corner-tl" /><div className="corner corner-tr" />
              <div className="corner corner-bl" /><div className="corner corner-br" />
              <div className={`view-content ${styles.heroLogo}`}><EyeLogo /></div>
            </div>
            <div className="mt-4 flex justify-center items-center">
              <Link href="/step-1" aria-label="Open the photo booth" className="w-16 h-16 bg-[#ff3b30] rounded-full flex items-center justify-center text-white shadow-[0_2px_4px_rgba(0,0,0,0.2),inset_0_1px_2px_rgba(255,255,255,0.4)] border border-[#d63028] hover:bg-[#ff2d20] active:scale-95 transition-all">
                <Camera size={28} fill="currentColor" strokeWidth={1} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>
        <div className={styles.ticker} tabIndex={0} role="group" aria-label="Pose, pick, download, repeat. Focus or hover to pause the animation.">
          <div className={styles.tickerTrack} aria-hidden="true">
            <div className={styles.tickerGroup}>
              <span>POSE ✶ PICK ✶ DOWNLOAD ✶ REPEAT ✶</span>
              <span>POSE ✶ PICK ✶ DOWNLOAD ✶ REPEAT ✶</span>
              <span>POSE ✶ PICK ✶ DOWNLOAD ✶ REPEAT ✶</span>
            </div>
            <div className={styles.tickerGroup}>
              <span>POSE ✶ PICK ✶ DOWNLOAD ✶ REPEAT ✶</span>
              <span>POSE ✶ PICK ✶ DOWNLOAD ✶ REPEAT ✶</span>
              <span>POSE ✶ PICK ✶ DOWNLOAD ✶ REPEAT ✶</span>
            </div>
          </div>
        </div>
        <section className={styles.section} id="how-it-works" aria-labelledby="steps-title">
          <p className={styles.eyebrow}>Step by step</p><h2 id="steps-title">From “ready?” to a strip you<br />keep</h2>
          <div className={styles.grid}>
            <article className={styles.step}><span className={styles.number}>01</span><h3>Capture</h3><p>Hit the shutter and the booth takes over — five seconds to get ready, then three between each shot.</p></article>
            <article className={styles.step}><span className={styles.number}>02</span><h3>Make it yours</h3><p>Pick a frame, flip the strip vertical or horizontal, and see it change before you commit.</p></article>
            <article className={styles.step}><span className={styles.number}>03</span><h3>Export</h3><p>Download the finished strip in one tap and drop it straight into the group chat.</p></article>
          </div>
        </section>
        <div className={styles.divider} aria-hidden="true" />
        <section className={styles.section} id="frames" aria-labelledby="frames-title">
          <p className={styles.eyebrow}>The frames</p><h2 id="frames-title">Three looks, one booth</h2>
          <div className={styles.grid}>
            <article className={styles.frame}>
              <div className={styles.preview}><Image src="/frame-no-frame.svg" width={364} height={164} alt="Three separate cream photos with thin outlines and diamond-dot patterns" /></div>
              <div className={styles.frameCopy}><h3>No frame</h3><p className={styles.tagline}>Clean &amp; simple</p><p>Bare photos on cream, nothing to distract from the faces.</p></div>
            </article>
            <article className={styles.frame}>
              <div className={styles.preview}><Image src="/frame-polaroid.svg" width={364} height={164} alt="A diamond-dot photo inside a white Polaroid border with a deeper caption area below" /></div>
              <div className={styles.frameCopy}><h3>Polaroid</h3><p className={styles.tagline}>Classic white border</p><p>Thick white border with space at the bottom to write your own caption.</p></div>
            </article>
            <article className={styles.frame}>
              <div className={`${styles.preview} ${styles.darkPreview}`}><Image src="/frame-film-strip.svg" width={364} height={164} alt="Three diamond-dot photos on black film with rectangular sprocket holes down both sides" /></div>
              <div className={styles.frameCopy}><h3>Film strip</h3><p className={styles.tagline}>The vintage favourite</p><p>Black strip with sprocket holes, straight off the reel.</p></div>
            </article>
          </div>
        </section>
      </main>
      <footer>
        <div className="checker-rule" aria-hidden="true" />
        <div className={styles.footerGrid}>
          <div><div className="brand-lockup"><EyeLogo /><span className={styles.footerBrand}>Way Kurap</span></div><p className={styles.footerCopy}>A browser photo booth for weddings, birthdays and<br />every night worth remembering.</p></div>
          <nav className={styles.footerNav} aria-label="Footer navigation"><p className={styles.eyebrow}>Explore</p><a href="#how-it-works">How it works</a><a href="#frames">Frames</a></nav>
          <div className={styles.footerStart}><p className={styles.eyebrow}>Start</p><p>Ready to say cheese?</p><Link className={styles.button} href="/step-1">Open the booth</Link></div>
        </div>
        <div className={styles.divider} aria-hidden="true" />
        <p className={styles.copyright}>© 2026 Way Kurap</p>
        <CreatorCredit />
      </footer>
    </div>
  )
}
