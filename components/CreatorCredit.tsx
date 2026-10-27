import { Mail } from 'lucide-react'
import styles from './CreatorCredit.module.css'

export function CreatorCredit() {
  return (
    <div className={styles.credit}>
      <p>Created by <strong>Gabriel Mosquera</strong></p>
      <nav className={styles.links} aria-label="Connect with the creator">
        <a href="mailto:mosqueragabriel99@gmail.com" aria-label="Email Gabriel Mosquera" title="Email">
          <Mail size={20} aria-hidden="true" />
        </a>
        <a href="https://github.com/gabiXDpapi" target="_blank" rel="noopener noreferrer" aria-label="Gabriel Mosquera on GitHub (opens in a new tab)" title="GitHub">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M9 19c-4.3 1.3-4.3-2.5-6-3m12 6v-3.9a3.4 3.4 0 0 0-.9-2.7c3-.3 6.2-1.5 6.2-7A5.5 5.5 0 0 0 18.8 4a5.1 5.1 0 0 0-.1-3s-1.2-.3-3.9 1.5a13.4 13.4 0 0 0-7 0C5.1.7 3.9 1 3.9 1a5.1 5.1 0 0 0-.1 3A5.5 5.5 0 0 0 2.3 8.4c0 5.5 3.2 6.7 6.2 7a3.4 3.4 0 0 0-.9 2.7V22" />
          </svg>
        </a>
        <a href="https://www.linkedin.com/in/gabriel-mosquera-0730112a1/" target="_blank" rel="noopener noreferrer" aria-label="Gabriel Mosquera on LinkedIn (opens in a new tab)" title="LinkedIn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="3" y="9" width="4" height="12" />
            <circle cx="5" cy="4" r="2" />
            <path d="M11 21V9h4v2a4 4 0 0 1 7 3v7h-4v-7a1.5 1.5 0 0 0-3 0v7z" />
          </svg>
        </a>
      </nav>
    </div>
  )
}
