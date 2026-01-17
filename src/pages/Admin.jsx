import { useState, useEffect, useRef } from 'react'
import { useSiteData } from '../data/siteData'
import { saveToGitHub, uploadFileToGitHub } from '../services/github'
import './Admin.css'

const ADMIN_PASSWORD = 'password'
const AUTH_KEY = 'mabel-admin-auth'
const GITHUB_TOKEN_KEY = 'mabel-github-token'

function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('videos')
  const [githubToken, setGithubToken] = useState('')
  const [showTokenInput, setShowTokenInput] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState('')
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  const {
    siteSettings, videos, designs, socials, badges, songs, cassettes,
    updateSiteSettings,
    addVideo, updateVideo, deleteVideo,
    addDesign, updateDesign, deleteDesign,
    updateSocial,
    addBadge, updateBadge, deleteBadge, reorderBadges,
    addSong, updateSong, deleteSong,
    addCassette, updateCassette, deleteCassette,
    addSongToCassette, removeSongFromCassette, reorderSongsInCassette,
    resetToDefaults
  } = useSiteData()

  useEffect(() => {
    const auth = sessionStorage.getItem(AUTH_KEY)
    if (auth === 'true') {
      setIsAuthenticated(true)
    }
    const savedToken = localStorage.getItem(GITHUB_TOKEN_KEY)
    if (savedToken) {
      setGithubToken(savedToken)
    }
  }, [])

  // Warn user about unsaved changes when leaving
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges) {
        e.preventDefault()
        e.returnValue = ''
      }
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [hasUnsavedChanges])

  const handleLogin = (e) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true)
      sessionStorage.setItem(AUTH_KEY, 'true')
      setError('')
    } else {
      setError('Incorrect password')
    }
  }

  const handleLogout = () => {
    if (hasUnsavedChanges && !window.confirm('You have unsaved changes. Are you sure you want to logout?')) {
      return
    }
    setIsAuthenticated(false)
    sessionStorage.removeItem(AUTH_KEY)
  }

  const handleSaveToken = () => {
    localStorage.setItem(GITHUB_TOKEN_KEY, githubToken)
    setShowTokenInput(false)
    setSaveStatus('Token saved!')
    setTimeout(() => setSaveStatus(''), 3000)
  }

  // Save all changes to GitHub
  const handleSaveAll = async () => {
    if (!githubToken) {
      setSaveStatus('Error: Set your GitHub token first!')
      setShowTokenInput(true)
      setTimeout(() => setSaveStatus(''), 3000)
      return
    }

    setSaving(true)
    setSaveStatus('Saving...')

    try {
      await saveToGitHub({ siteSettings, videos, designs, socials, badges, songs, cassettes }, githubToken)
      setSaveStatus('Saved!')
      setHasUnsavedChanges(false)
      setTimeout(() => setSaveStatus(''), 2000)
    } catch (err) {
      setSaveStatus(`Error: ${err.message}`)
      setTimeout(() => setSaveStatus(''), 5000)
    } finally {
      setSaving(false)
    }
  }

  // Mark as having unsaved changes
  const markChanged = () => {
    setHasUnsavedChanges(true)
  }

  // Wrapped functions that mark changes (no auto-save)
  const handleAddVideo = (video) => {
    addVideo(video)
    markChanged()
  }

  const handleUpdateVideo = (id, updates) => {
    updateVideo(id, updates)
    markChanged()
  }

  const handleDeleteVideo = (id) => {
    deleteVideo(id)
    markChanged()
  }

  const handleAddDesign = (design) => {
    addDesign(design)
    markChanged()
  }

  const handleUpdateDesign = (id, updates) => {
    updateDesign(id, updates)
    markChanged()
  }

  const handleDeleteDesign = (id) => {
    deleteDesign(id)
    markChanged()
  }

  const handleUpdateSocial = (id, updates) => {
    updateSocial(id, updates)
    markChanged()
  }

  const handleAddBadge = (badge) => {
    addBadge(badge)
    markChanged()
  }

  const handleUpdateBadge = (id, updates) => {
    updateBadge(id, updates)
    markChanged()
  }

  const handleDeleteBadge = (id) => {
    deleteBadge(id)
    markChanged()
  }

  const handleReorderBadges = (newBadges) => {
    reorderBadges(newBadges)
    markChanged()
  }

  const handleAddSong = (song) => {
    const id = addSong(song)
    markChanged()
    return id
  }

  const handleUpdateSong = (id, updates) => {
    updateSong(id, updates)
    markChanged()
  }

  const handleDeleteSong = (id) => {
    deleteSong(id)
    markChanged()
  }

  const handleAddCassette = (cassette) => {
    addCassette(cassette)
    markChanged()
  }

  const handleUpdateCassette = (id, updates) => {
    updateCassette(id, updates)
    markChanged()
  }

  const handleDeleteCassette = (id) => {
    deleteCassette(id)
    markChanged()
  }

  const handleAddSongToCassette = (cassetteId, songId) => {
    addSongToCassette(cassetteId, songId)
    markChanged()
  }

  const handleRemoveSongFromCassette = (cassetteId, songId) => {
    removeSongFromCassette(cassetteId, songId)
    markChanged()
  }

  const handleReorderSongsInCassette = (cassetteId, newSongIds) => {
    reorderSongsInCassette(cassetteId, newSongIds)
    markChanged()
  }

  const handleUpdateSiteSettings = (section, updates) => {
    updateSiteSettings(section, updates)
    markChanged()
  }

  if (!isAuthenticated) {
    return (
      <div className="admin-page">
        <div className="admin-login">
          <h1>admin</h1>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              autoFocus
            />
            <button type="submit">Login</button>
          </form>
          {error && <p className="error">{error}</p>}
        </div>
      </div>
    )
  }

  return (
    <div className="admin-page">
      <div className="admin-container">
        <div className="admin-header">
          <h1>admin</h1>
          <div className="admin-actions">
            {saveStatus && (
              <span className={`save-status-inline ${saveStatus.includes('Error') ? 'error' : 'success'}`}>
                {saveStatus}
              </span>
            )}
            <button
              onClick={handleSaveAll}
              className={`btn-save-all ${hasUnsavedChanges ? 'has-changes' : ''}`}
              disabled={saving || !hasUnsavedChanges}
            >
              {saving ? 'Saving...' : hasUnsavedChanges ? 'Save All Changes' : 'All Saved'}
            </button>
            <button onClick={() => setShowTokenInput(!showTokenInput)} className="btn-secondary">
              {githubToken ? 'Change Token' : 'Set Token'}
            </button>
            <button onClick={handleLogout} className="btn-secondary">Logout</button>
          </div>
        </div>

        {showTokenInput && (
          <div className="token-input-section">
            <p>Enter your GitHub Personal Access Token (needs repo scope):</p>
            <div className="token-input-row">
              <input
                type="password"
                value={githubToken}
                onChange={(e) => setGithubToken(e.target.value)}
                placeholder="ghp_xxxxxxxxxxxx"
              />
              <button onClick={handleSaveToken}>Save Token</button>
            </div>
          </div>
        )}

        <div className="admin-tabs">
          <button
            className={`tab ${activeTab === 'videos' ? 'active' : ''}`}
            onClick={() => setActiveTab('videos')}
          >
            Videos
          </button>
          <button
            className={`tab ${activeTab === 'designs' ? 'active' : ''}`}
            onClick={() => setActiveTab('designs')}
          >
            Designs
          </button>
          <button
            className={`tab ${activeTab === 'socials' ? 'active' : ''}`}
            onClick={() => setActiveTab('socials')}
          >
            Contact
          </button>
          <button
            className={`tab ${activeTab === 'badges' ? 'active' : ''}`}
            onClick={() => setActiveTab('badges')}
          >
            Badges
          </button>
          <button
            className={`tab ${activeTab === 'cassettes' ? 'active' : ''}`}
            onClick={() => setActiveTab('cassettes')}
          >
            Cassettes
          </button>
          <button
            className={`tab ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            Site Settings
          </button>
        </div>

        <div className="admin-content">
          {activeTab === 'videos' && (
            <VideosManager
              videos={videos}
              addVideo={handleAddVideo}
              updateVideo={handleUpdateVideo}
              deleteVideo={handleDeleteVideo}
              saving={saving}
            />
          )}
          {activeTab === 'designs' && (
            <DesignsManager
              designs={designs}
              addDesign={handleAddDesign}
              updateDesign={handleUpdateDesign}
              deleteDesign={handleDeleteDesign}
              githubToken={githubToken}
              saving={saving}
            />
          )}
          {activeTab === 'socials' && (
            <SocialsManager
              socials={socials}
              updateSocial={handleUpdateSocial}
              saving={saving}
            />
          )}
          {activeTab === 'badges' && (
            <BadgesManager
              badges={badges}
              addBadge={handleAddBadge}
              updateBadge={handleUpdateBadge}
              deleteBadge={handleDeleteBadge}
              reorderBadges={handleReorderBadges}
              githubToken={githubToken}
              saving={saving}
            />
          )}
          {activeTab === 'cassettes' && (
            <CassettesManager
              songs={songs}
              cassettes={cassettes}
              addSong={handleAddSong}
              updateSong={handleUpdateSong}
              deleteSong={handleDeleteSong}
              addCassette={handleAddCassette}
              updateCassette={handleUpdateCassette}
              deleteCassette={handleDeleteCassette}
              addSongToCassette={handleAddSongToCassette}
              removeSongFromCassette={handleRemoveSongFromCassette}
              reorderSongsInCassette={handleReorderSongsInCassette}
              githubToken={githubToken}
              saving={saving}
            />
          )}
          {activeTab === 'settings' && (
            <SiteSettingsManager
              siteSettings={siteSettings}
              updateSiteSettings={handleUpdateSiteSettings}
              saving={saving}
            />
          )}
        </div>
      </div>
    </div>
  )
}

function FileUpload({ onUpload, accept, label, githubToken, inputId }) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef(null)
  const idRef = useRef(inputId || `file-${label}-${Math.random().toString(36).substr(2, 9)}`)
  const uniqueId = idRef.current

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!githubToken) {
      setError('Please set your GitHub token first')
      return
    }

    setUploading(true)
    setError('')

    try {
      const url = await uploadFileToGitHub(file, githubToken)
      onUpload(url)
    } catch (err) {
      setError(err.message)
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  return (
    <div className="file-upload">
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        disabled={uploading}
        id={uniqueId}
      />
      <label htmlFor={uniqueId} className={`file-upload-btn ${uploading ? 'uploading' : ''}`}>
        {uploading ? 'Uploading...' : label}
      </label>
      {error && <span className="file-upload-error">{error}</span>}
    </div>
  )
}

function VideosManager({ videos, addVideo, updateVideo, deleteVideo, saving }) {
  const [editing, setEditing] = useState(null)
  const [newVideo, setNewVideo] = useState({ title: '', description: '', videoId: '', isVertical: false })

  const extractVideoId = (url) => {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([^&\s?]+)/)
    return match ? match[1] : url
  }

  const handleAdd = () => {
    if (!newVideo.title || !newVideo.videoId) return
    const videoId = extractVideoId(newVideo.videoId)
    addVideo({ ...newVideo, videoId })
    setNewVideo({ title: '', description: '', videoId: '', isVertical: false })
  }

  const handleUpdate = (id) => {
    updateVideo(id, editing)
    setEditing(null)
  }

  return (
    <div className="manager">
      <h2>Videos</h2>
      <p className="manager-note">Changes are saved to GitHub automatically.</p>

      <div className="add-form">
        <h3>Add New Video</h3>
        <input
          placeholder="Title"
          value={newVideo.title}
          onChange={(e) => setNewVideo({ ...newVideo, title: e.target.value })}
        />
        <input
          placeholder="YouTube URL or video ID"
          value={newVideo.videoId}
          onChange={(e) => setNewVideo({ ...newVideo, videoId: e.target.value })}
        />
        <input
          placeholder="Description (optional)"
          value={newVideo.description}
          onChange={(e) => setNewVideo({ ...newVideo, description: e.target.value })}
        />
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={newVideo.isVertical}
            onChange={(e) => setNewVideo({ ...newVideo, isVertical: e.target.checked })}
          />
          Vertical video (shorts/reels)
        </label>
        <button onClick={handleAdd} disabled={saving}>
          {saving ? 'Saving...' : 'Add Video'}
        </button>
      </div>

      <div className="items-list">
        {videos.map((video) => (
          <div key={video.id} className="item">
            {editing?.id === video.id ? (
              <>
                <input
                  value={editing.title}
                  onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                  placeholder="Title"
                />
                <input
                  value={editing.description || ''}
                  onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                  placeholder="Description"
                />
                <input
                  value={editing.videoId}
                  onChange={(e) => setEditing({ ...editing, videoId: extractVideoId(e.target.value) })}
                  placeholder="YouTube URL or video ID"
                />
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={editing.isVertical || false}
                    onChange={(e) => setEditing({ ...editing, isVertical: e.target.checked })}
                  />
                  Vertical video
                </label>
                <div className="item-actions">
                  <button onClick={() => handleUpdate(video.id)} disabled={saving}>
                    {saving ? 'Saving...' : 'Save'}
                  </button>
                  <button onClick={() => setEditing(null)}>Cancel</button>
                </div>
              </>
            ) : (
              <>
                <div className="item-info">
                  <strong>{video.title}</strong>
                  <span className="item-meta">{video.description || 'No description'}</span>
                  <span className="item-meta item-url">ID: {video.videoId} {video.isVertical ? '(vertical)' : ''}</span>
                </div>
                <div className="item-actions">
                  <button onClick={() => setEditing({ ...video })}>Edit</button>
                  <button onClick={() => deleteVideo(video.id)} className="btn-danger" disabled={saving}>
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function DesignsManager({ designs, addDesign, updateDesign, deleteDesign, githubToken, saving }) {
  const [editing, setEditing] = useState(null)
  const [newDesign, setNewDesign] = useState({ title: '', category: '', description: '', image: '' })

  const handleAdd = () => {
    if (!newDesign.title || !newDesign.image) return
    addDesign(newDesign)
    setNewDesign({ title: '', category: '', description: '', image: '' })
  }

  const handleUpdate = (id, overrides = {}) => {
    const updates = { ...editing, ...overrides }
    updateDesign(id, updates)
    setEditing(null)
  }

  return (
    <div className="manager">
      <h2>Designs</h2>
      <p className="manager-note">Upload images or paste a URL. Changes are saved to GitHub automatically.</p>

      <div className="add-form">
        <h3>Add New Design</h3>
        <input
          placeholder="Title"
          value={newDesign.title}
          onChange={(e) => setNewDesign({ ...newDesign, title: e.target.value })}
        />
        <input
          placeholder="Category (e.g., Branding, Typography)"
          value={newDesign.category}
          onChange={(e) => setNewDesign({ ...newDesign, category: e.target.value })}
        />
        <div className="media-input-group">
          <input
            placeholder="Image URL"
            value={newDesign.image}
            onChange={(e) => setNewDesign({ ...newDesign, image: e.target.value })}
          />
          <FileUpload
            accept="image/*"
            label="Upload"
            githubToken={githubToken}
            inputId="file-design-add"
            onUpload={(url) => setNewDesign({ ...newDesign, image: url })}
          />
        </div>
        <input
          placeholder="Description (optional)"
          value={newDesign.description}
          onChange={(e) => setNewDesign({ ...newDesign, description: e.target.value })}
        />
        <button onClick={handleAdd} disabled={saving}>
          {saving ? 'Saving...' : 'Add Design'}
        </button>
      </div>

      <div className="items-list">
        {designs.map((design) => (
          <div key={design.id} className="item">
            {editing?.id === design.id ? (
              <>
                <input
                  value={editing.title}
                  onChange={(e) => setEditing(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Title"
                />
                <input
                  value={editing.category || ''}
                  onChange={(e) => setEditing(prev => ({ ...prev, category: e.target.value }))}
                  placeholder="Category"
                />
                <div className="media-input-group">
                  <input
                    value={editing.image || ''}
                    onChange={(e) => setEditing(prev => ({ ...prev, image: e.target.value }))}
                    placeholder="Image URL"
                  />
                  <FileUpload
                    accept="image/*"
                    label="Upload"
                    githubToken={githubToken}
                    inputId={`file-design-edit-${design.id}`}
                    onUpload={(url) => {
                      setEditing(prev => {
                        const updated = { ...prev, image: url }
                        updateDesign(design.id, updated)
                        return null
                      })
                    }}
                  />
                </div>
                <input
                  value={editing.description || ''}
                  onChange={(e) => setEditing(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Description"
                />
                <div className="item-actions">
                  <button onClick={() => handleUpdate(design.id)} disabled={saving}>
                    {saving ? 'Saving...' : 'Save'}
                  </button>
                  <button onClick={() => setEditing(null)}>Cancel</button>
                </div>
              </>
            ) : (
              <>
                <div className="item-info">
                  <strong>{design.title}</strong>
                  <span className="item-meta">{design.category}</span>
                  <p>{design.description}</p>
                  <span className="item-meta item-url">{design.image}</span>
                </div>
                <div className="item-actions">
                  <button onClick={() => setEditing({ ...design })}>Edit</button>
                  <button onClick={() => deleteDesign(design.id)} className="btn-danger" disabled={saving}>
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function SocialsManager({ socials, updateSocial, saving }) {
  const [editing, setEditing] = useState(null)

  const handleUpdate = (id) => {
    updateSocial(id, editing)
    setEditing(null)
  }

  return (
    <div className="manager">
      <h2>Contact Links</h2>
      <p className="manager-note">Edit your social media links. Changes are saved to GitHub automatically.</p>

      <div className="items-list">
        {socials.map((social) => (
          <div key={social.id} className="item">
            {editing?.id === social.id ? (
              <>
                <input
                  value={editing.name}
                  onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                  placeholder="Platform name"
                />
                <input
                  value={editing.handle}
                  onChange={(e) => setEditing({ ...editing, handle: e.target.value })}
                  placeholder="Handle/username"
                />
                <input
                  value={editing.url}
                  onChange={(e) => setEditing({ ...editing, url: e.target.value })}
                  placeholder="URL"
                />
                <div className="item-actions">
                  <button onClick={() => handleUpdate(social.id)} disabled={saving}>
                    {saving ? 'Saving...' : 'Save'}
                  </button>
                  <button onClick={() => setEditing(null)}>Cancel</button>
                </div>
              </>
            ) : (
              <>
                <div className="item-info">
                  <strong>{social.name}</strong>
                  <span className="item-meta">{social.handle}</span>
                  <span className="item-meta">{social.url}</span>
                </div>
                <div className="item-actions">
                  <button onClick={() => setEditing({ ...social })}>Edit</button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function BadgesManager({ badges, addBadge, updateBadge, deleteBadge, reorderBadges, githubToken, saving }) {
  const [editing, setEditing] = useState(null)
  const [newBadge, setNewBadge] = useState({ image: '', url: '', alt: '' })

  const handleAdd = () => {
    if (!newBadge.image) return
    addBadge(newBadge)
    setNewBadge({ image: '', url: '', alt: '' })
  }

  const handleUpdate = (id, overrides = {}) => {
    const updates = { ...editing, ...overrides }
    updateBadge(id, updates)
    setEditing(null)
  }

  const moveBadge = (index, direction) => {
    const newIndex = index + direction
    if (newIndex < 0 || newIndex >= badges.length) return
    const newBadges = [...badges]
    const [moved] = newBadges.splice(index, 1)
    newBadges.splice(newIndex, 0, moved)
    reorderBadges(newBadges)
  }

  return (
    <div className="manager">
      <h2>Badges</h2>
      <p className="manager-note">88x31 badges displayed on the contact page. Use arrows to reorder.</p>

      <div className="add-form">
        <h3>Add New Badge</h3>
        <div className="media-input-group">
          <input
            placeholder="Image URL"
            value={newBadge.image}
            onChange={(e) => setNewBadge({ ...newBadge, image: e.target.value })}
          />
          <FileUpload
            accept="image/*"
            label="Upload"
            githubToken={githubToken}
            inputId="file-badge-add"
            onUpload={(url) => setNewBadge({ ...newBadge, image: url })}
          />
        </div>
        <input
          placeholder="Link URL (where it goes when clicked)"
          value={newBadge.url}
          onChange={(e) => setNewBadge({ ...newBadge, url: e.target.value })}
        />
        <input
          placeholder="Alt text (optional)"
          value={newBadge.alt}
          onChange={(e) => setNewBadge({ ...newBadge, alt: e.target.value })}
        />
        <button onClick={handleAdd} disabled={saving}>
          {saving ? 'Saving...' : 'Add Badge'}
        </button>
      </div>

      <div className="items-list">
        {badges.map((badge, index) => (
          <div key={badge.id} className="item">
            {editing?.id === badge.id ? (
              <>
                <div className="media-input-group">
                  <input
                    value={editing.image}
                    onChange={(e) => setEditing(prev => ({ ...prev, image: e.target.value }))}
                    placeholder="Image URL"
                  />
                  <FileUpload
                    accept="image/*"
                    label="Upload"
                    githubToken={githubToken}
                    inputId={`file-badge-edit-${badge.id}`}
                    onUpload={(url) => {
                      setEditing(prev => {
                        const updated = { ...prev, image: url, updatedAt: Date.now() }
                        updateBadge(badge.id, updated)
                        return null
                      })
                    }}
                  />
                </div>
                <input
                  value={editing.url || ''}
                  onChange={(e) => setEditing(prev => ({ ...prev, url: e.target.value }))}
                  placeholder="Link URL"
                />
                <input
                  value={editing.alt || ''}
                  onChange={(e) => setEditing(prev => ({ ...prev, alt: e.target.value }))}
                  placeholder="Alt text"
                />
                <div className="item-actions">
                  <button onClick={() => handleUpdate(badge.id)} disabled={saving}>
                    {saving ? 'Saving...' : 'Save'}
                  </button>
                  <button onClick={() => setEditing(null)}>Cancel</button>
                </div>
              </>
            ) : (
              <>
                <div className="item-info">
                  <img
                    src={badge.image}
                    alt={badge.alt || 'badge'}
                    style={{ width: '88px', height: '31px', imageRendering: 'pixelated' }}
                  />
                  <span className="item-meta">{badge.alt || 'No alt text'}</span>
                  <span className="item-meta item-url">{badge.url || 'No link'}</span>
                </div>
                <div className="item-actions">
                  <button
                    onClick={() => moveBadge(index, -1)}
                    disabled={saving || index === 0}
                    title="Move up"
                  >
                    ↑
                  </button>
                  <button
                    onClick={() => moveBadge(index, 1)}
                    disabled={saving || index === badges.length - 1}
                    title="Move down"
                  >
                    ↓
                  </button>
                  <button onClick={() => setEditing({ ...badge })}>Edit</button>
                  <button onClick={() => deleteBadge(badge.id)} className="btn-danger" disabled={saving}>
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

const CASSETTE_COLORS = [
  { value: 'amber', label: 'Amber', color: '#fbbf24' },
  { value: 'pink', label: 'Pink', color: '#f472b6' },
  { value: 'cyan', label: 'Cyan', color: '#22d3ee' },
  { value: 'lime', label: 'Lime', color: '#a3e635' },
  { value: 'purple', label: 'Purple', color: '#a78bfa' },
  { value: 'red', label: 'Red', color: '#f87171' },
]

function CassettesManager({
  songs, cassettes,
  addSong, updateSong, deleteSong,
  addCassette, updateCassette, deleteCassette,
  addSongToCassette, removeSongFromCassette, reorderSongsInCassette,
  githubToken, saving
}) {
  const [selectedCassette, setSelectedCassette] = useState(null)
  const [editingCassette, setEditingCassette] = useState(null)
  const [editingSong, setEditingSong] = useState(null)
  const [editingLibrarySong, setEditingLibrarySong] = useState(null)
  const [newCassette, setNewCassette] = useState({ name: '', color: 'amber' })
  const [newSong, setNewSong] = useState({ title: '', artist: '', url: '' })
  const [newLibrarySong, setNewLibrarySong] = useState({ title: '', artist: '', url: '' })
  const [showSongPicker, setShowSongPicker] = useState(false)
  const [showLibrary, setShowLibrary] = useState(false)

  // Helper to get song objects for a cassette
  const getSongsForCassette = (cassette) => {
    if (!cassette?.songIds) return []
    return cassette.songIds
      .map(id => songs.find(s => s.id === id))
      .filter(Boolean)
  }

  // Get songs not in the current cassette (for the picker)
  const getAvailableSongs = () => {
    if (!currentCassette) return songs
    return songs.filter(s => !currentCassette.songIds.includes(s.id))
  }

  const handleAddCassette = () => {
    if (!newCassette.name) return
    addCassette(newCassette)
    setNewCassette({ name: '', color: 'amber' })
  }

  const handleUpdateCassette = (id) => {
    updateCassette(id, editingCassette)
    setEditingCassette(null)
  }

  const handleAddNewSong = async () => {
    if (!newSong.title || !newSong.url) return
    const songId = await addSong(newSong)
    if (currentCassette && songId) {
      addSongToCassette(currentCassette.id, songId)
    }
    setNewSong({ title: '', artist: '', url: '' })
  }

  const handleAddLibrarySong = async () => {
    if (!newLibrarySong.title || !newLibrarySong.url) return
    await addSong(newLibrarySong)
    setNewLibrarySong({ title: '', artist: '', url: '' })
  }

  const handleUpdateSong = (songId) => {
    updateSong(songId, editingSong)
    setEditingSong(null)
  }

  const handleUpdateLibrarySong = (songId) => {
    updateSong(songId, editingLibrarySong)
    setEditingLibrarySong(null)
  }

  const moveSong = (index, direction) => {
    if (!currentCassette) return
    const songIds = currentCassette.songIds
    const newIndex = index + direction
    if (newIndex < 0 || newIndex >= songIds.length) return
    const newSongIds = [...songIds]
    const [moved] = newSongIds.splice(index, 1)
    newSongIds.splice(newIndex, 0, moved)
    reorderSongsInCassette(currentCassette.id, newSongIds)
  }

  // Update currentCassette when cassettes change
  const currentCassette = selectedCassette ? cassettes.find(c => c.id === selectedCassette.id) : null
  const currentSongs = getSongsForCassette(currentCassette)
  const availableSongs = getAvailableSongs()

  return (
    <div className="manager">
      <h2>Cassettes & Songs</h2>
      <p className="manager-note">Manage your song library and create mixtapes. Songs can be shared across multiple cassettes!</p>

      {/* Song Library Section */}
      <div className="song-library-section">
        <button
          className="library-toggle"
          onClick={() => setShowLibrary(!showLibrary)}
        >
          {showLibrary ? '▼' : '▶'} Song Library ({songs.length} songs)
        </button>

        {showLibrary && (
          <div className="song-library">
            <div className="add-form">
              <h4>Add Song to Library</h4>
              <input
                placeholder="Song title"
                value={newLibrarySong.title}
                onChange={(e) => setNewLibrarySong({ ...newLibrarySong, title: e.target.value })}
              />
              <input
                placeholder="Artist"
                value={newLibrarySong.artist}
                onChange={(e) => setNewLibrarySong({ ...newLibrarySong, artist: e.target.value })}
              />
              <div className="media-input-group">
                <input
                  placeholder="Audio URL (MP3, etc.)"
                  value={newLibrarySong.url}
                  onChange={(e) => setNewLibrarySong({ ...newLibrarySong, url: e.target.value })}
                />
                <FileUpload
                  accept="audio/*"
                  label="Upload"
                  githubToken={githubToken}
                  inputId="file-library-add"
                  onUpload={(url) => setNewLibrarySong({ ...newLibrarySong, url })}
                />
              </div>
              <button onClick={handleAddLibrarySong} disabled={saving}>
                {saving ? 'Saving...' : 'Add to Library'}
              </button>
            </div>

            <div className="items-list">
              {songs.length === 0 ? (
                <p className="empty-note">No songs yet. Add some above!</p>
              ) : (
                songs.map(song => (
                  <div key={song.id} className="item">
                    {editingLibrarySong?.id === song.id ? (
                      <>
                        <input
                          value={editingLibrarySong.title}
                          onChange={(e) => setEditingLibrarySong(prev => ({ ...prev, title: e.target.value }))}
                          placeholder="Song title"
                        />
                        <input
                          value={editingLibrarySong.artist || ''}
                          onChange={(e) => setEditingLibrarySong(prev => ({ ...prev, artist: e.target.value }))}
                          placeholder="Artist"
                        />
                        <div className="media-input-group">
                          <input
                            value={editingLibrarySong.url}
                            onChange={(e) => setEditingLibrarySong(prev => ({ ...prev, url: e.target.value }))}
                            placeholder="Audio URL"
                          />
                          <FileUpload
                            accept="audio/*"
                            label="Upload"
                            githubToken={githubToken}
                            inputId={`file-library-edit-${song.id}`}
                            onUpload={(url) => setEditingLibrarySong(prev => ({ ...prev, url }))}
                          />
                        </div>
                        <div className="item-actions">
                          <button onClick={() => handleUpdateLibrarySong(song.id)} disabled={saving}>
                            {saving ? 'Saving...' : 'Save'}
                          </button>
                          <button onClick={() => setEditingLibrarySong(null)}>Cancel</button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="item-info">
                          <strong>{song.title}</strong>
                          <span className="item-meta">{song.artist || 'Unknown artist'}</span>
                        </div>
                        <div className="item-actions">
                          <button onClick={() => setEditingLibrarySong({ ...song })}>Edit</button>
                          <button
                            onClick={() => deleteSong(song.id)}
                            className="btn-danger"
                            disabled={saving}
                            title="Delete song from library"
                          >
                            Delete
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      <div className="add-form">
        <h3>Create New Cassette</h3>
        <input
          placeholder="Cassette name (e.g., chill vibes)"
          value={newCassette.name}
          onChange={(e) => setNewCassette({ ...newCassette, name: e.target.value })}
        />
        <div className="color-picker">
          <span>Color:</span>
          <div className="color-options">
            {CASSETTE_COLORS.map(c => (
              <button
                key={c.value}
                type="button"
                className={`color-option ${newCassette.color === c.value ? 'selected' : ''}`}
                style={{ background: c.color }}
                onClick={() => setNewCassette({ ...newCassette, color: c.value })}
                title={c.label}
              />
            ))}
          </div>
        </div>
        <button onClick={handleAddCassette} disabled={saving}>
          {saving ? 'Saving...' : 'Create Cassette'}
        </button>
      </div>

      <div className="cassettes-list">
        <h3>Your Cassettes</h3>
        {cassettes.length === 0 ? (
          <p className="empty-note">No cassettes yet. Create one above!</p>
        ) : (
          <div className="items-list">
            {cassettes.map((cassette) => {
              const colorInfo = CASSETTE_COLORS.find(c => c.value === cassette.color) || CASSETTE_COLORS[0]
              const songCount = getSongsForCassette(cassette).length
              return (
                <div key={cassette.id} className={`item cassette-item ${currentCassette?.id === cassette.id ? 'selected' : ''}`}>
                  {editingCassette?.id === cassette.id ? (
                    <>
                      <input
                        value={editingCassette.name}
                        onChange={(e) => setEditingCassette(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Cassette name"
                      />
                      <div className="color-picker">
                        <span>Color:</span>
                        <div className="color-options">
                          {CASSETTE_COLORS.map(c => (
                            <button
                              key={c.value}
                              type="button"
                              className={`color-option ${editingCassette.color === c.value ? 'selected' : ''}`}
                              style={{ background: c.color }}
                              onClick={() => setEditingCassette(prev => ({ ...prev, color: c.value }))}
                              title={c.label}
                            />
                          ))}
                        </div>
                      </div>
                      <div className="item-actions">
                        <button onClick={() => handleUpdateCassette(cassette.id)} disabled={saving}>
                          {saving ? 'Saving...' : 'Save'}
                        </button>
                        <button onClick={() => setEditingCassette(null)}>Cancel</button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="item-info" onClick={() => setSelectedCassette(cassette)} style={{ cursor: 'pointer' }}>
                        <div className="cassette-preview" style={{ background: colorInfo.color }}></div>
                        <strong>{cassette.name}</strong>
                        <span className="item-meta">{songCount} songs</span>
                      </div>
                      <div className="item-actions">
                        <button onClick={() => setSelectedCassette(cassette)}>
                          {currentCassette?.id === cassette.id ? 'Editing' : 'Edit Songs'}
                        </button>
                        <button onClick={() => setEditingCassette({ ...cassette })}>Rename</button>
                        <button onClick={() => deleteCassette(cassette.id)} className="btn-danger" disabled={saving}>
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {currentCassette && (
        <div className="cassette-songs-editor">
          <h3>Songs in "{currentCassette.name}"</h3>

          <div className="add-form">
            <h4>Add New Song</h4>
            <input
              placeholder="Song title"
              value={newSong.title}
              onChange={(e) => setNewSong({ ...newSong, title: e.target.value })}
            />
            <input
              placeholder="Artist"
              value={newSong.artist}
              onChange={(e) => setNewSong({ ...newSong, artist: e.target.value })}
            />
            <div className="media-input-group">
              <input
                placeholder="Audio URL (MP3, etc.)"
                value={newSong.url}
                onChange={(e) => setNewSong({ ...newSong, url: e.target.value })}
              />
              <FileUpload
                accept="audio/*"
                label="Upload"
                githubToken={githubToken}
                inputId={`file-cassette-${currentCassette.id}-add`}
                onUpload={(url) => setNewSong({ ...newSong, url })}
              />
            </div>
            <button onClick={handleAddNewSong} disabled={saving}>
              {saving ? 'Saving...' : 'Add New Song'}
            </button>
          </div>

          {availableSongs.length > 0 && (
            <div className="existing-songs-picker">
              <button
                className="picker-toggle"
                onClick={() => setShowSongPicker(!showSongPicker)}
              >
                {showSongPicker ? 'Hide' : 'Add'} Existing Songs ({availableSongs.length} available)
              </button>
              {showSongPicker && (
                <div className="song-picker-list">
                  {availableSongs.map(song => (
                    <div key={song.id} className="song-picker-item">
                      <div className="song-picker-info">
                        <strong>{song.title}</strong>
                        <span>{song.artist}</span>
                      </div>
                      <button
                        onClick={() => addSongToCassette(currentCassette.id, song.id)}
                        disabled={saving}
                      >
                        Add
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="items-list">
            {currentSongs.map((song, index) => (
              <div key={song.id} className="item">
                {editingSong?.id === song.id ? (
                  <>
                    <input
                      value={editingSong.title}
                      onChange={(e) => setEditingSong(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Song title"
                    />
                    <input
                      value={editingSong.artist || ''}
                      onChange={(e) => setEditingSong(prev => ({ ...prev, artist: e.target.value }))}
                      placeholder="Artist"
                    />
                    <div className="media-input-group">
                      <input
                        value={editingSong.url}
                        onChange={(e) => setEditingSong(prev => ({ ...prev, url: e.target.value }))}
                        placeholder="Audio URL"
                      />
                      <FileUpload
                        accept="audio/*"
                        label="Upload"
                        githubToken={githubToken}
                        inputId={`file-song-edit-${song.id}`}
                        onUpload={(url) => {
                          setEditingSong(prev => {
                            const updated = { ...prev, url }
                            updateSong(song.id, updated)
                            return null
                          })
                        }}
                      />
                    </div>
                    <div className="item-actions">
                      <button onClick={() => handleUpdateSong(song.id)} disabled={saving}>
                        {saving ? 'Saving...' : 'Save'}
                      </button>
                      <button onClick={() => setEditingSong(null)}>Cancel</button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="item-info">
                      <strong>{song.title}</strong>
                      <span className="item-meta">{song.artist || 'Unknown artist'}</span>
                      <span className="item-meta item-url">{song.url}</span>
                    </div>
                    <div className="item-actions">
                      <button
                        onClick={() => moveSong(index, -1)}
                        disabled={saving || index === 0}
                        title="Move up"
                      >
                        ↑
                      </button>
                      <button
                        onClick={() => moveSong(index, 1)}
                        disabled={saving || index === currentSongs.length - 1}
                        title="Move down"
                      >
                        ↓
                      </button>
                      <button onClick={() => setEditingSong({ ...song })}>Edit</button>
                      <button
                        onClick={() => removeSongFromCassette(currentCassette.id, song.id)}
                        className="btn-warning"
                        disabled={saving}
                        title="Remove from this cassette"
                      >
                        Remove
                      </button>
                      <button
                        onClick={() => deleteSong(song.id)}
                        className="btn-danger"
                        disabled={saving}
                        title="Delete song from all cassettes"
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
            {currentSongs.length === 0 && (
              <p className="empty-note">No songs yet. Add some above!</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function SiteSettingsManager({ siteSettings, updateSiteSettings, saving }) {
  const [pendingChanges, setPendingChanges] = useState({})

  const handleFieldChange = (section, field, value) => {
    setPendingChanges(prev => ({
      ...prev,
      [`${section}.${field}`]: { section, field, value }
    }))
  }

  const handleSave = (section, field) => {
    const key = `${section}.${field}`
    if (pendingChanges[key]) {
      updateSiteSettings(section, { [field]: pendingChanges[key].value })
      setPendingChanges(prev => {
        const next = { ...prev }
        delete next[key]
        return next
      })
    }
  }

  const getValue = (section, field) => {
    const key = `${section}.${field}`
    if (pendingChanges[key]) {
      return pendingChanges[key].value
    }
    return siteSettings[section]?.[field] || ''
  }

  return (
    <div className="manager">
      <h2>Site Settings</h2>
      <p className="manager-note">Edit a field and click Save to push to GitHub.</p>

      <div className="settings-section">
        <h3>Home Page</h3>
        <div className="settings-fields">
          <label>
            <span>Greeting</span>
            <div className="settings-field-row">
              <input
                value={getValue('hero', 'greeting')}
                onChange={(e) => handleFieldChange('hero', 'greeting', e.target.value)}
                placeholder="hi, i'm"
              />
              <button onClick={() => handleSave('hero', 'greeting')} disabled={saving} className="btn-save-field">
                Save
              </button>
            </div>
          </label>
          <label>
            <span>Name</span>
            <div className="settings-field-row">
              <input
                value={getValue('hero', 'name')}
                onChange={(e) => handleFieldChange('hero', 'name', e.target.value)}
                placeholder="mabel"
              />
              <button onClick={() => handleSave('hero', 'name')} disabled={saving} className="btn-save-field">
                Save
              </button>
            </div>
          </label>
          <label>
            <span>Subtitle</span>
            <div className="settings-field-row">
              <input
                value={getValue('hero', 'subtitle')}
                onChange={(e) => handleFieldChange('hero', 'subtitle', e.target.value)}
                placeholder="16. messing around..."
              />
              <button onClick={() => handleSave('hero', 'subtitle')} disabled={saving} className="btn-save-field">
                Save
              </button>
            </div>
          </label>
        </div>
      </div>

      <div className="settings-section">
        <h3>Videos Page</h3>
        <div className="settings-fields">
          <label>
            <span>Title</span>
            <div className="settings-field-row">
              <input
                value={getValue('videos', 'title')}
                onChange={(e) => handleFieldChange('videos', 'title', e.target.value)}
                placeholder="videos"
              />
              <button onClick={() => handleSave('videos', 'title')} disabled={saving} className="btn-save-field">
                Save
              </button>
            </div>
          </label>
          <label>
            <span>Intro Text</span>
            <div className="settings-field-row">
              <input
                value={getValue('videos', 'intro')}
                onChange={(e) => handleFieldChange('videos', 'intro', e.target.value)}
                placeholder="Page introduction..."
              />
              <button onClick={() => handleSave('videos', 'intro')} disabled={saving} className="btn-save-field">
                Save
              </button>
            </div>
          </label>
        </div>
      </div>

      <div className="settings-section">
        <h3>Designs Page</h3>
        <div className="settings-fields">
          <label>
            <span>Title</span>
            <div className="settings-field-row">
              <input
                value={getValue('designs', 'title')}
                onChange={(e) => handleFieldChange('designs', 'title', e.target.value)}
                placeholder="designs"
              />
              <button onClick={() => handleSave('designs', 'title')} disabled={saving} className="btn-save-field">
                Save
              </button>
            </div>
          </label>
          <label>
            <span>Intro Text</span>
            <div className="settings-field-row">
              <input
                value={getValue('designs', 'intro')}
                onChange={(e) => handleFieldChange('designs', 'intro', e.target.value)}
                placeholder="Page introduction..."
              />
              <button onClick={() => handleSave('designs', 'intro')} disabled={saving} className="btn-save-field">
                Save
              </button>
            </div>
          </label>
        </div>
      </div>

      <div className="settings-section">
        <h3>Contact Page</h3>
        <div className="settings-fields">
          <label>
            <span>Title</span>
            <div className="settings-field-row">
              <input
                value={getValue('contact', 'title')}
                onChange={(e) => handleFieldChange('contact', 'title', e.target.value)}
                placeholder="contact"
              />
              <button onClick={() => handleSave('contact', 'title')} disabled={saving} className="btn-save-field">
                Save
              </button>
            </div>
          </label>
          <label>
            <span>Intro Text</span>
            <div className="settings-field-row">
              <input
                value={getValue('contact', 'intro')}
                onChange={(e) => handleFieldChange('contact', 'intro', e.target.value)}
                placeholder="Page introduction..."
              />
              <button onClick={() => handleSave('contact', 'intro')} disabled={saving} className="btn-save-field">
                Save
              </button>
            </div>
          </label>
          <label>
            <span>Location</span>
            <div className="settings-field-row">
              <input
                value={getValue('contact', 'location')}
                onChange={(e) => handleFieldChange('contact', 'location', e.target.value)}
                placeholder="San Diego, CA"
              />
              <button onClick={() => handleSave('contact', 'location')} disabled={saving} className="btn-save-field">
                Save
              </button>
            </div>
          </label>
        </div>
      </div>
    </div>
  )
}

export default Admin
