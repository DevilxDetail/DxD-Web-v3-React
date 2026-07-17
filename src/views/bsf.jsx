import React, { useState, useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { Helmet } from 'react-helmet'

const IYK_API_KEY = 'f68709437f89477e1e082faabfcd0623193dcbdce4b7807c64d063a1ae4e2116'
const MIN_AUTH_DISPLAY_MS = 1800
const MOSAIC_IMAGES = Array.from({ length: 7 }, (_, index) => `/bsf-mosaic-${index + 1}.png`)

const BSF = () => {
  const location = useLocation()
  const iykRef = new URLSearchParams(location.search).get('iykRef')

  // phase: 'authenticating' | 'video' | 'image' | 'error'
  const [phase, setPhase] = useState('authenticating')
  const [errorMessage, setErrorMessage] = useState('')
  const [videoFading, setVideoFading] = useState(false)
  const [loadFrame, setLoadFrame] = useState(false)
  const videoRef = useRef(null)

  useEffect(() => {
    let cancelled = false
    const startedAt = Date.now()

    const finishWith = (nextPhase, message) => {
      const elapsed = Date.now() - startedAt
      const remaining = Math.max(0, MIN_AUTH_DISPLAY_MS - elapsed)
      setTimeout(() => {
        if (cancelled) return
        if (message) setErrorMessage(message)
        setPhase(nextPhase)
      }, remaining)
    }

    const authenticate = async () => {
      if (!iykRef) {
        finishWith('error', 'No chip reference detected. Please tap the chip again.')
        return
      }

      try {
        const response = await fetch(`https://api.iyk.app/refs/${iykRef}`, {
          method: 'GET',
          headers: {
            'x-iyk-api-key': IYK_API_KEY,
            'Content-Type': 'application/json',
          },
        })

        if (!response.ok) {
          throw new Error(`API request failed: ${response.status}`)
        }

        const data = await response.json()

        if (cancelled) return

        if (data.isValidRef) {
          finishWith('video')
        } else {
          finishWith('error', 'This chip could not be verified. Please try again.')
        }
      } catch (err) {
        console.error('Error authenticating IYK chip:', err)
        finishWith('error', 'Something went wrong during authentication. Please try again.')
      }
    }

    authenticate()

    return () => {
      cancelled = true
    }
  }, [iykRef])

  const handleVideoEnded = () => {
    // Reveal the static frame underneath, then fade the video's last frame out
    // for a seamless hand-off from motion to still image.
    setLoadFrame(true)
    setPhase('image')
    setVideoFading(true)
  }

  return (
    <>
      <Helmet>
        <title>Blue Skies Forever</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <meta property="og:title" content="Blue Skies Forever" />
      </Helmet>

      <style>{`
        html, body {
          margin: 0 !important;
          padding: 0 !important;
          height: 100%;
          background: #000000;
          overflow: hidden;
        }

        .bsf-root {
          position: fixed;
          inset: 0;
          width: 100vw;
          height: 100vh;
          background: #000000;
          overflow: hidden;
        }

        .bsf-auth {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #000000;
          color: #ffffff;
          font-family: 'Lato', sans-serif;
        }

        .bsf-auth-text {
          font-size: 20px;
          letter-spacing: 0.08em;
          font-weight: 300;
          display: inline-flex;
          align-items: baseline;
        }

        .bsf-dots {
          display: inline-flex;
          margin-left: 2px;
        }

        .bsf-dot {
          opacity: 0.15;
          animation: bsf-dot-flash 1.4s infinite ease-in-out;
        }

        .bsf-dot:nth-child(1) { animation-delay: 0s; }
        .bsf-dot:nth-child(2) { animation-delay: 0.25s; }
        .bsf-dot:nth-child(3) { animation-delay: 0.5s; }

        @keyframes bsf-dot-flash {
          0%, 60%, 100% { opacity: 0.15; }
          30% { opacity: 1; }
        }

        .bsf-error {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 24px;
          background: #000000;
          color: #ffffff;
          font-family: 'Lato', sans-serif;
          font-size: 18px;
          font-weight: 300;
          line-height: 1.5;
        }

        .bsf-media,
        .bsf-frame {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
        }

        .bsf-media {
          z-index: 2;
          transition: opacity 0.6s ease-in-out;
        }

        .bsf-media.fading {
          opacity: 0;
        }

        .bsf-frame {
          z-index: 1;
        }

        .bsf-final-content {
          position: absolute;
          z-index: 3;
          inset: 10% 20px 4%;
          overflow-y: auto;
          scrollbar-width: none;
        }

        .bsf-final-content::-webkit-scrollbar {
          display: none;
        }

        .bsf-title {
          width: 100%;
          margin: 0;
          color: #4a4a4a;
          font-family: Arial, sans-serif;
          font-size: clamp(20px, 4vw, 42px);
          font-weight: 700;
          line-height: 1.1;
          text-align: center;
          text-transform: uppercase;
        }

        .bsf-mosaic {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          grid-auto-rows: clamp(100px, 17vh, 180px);
          gap: 10px;
          width: min(1100px, 100%);
          margin: 36px auto 0;
        }

        .bsf-mosaic-tile {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .bsf-mosaic-tile:nth-child(1),
        .bsf-mosaic-tile:nth-child(4) {
          grid-column: span 2;
        }

        @media (max-width: 600px) {
          .bsf-final-content {
            inset: 9% 14px 3%;
          }

          .bsf-mosaic {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            grid-auto-rows: 120px;
            gap: 8px;
            margin-top: 28px;
          }

          .bsf-mosaic-tile:nth-child(4) {
            grid-column: span 1;
          }
        }
      `}</style>

      <div className="bsf-root">
        {phase === 'authenticating' && (
          <div className="bsf-auth">
            <span className="bsf-auth-text">
              authenticating
              <span className="bsf-dots">
                <span className="bsf-dot">.</span>
                <span className="bsf-dot">.</span>
                <span className="bsf-dot">.</span>
              </span>
            </span>
          </div>
        )}

        {phase === 'error' && (
          <div className="bsf-error">{errorMessage}</div>
        )}

        {(phase === 'video' || phase === 'image') && (
          <>
            {/* Start against black. Once playback has actually begun, load the
                static frame underneath the opaque video so it is ready at the end. */}
            {loadFrame && (
              <img className="bsf-frame" src="/bsf-frame.png" alt="Blue Skies Forever" />
            )}
            <video
              ref={videoRef}
              className={`bsf-media${videoFading ? ' fading' : ''}`}
              src="/bsf-video.mp4"
              autoPlay
              muted
              playsInline
              preload="auto"
              onPlaying={() => setLoadFrame(true)}
              onEnded={handleVideoEnded}
            />
            {phase === 'image' && (
              <div className="bsf-final-content">
                <h1 className="bsf-title">Explore the World of DK</h1>
                <div className="bsf-mosaic">
                  {MOSAIC_IMAGES.map((src, index) => (
                    <img
                      key={src}
                      className="bsf-mosaic-tile"
                      src={src}
                      alt={`DK world scene ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  )
}

export default BSF
