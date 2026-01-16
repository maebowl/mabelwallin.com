import { useState, useRef, useEffect } from 'react'
import { useSiteData } from '../data/siteData'
import './CassettePlayer.css'

const CASSETTE_COLORS = {
  amber: { primary: '#fbbf24', secondary: '#f59e0b', label: 'Amber' },
  pink: { primary: '#f472b6', secondary: '#ec4899', label: 'Pink' },
  cyan: { primary: '#22d3ee', secondary: '#06b6d4', label: 'Cyan' },
  lime: { primary: '#a3e635', secondary: '#84cc16', label: 'Lime' },
  purple: { primary: '#a78bfa', secondary: '#8b5cf6', label: 'Purple' },
  red: { primary: '#f87171', secondary: '#ef4444', label: 'Red' },
}

export default function CassettePlayer() {
  const { cassettes, songs: allSongs } = useSiteData()
  const [isOpen, setIsOpen] = useState(false)
  const [showSelector, setShowSelector] = useState(false)
  const [selectedCassetteId, setSelectedCassetteId] = useState(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.7)
  const audioRef = useRef(null)

  // Helper to resolve song IDs to actual song objects
  const getSongsForCassette = (cassette) => {
    if (!cassette?.songIds) return []
    return cassette.songIds
      .map(id => allSongs.find(s => s.id === id))
      .filter(Boolean)
  }

  // Get cassettes that have songs
  const cassettesWithSongs = cassettes.filter(c => c.songIds && c.songIds.length > 0 && getSongsForCassette(c).length > 0)
  const selectedCassette = cassettesWithSongs.find(c => c.id === selectedCassetteId) || cassettesWithSongs[0]
  const songs = getSongsForCassette(selectedCassette)
  const currentSong = songs[currentIndex]
  const cassetteColor = CASSETTE_COLORS[selectedCassette?.color] || CASSETTE_COLORS.amber

  // Auto-select first cassette if none selected
  useEffect(() => {
    if (!selectedCassetteId && cassettesWithSongs.length > 0) {
      setSelectedCassetteId(cassettesWithSongs[0].id)
    }
  }, [cassettesWithSongs, selectedCassetteId])

  // Reset track when switching cassettes
  useEffect(() => {
    setCurrentIndex(0)
    setProgress(0)
    setDuration(0)
    setIsPlaying(false)
  }, [selectedCassetteId])

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
    if (currentIndex < songs.length - 1) {
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
    if (songs.length === 0) return
    setCurrentIndex(currentIndex > 0 ? currentIndex - 1 : songs.length - 1)
  }

  const nextTrack = () => {
    if (songs.length === 0) return
    setCurrentIndex(currentIndex < songs.length - 1 ? currentIndex + 1 : 0)
  }

  const formatTime = (time) => {
    if (!time || isNaN(time)) return '0:00'
    const mins = Math.floor(time / 60)
    const secs = Math.floor(time % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const selectCassette = (cassette) => {
    setSelectedCassetteId(cassette.id)
    setShowSelector(false)
  }

  if (cassettesWithSongs.length === 0) return null

  return (
    <>
      {/* Floating cassette button */}
      <button
        className="cassette-toggle"
        onClick={() => setIsOpen(!isOpen)}
        title="Music Player"
        style={{ '--cassette-color': cassetteColor.primary }}
      >
        <div className={`cassette-icon ${isPlaying ? 'playing' : ''}`}>
          <div className="cassette-body">
            <div className="cassette-window">
              <div className="cassette-reel left" style={{ background: cassetteColor.primary }}></div>
              <div className="cassette-reel right" style={{ background: cassetteColor.primary }}></div>
            </div>
          </div>
        </div>
      </button>

      {/* Player panel */}
      <div className={`cassette-player ${isOpen ? 'open' : ''}`}>
        <div className="cassette-header">
          <button
            className="cassette-label cassette-selector-btn"
            onClick={() => setShowSelector(!showSelector)}
            style={{ color: cassetteColor.primary }}
          >
            {selectedCassette?.name || "mabel's mixtape"}
            {cassettesWithSongs.length > 1 && <span className="selector-arrow">▼</span>}
          </button>
          <button className="cassette-close" onClick={() => setIsOpen(false)}>×</button>
        </div>

        {/* Cassette selector dropdown */}
        {showSelector && cassettesWithSongs.length > 1 && (
          <div className="cassette-selector">
            {cassettesWithSongs.map((cassette) => {
              const color = CASSETTE_COLORS[cassette.color] || CASSETTE_COLORS.amber
              const songCount = getSongsForCassette(cassette).length
              return (
                <button
                  key={cassette.id}
                  className={`cassette-option ${cassette.id === selectedCassetteId ? 'active' : ''}`}
                  onClick={() => selectCassette(cassette)}
                >
                  <div className="cassette-option-icon" style={{ background: color.primary }}></div>
                  <span className="cassette-option-name">{cassette.name}</span>
                  <span className="cassette-option-count">{songCount} songs</span>
                </button>
              )
            })}
          </div>
        )}

        <div className="cassette-tape" style={{ '--cassette-color': cassetteColor.primary }}>
          <div className="tape-label">
            <span className="tape-title">{currentSong?.title || 'No track'}</span>
            <span className="tape-artist">{currentSong?.artist || ''}</span>
          </div>
          <div className="tape-reels">
            <div className={`tape-reel left ${isPlaying ? 'spinning' : ''}`}>
              <div className="reel-center" style={{ background: cassetteColor.primary }}></div>
            </div>
            <div className="tape-window"></div>
            <div className={`tape-reel right ${isPlaying ? 'spinning' : ''}`}>
              <div className="reel-center" style={{ background: cassetteColor.primary }}></div>
            </div>
          </div>
        </div>

        <div className="cassette-progress" onClick={handleSeek}>
          <div
            className="progress-fill"
            style={{
              width: duration ? `${(progress / duration) * 100}%` : '0%',
              background: `linear-gradient(90deg, ${cassetteColor.primary}, ${cassetteColor.secondary})`
            }}
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
          <button
            className="control-btn play-btn"
            onClick={togglePlay}
            title={isPlaying ? 'Pause' : 'Play'}
            style={{
              background: `linear-gradient(180deg, ${cassetteColor.primary} 0%, ${cassetteColor.secondary} 100%)`,
              borderColor: cassetteColor.secondary
            }}
          >
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
            style={{ '--cassette-color': cassetteColor.primary }}
          />
        </div>

        <div className="cassette-playlist">
          <div className="playlist-header">playlist</div>
          <div className="playlist-tracks">
            {songs.map((song, index) => (
              <button
                key={song.id}
                className={`playlist-track ${index === currentIndex ? 'active' : ''}`}
                onClick={() => {
                  setCurrentIndex(index)
                  setIsPlaying(true)
                }}
                style={{ '--cassette-color': cassetteColor.primary }}
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
