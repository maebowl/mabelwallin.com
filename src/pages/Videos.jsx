import { useState } from 'react';

export default function Videos() {
  const [videos] = useState([
    {
      id: 1,
      title: 'yosemite vlog',
      description: 'sequel coming soon',
      thumbnail: 'https://img.youtube.com/vi/Ttutmwz4BtE/maxresdefault.jpg',
      videoUrl: 'https://youtu.be/Ttutmwz4BtE',
      videoId: 'Ttutmwz4BtE',
    },
    {
      id: 2,
      title: 'Mabel and Bryce go fishing',
      description: '',
      thumbnail: 'https://img.youtube.com/vi/hJfbYTFYudE/maxresdefault.jpg',
      videoUrl: 'https://youtu.be/hJfbYTFYudE',
      videoId: 'hJfbYTFYudE',
    },
    {
      id: 3,
      title: "Mabel's Train Adventure",
      description: '',
      thumbnail: 'https://img.youtube.com/vi/cJezhteJgT8/maxresdefault.jpg',
      videoUrl: 'https://youtu.be/cJezhteJgT8',
      videoId: 'cJezhteJgT8',
    },
    {
      id: 4,
      title: 'The Abandoned Pub',
      description: '',
      thumbnail: 'https://img.youtube.com/vi/_RmdBZYhu4A/maxresdefault.jpg',
      videoUrl: 'https://youtu.be/_RmdBZYhu4A',
      videoId: '_RmdBZYhu4A',
    },
  ]);

  const [selectedVideo, setSelectedVideo] = useState(null);

  return (
    <div className="space-y-8 px-4">
      <div className="text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">videos</h1>
        <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto px-4">
          stuff i've filmed and edited. still learning but having fun with it
        </p>
        <div className="mt-4">
          <a
            href="https://youtube.com/@MabelWallin"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-500 transition-colors text-sm sm:text-base"
          >
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
            <span>watch more on youtube</span>
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {videos.map((video) => (
          <div
            key={video.id}
            onClick={() => setSelectedVideo(video)}
            className="bg-slate-dark rounded-lg overflow-hidden border-2 border-transparent hover:border-amber-400 transition-colors cursor-pointer"
          >
            <div className="aspect-video bg-charcoal-300 relative group">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-amber-400 text-charcoal px-6 py-3 rounded-full font-medium">
                  Watch Video
                </div>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-white mb-2">
                {video.title}
              </h3>
              <p className="text-gray-300">{video.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Video Modal */}
      {selectedVideo && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedVideo(null)}
        >
          <div
            className="bg-slate-dark rounded-lg max-w-5xl w-full border border-amber-400"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">
                    {selectedVideo.title}
                  </h2>
                  <p className="text-gray-300">{selectedVideo.description}</p>
                </div>
                <button
                  onClick={() => setSelectedVideo(null)}
                  className="text-gray-400 hover:text-white text-3xl"
                >
                  ×
                </button>
              </div>
              <div className="aspect-video">
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${selectedVideo.videoId}`}
                  title={selectedVideo.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  referrerPolicy="strict-origin-when-cross-origin"
                  className="rounded-lg"
                ></iframe>
              </div>
              <div className="mt-4 text-center">
                <a
                  href={selectedVideo.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-400 hover:text-amber-500 text-sm"
                >
                  Open on YouTube →
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
