'use client'

import { useEffect, useRef } from 'react'
import { getPupilOffset } from '@/lib/eyeTracking'

export function EyeLogo() {
  const logoRef = useRef<SVGSVGElement>(null)
  const pupilRef = useRef<SVGGElement>(null)

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const reset = () => pupilRef.current?.setAttribute('transform', 'translate(0 0)')
    const follow = (event: PointerEvent) => {
      if (event.pointerType === 'touch' || reducedMotion.matches) return
      const matrix = logoRef.current?.getScreenCTM()
      if (!matrix) return
      // Convert to SVG coordinates so tracking respects the logo's scale and tilt.
      const point = new DOMPoint(event.clientX, event.clientY).matrixTransform(matrix.inverse())
      const offset = getPupilOffset(point.x - 95, point.y - 113.75)
      pupilRef.current?.setAttribute('transform', `translate(${offset.x} ${offset.y})`)
    }

    window.addEventListener('pointermove', follow, { passive: true })
    document.documentElement.addEventListener('pointerleave', reset)
    window.addEventListener('blur', reset)
    reducedMotion.addEventListener('change', reset)
    return () => {
      window.removeEventListener('pointermove', follow)
      document.documentElement.removeEventListener('pointerleave', reset)
      window.removeEventListener('blur', reset)
      reducedMotion.removeEventListener('change', reset)
    }
  }, [])

  return (
    <svg ref={logoRef} className="brand-mark" width="42" height="42" viewBox="0 0 190 190" aria-hidden="true">
      <rect width="190" height="190" fill="#1F1A1B" />
      <g transform="translate(-8 -22.25)">
        <ellipse cx="103" cy="136" rx="74" ry="44" fill="#FFF8E7" />
        <circle cx="103" cy="136" r="32" fill="#C8202F" />
        <g ref={pupilRef}>
          <circle cx="103" cy="136" r="15" fill="#1F1A1B" />
          <circle cx="96" cy="128" r="5" fill="#FFF8E7" />
        </g>
        <path d="M103 72 L103 58 M66 82 L56 70 M140 82 L150 70" fill="none" stroke="#C8202F" strokeWidth="7" strokeLinecap="round" />
      </g>
    </svg>
  )
}
