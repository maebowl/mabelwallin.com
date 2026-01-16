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
    siteSettings, videos, designs, socials,
    updateSiteSettings,
    addVideo, updateVideo, deleteVideo,
    addDesign, updateDesign, deleteDesign,
    updateSocial, resetToDefaults
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

  const handleSaveToGitHub = async () => {
    if (!githubToken) {
      setShowTokenInput(true)
      return
    }

    setSaving(true)
    setSaveStatus('')

    try {
      await saveToGitHub({ siteSettings, videos, designs, socials }, githubToken)
      setSaveStatus('Saved to GitHub! Site will rebuild shortly.')
    } catch (err) {
      setSaveStatus(`Error: ${err.message}`)
    } finally {
      setSaving(false)
      setTimeout(() => setSaveStatus(''), 5000)
    }
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
            <button
              onClick={handleSaveToGitHub}
              className="btn-primary"
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save to GitHub'}
            </button>
            <button onClick={() => setShowTokenInput(!showTokenInput)} className="btn-secondary">
              {githubToken ? 'Change Token' : 'Set Token'}
            </button>
            <button onClick={resetToDefaults} className="btn-secondary">Reset</button>
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

        {saveStatus && (
          <div className={`save-status ${saveStatus.includes('Error') ? 'error' : 'success'}`}>
            {saveStatus}
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
              addVideo={addVideo}
              updateVideo={updateVideo}
              deleteVideo={deleteVideo}
            />
          )}
          {activeTab === 'designs' && (
            <DesignsManager
              designs={designs}
              addDesign={addDesign}
              updateDesign={updateDesign}
              deleteDesign={deleteDesign}
              githubToken={githubToken}
            />
          )}
          {activeTab === 'socials' && (
            <SocialsManager socials={socials} updateSocial={updateSocial} />
          )}
          {activeTab === 'settings' && (
            <SiteSettingsManager siteSettings={siteSettings} updateSiteSettings={updateSiteSettings} />
          )}
        </div>
      </div>
    </div>
  )
}

function FileUpload({ onUpload, accept, label, githubToken }) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef(null)

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
        id={`file-${label}`}
      />
      <label htmlFor={`file-${label}`} className={`file-upload-btn ${uploading ? 'uploading' : ''}`}>
        {uploading ? 'Uploading...' : label}
      </label>
      {error && <span className="file-upload-error">{error}</span>}
    </div>
  )
}

