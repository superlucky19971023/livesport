import type React from "react"
import { useEffect, useRef } from "react"

declare global {
  interface Window {
    jwplayer: (element: HTMLElement | string) => any
  }
}

interface JWPlayerProps {
  playerId: string
  videoUrl: string
  thumbnailUrl?: string
  aspectRatio?: string
  width?: string
  libraryId: string
  autostart?: boolean
}

const JWPlayerComponent: React.FC<JWPlayerProps> = ({
  playerId,
  videoUrl,
  thumbnailUrl,
  aspectRatio = "4:3",
  width = "100%",
  libraryId,
  autostart = false,
}) => {
  const playerRef = useRef<HTMLDivElement>(null)
  const scriptRef = useRef<HTMLScriptElement | null>(null)
  const playerInstance = useRef<any>(null)

  useEffect(() => {
    // Load JWPlayer script if not already loaded
    if (!document.querySelector(`script[src*="${libraryId}"]`)) {
      const script = document.createElement("script")
      script.src = `https://cdn.jwplayer.com/libraries/${libraryId}.js`
      script.async = true
      script.onload = initializePlayer
      document.body.appendChild(script)
      scriptRef.current = script
    } else {
      // Script already exists, initialize player directly
      initializePlayer()
    }

    return () => {
      // Clean up player instance
      if (playerInstance.current) {
        try {
          playerInstance.current.remove()
        } catch (e) {
          console.error("Error removing JW Player instance:", e)
        }
        playerInstance.current = null
      }
    }
  }, [libraryId, videoUrl, thumbnailUrl, aspectRatio, width, autostart, playerId])

  const initializePlayer = () => {
    if (playerRef.current && window.jwplayer) {
      try {
        // Setup the player
        playerInstance.current = window.jwplayer(playerRef.current).setup({
          file: videoUrl,
          image: thumbnailUrl,
          width: width,
          aspectratio: aspectRatio,
          autostart: autostart,
          displaytitle: true,
          mute: false,
          primary: "html5",
          playbackRateControls: true,
        })
      } catch (e) {
        console.error("Error initializing JW Player:", e)
      }
    }
  }

  return <div id={playerId} ref={playerRef} />
}

export default JWPlayerComponent

