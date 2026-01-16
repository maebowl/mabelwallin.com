import { createContext, useContext, useState } from 'react'

const defaultData = {
  siteSettings: {
      "hero": {
          "greeting": "hi, i'm",
          "name": "mabel",
          "subtitle": "16. messing around and making videos about it"
      },
      "videos": {
          "title": "videos",
          "intro": "stuff i've filmed and edited. still learning but having fun with it"
      },
      "designs": {
          "title": "designs",
          "intro": "photoshop stuff from class and random projects when i'm bored"
      },
      "contact": {
          "title": "contact",
          "intro": "wanna chat? here's where to find me",
          "email": "mabel@mabelwallin.com",
          "location": "San Diego, CA"
      }
  },
  videos: [
      {
          "id": 1,
          "title": "yosemite vlog",
          "description": "sequel coming soon",
          "videoId": "Ttutmwz4BtE",
          "isVertical": false
      },
      {
          "id": 2,
          "title": "Mabel and Bryce go fishing",
          "description": "",
          "videoId": "hJfbYTFYudE",
          "isVertical": true
      },
      {
          "id": 3,
          "title": "Mabel's Train Adventure",
          "description": "",
          "videoId": "cJezhteJgT8",
          "isVertical": true
      },
      {
          "id": 4,
          "title": "The Abandoned Pub",
          "description": "",
          "videoId": "_RmdBZYhu4A",
          "isVertical": true
      }
  ],
  designs: [
      {
          "id": 2,
          "title": "Design Project 2",
          "category": "Typography",
          "description": "Description of your second design project",
          "image": "https://via.placeholder.com/800x600/7c3aed/ffffff?text=Design+2"
      },
      {
          "id": 3,
          "title": "Design Project 3",
          "category": "Layout",
          "description": "Description of your third design project",
          "image": "https://via.placeholder.com/800x600/6d28d9/ffffff?text=Design+3"
      },
      {
          "id": 4,
          "title": "Design Project 4",
          "category": "Illustration",
          "description": "Description of your fourth design project",
          "image": "https://via.placeholder.com/800x600/5b21b6/ffffff?text=Design+4"
      },
      {
          "id": 5,
          "title": "Design Project 5",
          "category": "Poster Design",
          "description": "Description of your fifth design project",
          "image": "https://via.placeholder.com/800x600/4c1d95/ffffff?text=Design+5"
      },
      {
          "id": 6,
          "title": "Design Project 6",
          "category": "Digital Art",
          "description": "Description of your sixth design project",
          "image": "https://via.placeholder.com/800x600/3b0764/ffffff?text=Design+6"
      }
  ],
  socials: [
      {
          "id": "email",
          "name": "Email",
          "handle": "mabel@mabelwallin.com",
          "url": "mailto:mabel@mabelwallin.com"
      },
      {
          "id": "youtube",
          "name": "YouTube",
          "handle": "@MabelWallin",
          "url": "https://youtube.com/@MabelWallin"
      },
      {
          "id": "tiktok",
          "name": "TikTok",
          "handle": "@maebowl",
          "url": "https://tiktok.com/@maebowl"
      }
  ],
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
