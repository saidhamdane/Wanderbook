'use client'

import { useEffect, useRef, useState } from 'react'
import { DownloadPdfButton } from './DownloadPdfButton'
import Link from 'next/link'

export default function FlipBook({
  magazineId,
  pageCount = 8,
}: {
  magazineId: string
  pageCount?: number
}) {
  const bookRef = useRef<HTMLDivElement>(null)
  const flipRef = useRef<any>(null)
  const [currentPage, setCurrentPage] = useState(0)
  const [loading, setLoading] = useState(true)
  const [loadedCount, setLoadedCount] = useState(0)
  const [copied, setCopied] = useState(false)

  const shareUrl = typeof window !== 'undefined'
    ? window.location.href
    : ''

  function handleShare() {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }).catch(() => {/* ignore */})
  }

  useEffect(() => {
    if (!bookRef.current) return

    const pageWidth = Math.min(window.innerWidth - 16, 480)
    const pageHeight = Math.floor(pageWidth * (1123 / 794))

    let cancelled = false

    ;(async () => {
      // Pre-fetch all screenshots so page-flip gets fully-loaded images
      await Promise.all(
        Array.from({ length: pageCount }, (_, i) =>
          fetch(`/api/page-screenshot/${magazineId}/${i + 1}`)
            .then(() => {
              if (!cancelled) setLoadedCount((n) => n + 1)
            })
            .catch(() => {
              if (!cancelled) setLoadedCount((n) => n + 1)
            }),
        ),
      )

      if (cancelled || !bookRef.current) return

      setLoading(false)

      // Let React render the img tags before page-flip measures them
      await new Promise((r) => setTimeout(r, 80))
      if (cancelled || !bookRef.current) return

      const { PageFlip } = await import('page-flip')

      const pf = new PageFlip(bookRef.current, {
        width: pageWidth,
        height: pageHeight,
        size: 'fixed',
        minWidth: pageWidth,
        maxWidth: pageWidth,
        minHeight: pageHeight,
        maxHeight: pageHeight,
        showCover: false,
        mobileScrollSupport: false,
        clickEventForward: false,
        usePortrait: true,
        startPage: 0,
        drawShadow: true,
        flippingTime: 800,
        useMouseEvents: true,
        swipeDistance: 20,
      } as any)

      pf.loadFromHTML(bookRef.current.querySelectorAll('.page-item'))
      pf.on('flip', (e: any) => setCurrentPage(e.data))
      flipRef.current = pf
    })()

    return () => {
      cancelled = true
      if (flipRef.current) {
        try { flipRef.current.destroy() } catch { /* ignore */ }
        flipRef.current = null
      }
    }
  }, [magazineId, pageCount])

  const imgStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
  }

  return (
    <div style={{ background: '#0f172a', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 30,
        backgroundColor: '#0f172a', color: '#fff',
        padding: '16px 20px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: '4px solid #f59e0b', flexShrink: 0,
      }}>
        <Link href="/" style={{
          fontFamily: "'Playfair Display', serif",
          fontWeight: 700, fontSize: 18, color: '#fff', textDecoration: 'none',
        }}>
          Wanderbook
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <DownloadPdfButton magazineId={magazineId} />
          <Link href="/create" style={{
            padding: '8px 16px', borderRadius: 9999,
            border: '1px solid #fcd34d', color: '#fde68a',
            fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textDecoration: 'none',
          }}>
            CREATE NEW
          </Link>
        </div>
      </header>

      {/* Book stage */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '16px 0 24px',
      }}>

        {/* Loading overlay */}
        {loading && (
          <div style={{
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', gap: 16,
          }}>
            <div style={{
              width: 48, height: 48, borderRadius: '50%',
              border: '3px solid rgba(255,255,255,0.15)',
              borderTopColor: '#f59e0b',
              animation: 'spin 0.8s linear infinite',
            }} />
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, margin: 0 }}>
              جاري تحضير المجلة…
            </p>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, margin: 0 }}>
              {loadedCount} / {pageCount} pages
            </p>
            <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
          </div>
        )}

        {/* page-flip container — hidden while loading */}
        <div
          ref={bookRef}
          style={{ touchAction: 'none', display: loading ? 'none' : undefined }}
        >
          {Array.from({ length: pageCount }, (_, i) => (
            <div
              key={i}
              className="page-item"
              data-density={i === 0 || i === pageCount - 1 ? 'hard' : 'soft'}
            >
              <img
                src={`/api/page-screenshot/${magazineId}/${i + 1}`}
                style={imgStyle}
                alt={`Page ${i + 1}`}
              />
            </div>
          ))}
        </div>

        {/* Controls */}
        {!loading && (
          <>
            <div style={{
              marginTop: 20, fontSize: 13,
              display: 'flex', alignItems: 'center', gap: 20,
            }}>
              <button
                onClick={() => flipRef.current?.flipPrev()}
                style={{
                  background: 'none', border: '1px solid rgba(255,255,255,0.2)',
                  color: '#fff', padding: '6px 18px', borderRadius: 20,
                  cursor: 'pointer', fontSize: 20, lineHeight: 1,
                }}
              >&#8249;</button>
              <span style={{ color: 'rgba(255,255,255,0.6)', letterSpacing: '0.12em' }}>
                {currentPage + 1} / {pageCount}
              </span>
              <button
                onClick={() => flipRef.current?.flipNext()}
                style={{
                  background: 'none', border: '1px solid rgba(255,255,255,0.2)',
                  color: '#fff', padding: '6px 18px', borderRadius: 20,
                  cursor: 'pointer', fontSize: 20, lineHeight: 1,
                }}
              >&#8250;</button>
            </div>
            {/* Share button */}
            <button
              onClick={handleShare}
              style={{
                marginTop: 16, display: 'flex', alignItems: 'center', gap: 8,
                background: copied ? 'rgba(34,197,94,0.15)' : 'rgba(255,255,255,0.07)',
                border: `1px solid ${copied ? 'rgba(34,197,94,0.4)' : 'rgba(255,255,255,0.15)'}`,
                color: copied ? '#86efac' : 'rgba(255,255,255,0.7)',
                padding: '8px 20px', borderRadius: 20, cursor: 'pointer',
                fontSize: 12, letterSpacing: '0.08em', transition: 'all 0.3s',
              }}
            >
              {copied ? '✓ Link copied!' : '📋 Share your magazine'}
            </button>
          </>
        )}
      </div>
    </div>
  )
}
