export default function Contact() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">contact</h1>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto">
          let's connect! hit me up if you want to work together or just chat
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="bg-slate-dark rounded-lg p-8 border border-amber-400/30">
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-amber-400 mb-4">
                get in touch
              </h3>
              <div className="space-y-4">
                <a
                  href="mailto:mabel@mabelwallin.com"
                  className="flex items-center gap-3 text-gray-300 hover:text-amber-400 transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <span>mabel@mabelwallin.com</span>
                </a>

                <a
                  href="https://youtube.com/@MabelWallin"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-gray-300 hover:text-amber-400 transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                  <span>@MabelWallin</span>
                </a>

                <a
                  href="https://tiktok.com/@maebowl"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-gray-300 hover:text-amber-400 transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                  </svg>
                  <span>@maebowl</span>
                </a>
              </div>
            </div>

            <div className="pt-6 border-t border-charcoal-300">
              <p className="text-gray-400 text-sm">
                based in san diego, ca • probably procrastinating rn
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
