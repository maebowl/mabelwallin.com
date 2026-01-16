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

  const {
    siteSettings, videos, designs, socials, badges,
    updateSiteSettings,
    addVideo, updateVideo, deleteVideo,
    addDesign, updateDesign, deleteDesign,
    updateSocial,
    addBadge, updateBadge, deleteBadge, reorderBadges,
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
    setIsAuthenticated(false)
    sessionStorage.removeItem(AUTH_KEY)
  }

  const handleSaveToken = () => {
    localStorage.setItem(GITHUB_TOKEN_KEY, githubToken)
    setShowTokenInput(false)
    setSaveStatus('Token saved!')
    setTimeout(() => setSaveStatus(''), 3000)
  }

  // Auto-save to GitHub with updated data
  const autoSave = async (updatedData) => {
    if (!githubToken) {
      setSaveStatus('Error: Set your GitHub token first!')
      setShowTokenInput(true)
      setTimeout(() => setSaveStatus(''), 3000)
      return false
    }

    setSaving(true)
    setSaveStatus('Saving...')

    try {
      await saveToGitHub(updatedData, githubToken)
      setSaveStatus('Saved!')
      setTimeout(() => setSaveStatus(''), 2000)
      return true
    } catch (err) {
      setSaveStatus(`Error: ${err.message}`)
      setTimeout(() => setSaveStatus(''), 5000)
      return false
    } finally {
      setSaving(false)
    }
  }

  // Wrapped functions that save after updating
  const handleAddVideo = async (video) => {
    const id = Math.max(0, ...videos.map(v => v.id)) + 1
    const newVideos = [...videos, { ...video, id }]
    addVideo(video)
    await autoSave({ siteSettings, videos: newVideos, designs, socials, badges })
  }

  const handleUpdateVideo = async (id, updates) => {
    const newVideos = videos.map(v => v.id === id ? { ...v, ...updates } : v)
    updateVideo(id, updates)
    await autoSave({ siteSettings, videos: newVideos, designs, socials, badges })
  }

  const handleDeleteVideo = async (id) => {
    const newVideos = videos.filter(v => v.id !== id)
    deleteVideo(id)
    await autoSave({ siteSettings, videos: newVideos, designs, socials, badges })
  }

  const handleAddDesign = async (design) => {
    const id = Math.max(0, ...designs.map(d => d.id)) + 1
    const newDesigns = [...designs, { ...design, id }]
    addDesign(design)
    await autoSave({ siteSettings, videos, designs: newDesigns, socials, badges })
  }

  const handleUpdateDesign = async (id, updates) => {
    const newDesigns = designs.map(d => d.id === id ? { ...d, ...updates } : d)
    updateDesign(id, updates)
    await autoSave({ siteSettings, videos, designs: newDesigns, socials, badges })
  }

  const handleDeleteDesign = async (id) => {
    const newDesigns = designs.filter(d => d.id !== id)
    deleteDesign(id)
    await autoSave({ siteSettings, videos, designs: newDesigns, socials, badges })
  }

  const handleUpdateSocial = async (id, updates) => {
    const newSocials = socials.map(s => s.id === id ? { ...s, ...updates } : s)
    updateSocial(id, updates)
    await autoSave({ siteSettings, videos, designs, socials: newSocials, badges })
  }

  const handleAddBadge = async (badge) => {
    const id = Math.max(0, ...badges.map(b => b.id)) + 1
    const newBadges = [...badges, { ...badge, id }]
    addBadge(badge)
    await autoSave({ siteSettings, videos, designs, socials, badges: newBadges })
  }

  const handleUpdateBadge = async (id, updates) => {
    const newBadges = badges.map(b => b.id === id ? { ...b, ...updates } : b)
    updateBadge(id, updates)
    await autoSave({ siteSettings, videos, designs, socials, badges: newBadges })
  }

  const handleDeleteBadge = async (id) => {
    const newBadges = badges.filter(b => b.id !== id)
    deleteBadge(id)
    await autoSave({ siteSettings, videos, designs, socials, badges: newBadges })
  }

  const handleReorderBadges = async (newBadges) => {
    reorderBadges(newBadges)
    await autoSave({ siteSettings, videos, designs, socials, badges: newBadges })
  }

  const handleUpdateSiteSettings = async (section, updates) => {
    const newSettings = {
      ...siteSettings,
      [section]: { ...siteSettings[section], ...updates }
    }
    updateSiteSettings(section, updates)
    await autoSave({ siteSettings: newSettings, videos, designs, socials, badges })
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
                        const updated = { ...prev, image: url }
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
