const GITHUB_REPO = 'maebowl/mabelwallin.com'
const DATA_FILE_PATH = 'src/data/siteData.jsx'
const UPLOADS_PATH = 'public/uploads'

// Helper to properly encode UTF-8 to base64
function utf8ToBase64(str) {
  const encoder = new TextEncoder()
  const bytes = encoder.encode(str)
  let binary = ''
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary)
}

export async function saveToGitHub(data, token) {
  if (!token) {
    throw new Error('GitHub token is required')
  }

  // Get the current file to get its SHA
  const fileResponse = await fetch(
    `https://api.github.com/repos/${GITHUB_REPO}/contents/${DATA_FILE_PATH}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json',
      },
    }
  )

  if (!fileResponse.ok) {
    const errorData = await fileResponse.json().catch(() => ({}))
    throw new Error(errorData.message || `Failed to fetch file: ${fileResponse.status}`)
  }

  const fileData = await fileResponse.json()
  const currentSha = fileData.sha

  // Generate the new file content
  const newContent = generateSiteDataFile(data)
  const encodedContent = utf8ToBase64(newContent)

  // Commit the changes
  const updateResponse = await fetch(
    `https://api.github.com/repos/${GITHUB_REPO}/contents/${DATA_FILE_PATH}`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'Update site content via admin panel',
        content: encodedContent,
        sha: currentSha,
      }),
    }
  )

  if (!updateResponse.ok) {
    const error = await updateResponse.json()
    throw new Error(error.message || 'Failed to save to GitHub')
  }

  return await updateResponse.json()
}

export async function uploadFileToGitHub(file, token) {
  if (!token) {
    throw new Error('GitHub token is required')
  }

  // Generate unique filename with timestamp
  const timestamp = Date.now()
  const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
  const filename = `${timestamp}-${safeName}`
  const filePath = `${UPLOADS_PATH}/${filename}`

  // Read file as base64
  const base64Content = await new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result
      // Remove data URL prefix (e.g., "data:image/png;base64,")
      const base64 = result.split(',')[1]
      resolve(base64)
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })

  // Check if file already exists (to get SHA for update)
  let existingSha = null
  try {
    const checkResponse = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/contents/${filePath}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github.v3+json',
        },
      }
    )
    if (checkResponse.ok) {
      const existingFile = await checkResponse.json()
      existingSha = existingFile.sha
    }
  } catch (e) {
    // File doesn't exist, that's fine
  }

  // Upload file to GitHub
  const uploadBody = {
    message: `Upload ${filename}`,
    content: base64Content,
  }
  if (existingSha) {
    uploadBody.sha = existingSha
  }

  const uploadResponse = await fetch(
    `https://api.github.com/repos/${GITHUB_REPO}/contents/${filePath}`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(uploadBody),
    }
  )

  if (!uploadResponse.ok) {
    const error = await uploadResponse.json()
    throw new Error(error.message || 'Failed to upload file')
  }

  // Return the public URL path (relative to site root)
  return `/uploads/${filename}`
}

function generateSiteDataFile(data) {
  const { siteSettings, videos, designs, socials, badges } = data

  // Helper to indent JSON properly
  const indent = (json) => {
    const lines = json.split('\n')
    return lines.map((line, i) => i === 0 ? line : '  ' + line).join('\n')
  }

  return `import { createContext, useContext, useState } from 'react'

const defaultData = {
  siteSettings: ${indent(JSON.stringify(siteSettings, null, 4))},
  videos: ${indent(JSON.stringify(videos, null, 4))},
  designs: ${indent(JSON.stringify(designs, null, 4))},
  socials: ${indent(JSON.stringify(socials, null, 4))},
  badges: ${indent(JSON.stringify(badges, null, 4))},
}

const SiteDataContext = createContext()

export function SiteDataProvider({ children }) {
  const [data, setData] = useState(defaultData)

  const addVideo = (video) => {
    const id = Math.max(0, ...data.videos.map(v => v.id)) + 1
    setData(prev => ({ ...prev, videos: [...prev.videos, { ...video, id }] }))
  }

  const updateVideo = (id, updates) => {
    setData(prev => ({
      ...prev,
      videos: prev.videos.map(v => v.id === id ? { ...v, ...updates } : v)
    }))
  }

  const deleteVideo = (id) => {
    setData(prev => ({ ...prev, videos: prev.videos.filter(v => v.id !== id) }))
  }

  const addDesign = (design) => {
    const id = Math.max(0, ...data.designs.map(d => d.id)) + 1
    setData(prev => ({ ...prev, designs: [...prev.designs, { ...design, id }] }))
  }

  const updateDesign = (id, updates) => {
    setData(prev => ({
      ...prev,
      designs: prev.designs.map(d => d.id === id ? { ...d, ...updates } : d)
    }))
  }

  const deleteDesign = (id) => {
    setData(prev => ({ ...prev, designs: prev.designs.filter(d => d.id !== id) }))
  }

  const updateSocial = (id, updates) => {
    setData(prev => ({
      ...prev,
      socials: prev.socials.map(s => s.id === id ? { ...s, ...updates } : s)
    }))
  }

  const addBadge = (badge) => {
    const id = Math.max(0, ...data.badges.map(b => b.id)) + 1
    setData(prev => ({ ...prev, badges: [...prev.badges, { ...badge, id }] }))
  }

  const updateBadge = (id, updates) => {
    setData(prev => ({
      ...prev,
      badges: prev.badges.map(b => b.id === id ? { ...b, ...updates } : b)
    }))
  }

  const deleteBadge = (id) => {
    setData(prev => ({ ...prev, badges: prev.badges.filter(b => b.id !== id) }))
  }

  const reorderBadges = (newBadges) => {
    setData(prev => ({ ...prev, badges: newBadges }))
  }

  const updateSiteSettings = (section, updates) => {
    setData(prev => ({
      ...prev,
      siteSettings: {
        ...prev.siteSettings,
        [section]: { ...prev.siteSettings[section], ...updates }
      }
    }))
  }

  const resetToDefaults = () => {
    setData(defaultData)
  }

  return (
    <SiteDataContext.Provider value={{
      ...data,
      addVideo,
      updateVideo,
      deleteVideo,
      addDesign,
      updateDesign,
      deleteDesign,
      updateSocial,
      addBadge,
      updateBadge,
      deleteBadge,
      reorderBadges,
      updateSiteSettings,
      resetToDefaults,
    }}>
      {children}
    </SiteDataContext.Provider>
  )
}

export function useSiteData() {
  const context = useContext(SiteDataContext)
  if (!context) {
    throw new Error('useSiteData must be used within SiteDataProvider')
  }
  return context
}
`
}
