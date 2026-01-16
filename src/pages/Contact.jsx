import { useSiteData } from '../data/siteData'

export default function Contact() {
  const { socials, badges, siteSettings } = useSiteData()
  const contactSettings = siteSettings?.contact || {}

  const getSocialIcon = (name) => {
    const lower = name.toLowerCase()
    if (lower.includes('email') || lower.includes('mail')) {
      return (
        <svg className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    }
    if (lower.includes('youtube')) {
      return (
        <svg className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      )
    }
    if (lower.includes('tiktok')) {
      return (
        <svg className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
        </svg>
      )
    }
    if (lower.includes('instagram')) {
      return (
        <svg className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      )
    }
    // Default link icon
    return (
      <svg className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
      </svg>
    )
  }

  return (
    <div className="space-y-8 px-4">
      <div className="text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
          {contactSettings.title || 'contact'}
        </h1>
        <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto px-4">
          {contactSettings.intro || "let's connect! hit me up if you want to work together or just chat"}
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="bg-slate-dark rounded-lg p-6 sm:p-8 border border-amber-400/30">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg sm:text-xl font-semibold text-amber-400 mb-4">
                get in touch
              </h3>
              <div className="space-y-4">
                {socials.map((social) => (
                  <a
                    key={social.id}
                    href={social.url}
                    target={social.url.startsWith('mailto:') ? undefined : '_blank'}
                    rel={social.url.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
                    className="flex items-center gap-3 text-gray-300 hover:text-amber-400 transition-colors text-sm sm:text-base"
                  >
                    {getSocialIcon(social.name)}
                    <span className={social.name.toLowerCase().includes('email') ? 'break-all' : ''}>
                      {social.handle}
                    </span>
                  </a>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-charcoal-300">
              <p className="text-gray-400 text-xs sm:text-sm">
                based in {contactSettings.location || 'san diego, ca'} • probably procrastinating rn
              </p>
            </div>

            {badges && badges.length > 0 && (
              <div className="pt-6 border-t border-charcoal-300">
                <h3 className="text-sm font-semibold text-gray-400 mb-3">badges</h3>
                <div className="flex flex-wrap gap-2">
                  {badges.map((badge) => (
                    <a
                      key={badge.id}
                      href={badge.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:opacity-80 transition-opacity"
                    >
                      <img
                        src={`${badge.image}${badge.image.includes('?') ? '&' : '?'}v=${badge.updatedAt || badge.id}`}
                        alt={badge.alt || 'badge'}
                        width="88"
                        height="31"
                        className="pixelated"
                        style={{ imageRendering: 'pixelated' }}
                      />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
