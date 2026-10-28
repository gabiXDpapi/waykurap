# Security and privacy

Photos are captured, held in memory, and exported in the browser; the app does not upload them or request microphone access. Camera access starts only after choosing **Enable camera**. Leaving capture stops its camera tracks, including streams granted after navigation. **End session** clears photos, cancels pending captures, and stops camera tracks by resetting the booth, even when already on the capture screen. It returns to capture with **Enable camera** available again; downloaded files remain on the device.

Browser headers restrict device permissions, prevent framing and plugin embedding, and limit form targets, base URLs, MIME sniffing, and referrer disclosure. The CSP is a baseline policy, not script-injection protection: validate a strict script policy with Next.js before introducing third-party scripts or user-supplied HTML. Do not add session replay to photo screens or log photo data.

## Before deployment

- Run `npm run lint`, `npm test`, `npm run build`, and `npm audit`; review advisories and test dependency updates rather than applying forced upgrades.
- Dependabot checks npm dependencies weekly once this configuration is on GitHub's default branch; enable Dependabot alerts and security updates in repository settings too.
- Use HTTPS and test camera permission denial, capture, export, retake, and End session on desktop and mobile.
- Check response headers on the deployed URL because hosting configuration can override them.
- Enable MFA or passkeys for GitHub, Vercel, and the domain registrar; limit collaborator access and protect the production branch.
- Protect preview deployments, review Vercel firewall activity, and configure usage alerts and available spending controls; automatic budget pausing can take production projects offline.
- Store future secrets in server-only environment variables, never `NEXT_PUBLIC_*`, source files, or Git history; rotate exposed credentials.

Hosting logs may contain request metadata even though photos stay local. Review privacy wording whenever adding analytics, storage, sharing, or accounts. Uploads would require separate authorization, file validation, storage access controls, and retention rules.

If a deployment is compromised, pause or roll it back, revoke affected credentials, fix the cause, and verify the replacement before restoring access. Do not include private photos or credentials in public issue reports.