function VideosManager({ videos, addVideo, updateVideo, deleteVideo }) {
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
        <button onClick={handleAdd}>Add Video</button>
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
                  <button onClick={() => handleUpdate(video.id)}>Save</button>
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
                  <button onClick={() => deleteVideo(video.id)} className="btn-danger">Delete</button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function DesignsManager({ designs, addDesign, updateDesign, deleteDesign, githubToken }) {
  const [editing, setEditing] = useState(null)
  const [newDesign, setNewDesign] = useState({ title: '', category: '', description: '', image: '' })

  const handleAdd = () => {
    if (!newDesign.title || !newDesign.image) return
    addDesign(newDesign)
    setNewDesign({ title: '', category: '', description: '', image: '' })
  }

  const handleUpdate = (id) => {
    updateDesign(id, editing)
    setEditing(null)
  }

  return (
    <div className="manager">
      <h2>Designs</h2>
      <p className="manager-note">Upload images or paste a URL.</p>

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
            onUpload={(url) => setNewDesign({ ...newDesign, image: url })}
          />
        </div>
        <input
          placeholder="Description (optional)"
          value={newDesign.description}
          onChange={(e) => setNewDesign({ ...newDesign, description: e.target.value })}
        />
        <button onClick={handleAdd}>Add Design</button>
      </div>

      <div className="items-list">
        {designs.map((design) => (
          <div key={design.id} className="item">
            {editing?.id === design.id ? (
              <>
                <input
                  value={editing.title}
                  onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                  placeholder="Title"
                />
                <input
                  value={editing.category || ''}
                  onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                  placeholder="Category"
                />
                <div className="media-input-group">
                  <input
                    value={editing.image || ''}
                    onChange={(e) => setEditing({ ...editing, image: e.target.value })}
                    placeholder="Image URL"
                  />
                  <FileUpload
                    accept="image/*"
                    label="Upload"
                    githubToken={githubToken}
                    onUpload={(url) => setEditing({ ...editing, image: url })}
                  />
                </div>
                <input
                  value={editing.description || ''}
                  onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                  placeholder="Description"
                />
                <div className="item-actions">
                  <button onClick={() => handleUpdate(design.id)}>Save</button>
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
                  <button onClick={() => deleteDesign(design.id)} className="btn-danger">Delete</button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function SocialsManager({ socials, updateSocial }) {
  const [editing, setEditing] = useState(null)

  const handleUpdate = (id) => {
    updateSocial(id, editing)
    setEditing(null)
  }

  return (
    <div className="manager">
      <h2>Contact Links</h2>
      <p className="manager-note">Edit your social media links and handles.</p>

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
                  <button onClick={() => handleUpdate(social.id)}>Save</button>
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

function SiteSettingsManager({ siteSettings, updateSiteSettings }) {
  return (
    <div className="manager">
      <h2>Site Settings</h2>
      <p className="manager-note">Customize page titles and intro text.</p>

      <div className="settings-section">
        <h3>Home Page</h3>
        <div className="settings-fields">
          <label>
            <span>Greeting</span>
            <input
              value={siteSettings.hero.greeting}
              onChange={(e) => updateSiteSettings('hero', { greeting: e.target.value })}
              placeholder="hi, i'm"
            />
          </label>
          <label>
            <span>Name</span>
            <input
              value={siteSettings.hero.name}
              onChange={(e) => updateSiteSettings('hero', { name: e.target.value })}
              placeholder="mabel"
            />
          </label>
          <label>
            <span>Subtitle</span>
            <input
              value={siteSettings.hero.subtitle}
              onChange={(e) => updateSiteSettings('hero', { subtitle: e.target.value })}
              placeholder="16. messing around..."
            />
          </label>
        </div>
      </div>

      <div className="settings-section">
        <h3>Videos Page</h3>
        <div className="settings-fields">
          <label>
            <span>Title</span>
            <input
              value={siteSettings.videos.title}
              onChange={(e) => updateSiteSettings('videos', { title: e.target.value })}
              placeholder="videos"
            />
          </label>
          <label>
            <span>Intro Text</span>
            <textarea
              value={siteSettings.videos.intro}
              onChange={(e) => updateSiteSettings('videos', { intro: e.target.value })}
              placeholder="Page introduction..."
              rows={2}
            />
          </label>
        </div>
      </div>

      <div className="settings-section">
        <h3>Designs Page</h3>
        <div className="settings-fields">
          <label>
            <span>Title</span>
            <input
              value={siteSettings.designs.title}
              onChange={(e) => updateSiteSettings('designs', { title: e.target.value })}
              placeholder="designs"
            />
          </label>
          <label>
            <span>Intro Text</span>
            <textarea
              value={siteSettings.designs.intro}
              onChange={(e) => updateSiteSettings('designs', { intro: e.target.value })}
              placeholder="Page introduction..."
              rows={2}
            />
          </label>
        </div>
      </div>

      <div className="settings-section">
        <h3>Contact Page</h3>
        <div className="settings-fields">
          <label>
            <span>Title</span>
            <input
              value={siteSettings.contact.title}
              onChange={(e) => updateSiteSettings('contact', { title: e.target.value })}
              placeholder="contact"
            />
          </label>
          <label>
            <span>Intro Text</span>
            <textarea
              value={siteSettings.contact.intro}
              onChange={(e) => updateSiteSettings('contact', { intro: e.target.value })}
              placeholder="Page introduction..."
              rows={2}
            />
          </label>
          <label>
            <span>Location</span>
            <input
              value={siteSettings.contact.location || ''}
              onChange={(e) => updateSiteSettings('contact', { location: e.target.value })}
              placeholder="San Diego, CA"
            />
          </label>
        </div>
      </div>
    </div>
  )
}

export default Admin
