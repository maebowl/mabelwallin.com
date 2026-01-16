import { useState, useRef, useEffect } from 'react'
import { useSiteData } from '../data/siteData'
import './CassettePlayer.css'

export default function CassettePlayer() {
  const { music } = useSiteData()
  const [isOpen, setIsOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.7)
  const audioRef = useRef(null)

  const currentSong = music[currentIndex]

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume
    }
  }, [volume])

  useEffect(() => {
    if (audioRef.current && currentSong) {
      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false))
      } else {
        audioRef.current.pause()
      }
    }
  }, [isPlaying, currentSong])

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setProgress(audioRef.current.currentTime)
      setDuration(audioRef.current.duration || 0)
    }
  }

  const handleEnded = () => {
    if (currentIndex < music.length - 1) {
      setCurrentIndex(currentIndex + 1)
    } else {
      setCurrentIndex(0)
    }
  }

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const percent = (e.clientX - rect.left) / rect.width
    if (audioRef.current && duration) {
      audioRef.current.currentTime = percent * duration
    }
  }

  const togglePlay = () => {
    if (!currentSong) return
    setIsPlaying(!isPlaying)
  }

  const prevTrack = () => {
    if (music.length === 0) return
    setCurrentIndex(currentIndex > 0 ? currentIndex - 1 : music.length - 1)
  }

  const nextTrack = () => {
    if (music.length === 0) return
    setCurrentIndex(currentIndex < music.length - 1 ? currentIndex + 1 : 0)
  }

  const formatTime = (time) => {
    if (!time || isNaN(time)) return '0:00'
    const mins = Math.floor(time / 60)
    const secs = Math.floor(time % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (music.length === 0) return null

  return (
    <>
      {/* Floating cassette button */}
      <button
        className="cassette-toggle"
        onClick={() => setIsOpen(!isOpen)}
        title="Music Player"
      >
        <div className={`cassette-icon ${isPlaying ? 'playing' : ''}`}>
          <div className="cassette-body">
            <div className="cassette-window">
              <div className="cassette-reel left"></div>
              <div className="cassette-reel right"></div>
            </div>
          </div>
        </div>
      </button>

      {/* Player panel */}
      <div className={`cassette-player ${isOpen ? 'open' : ''}`}>
        <div className="cassette-header">
          <span className="cassette-label">mabel's mixtape</span>
          <button className="cassette-close" onClick={() => setIsOpen(false)}>×</button>
        </div>

        <div className="cassette-tape">
          <div className="tape-label">
            <span className="tape-title">{currentSong?.title || 'No track'}</span>
            <span className="tape-artist">{currentSong?.artist || ''}</span>
          </div>
          <div className="tape-reels">
            <div className={`tape-reel left ${isPlaying ? 'spinning' : ''}`}>
              <div className="reel-center"></div>
            </div>
            <div className="tape-window"></div>
            <div className={`tape-reel right ${isPlaying ? 'spinning' : ''}`}>
              <div className="reel-center"></div>
            </div>
          </div>
        </div>

        <div className="cassette-progress" onClick={handleSeek}>
          <div
            className="progress-fill"
            style={{ width: duration ? `${(progress / duration) * 100}%` : '0%' }}
          ></div>
        </div>

        <div className="cassette-time">
          <span>{formatTime(progress)}</span>
          <span>{formatTime(duration)}</span>
        </div>

        <div className="cassette-controls">
          <button className="control-btn" onClick={prevTrack} title="Previous">
            <span className="control-icon">⏮</span>
          </button>
          <button className="control-btn play-btn" onClick={togglePlay} title={isPlaying ? 'Pause' : 'Play'}>
            <span className="control-icon">{isPlaying ? '⏸' : '▶'}</span>
          </button>
          <button className="control-btn" onClick={nextTrack} title="Next">
            <span className="control-icon">⏭</span>
          </button>
        </div>

        <div className="cassette-volume">
          <span className="volume-icon">🔊</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="volume-slider"
          />
        </div>

        <div className="cassette-playlist">
          <div className="playlist-header">playlist</div>
          <div className="playlist-tracks">
            {music.map((song, index) => (
              <button
                key={song.id}
                className={`playlist-track ${index === currentIndex ? 'active' : ''}`}
                onClick={() => {
                  setCurrentIndex(index)
                  setIsPlaying(true)
                }}
              >
                <span className="track-number">{index + 1}.</span>
                <span className="track-info">
                  <span className="track-title">{song.title}</span>
                  <span className="track-artist">{song.artist}</span>
                </span>
              </button>
            ))}
          </div>
        </div>

        {currentSong && (
          <audio
            ref={audioRef}
            src={currentSong.url}
            onTimeUpdate={handleTimeUpdate}
            onEnded={handleEnded}
            onLoadedMetadata={handleTimeUpdate}
          />
        )}
      </div>
    </>
  )
}
