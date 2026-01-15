import { useState } from 'react';

const REPO_OWNER = 'maebowl';
const REPO_NAME = 'mabelwallin.com';
const BRANCH = 'master';

export default function Admin() {
  const [activeTab, setActiveTab] = useState('videos');
  const [githubToken, setGithubToken] = useState('');
  const [pushStatus, setPushStatus] = useState({ loading: false, message: '', error: false });

  // Videos state
  const [videos, setVideos] = useState([
    {
      id: 1,
      title: 'yosemite vlog',
      description: 'sequel coming soon',
      videoId: 'Ttutmwz4BtE',
      isVertical: false,
    },
    {
      id: 2,
      title: 'Mabel and Bryce go fishing',
      description: '',
      videoId: 'hJfbYTFYudE',
      isVertical: true,
    },
    {
      id: 3,
      title: "Mabel's Train Adventure",
      description: '',
      videoId: 'cJezhteJgT8',
      isVertical: true,
    },
    {
      id: 4,
      title: 'The Abandoned Pub',
      description: '',
      videoId: '_RmdBZYhu4A',
      isVertical: true,
    },
  ]);

  // Designs state
  const [designs, setDesigns] = useState([
    {
      id: 1,
      title: 'Design Project 1',
      category: 'Branding',
      description: 'Description of your first design project',
      image: 'https://via.placeholder.com/800x600/8b5cf6/ffffff?text=Design+1',
    },
    {
      id: 2,
      title: 'Design Project 2',
      category: 'Typography',
      description: 'Description of your second design project',
      image: 'https://via.placeholder.com/800x600/7c3aed/ffffff?text=Design+2',
    },
    {
      id: 3,
      title: 'Design Project 3',
      category: 'Layout',
      description: 'Description of your third design project',
      image: 'https://via.placeholder.com/800x600/6d28d9/ffffff?text=Design+3',
    },
    {
      id: 4,
      title: 'Design Project 4',
      category: 'Illustration',
      description: 'Description of your fourth design project',
      image: 'https://via.placeholder.com/800x600/5b21b6/ffffff?text=Design+4',
    },
    {
      id: 5,
      title: 'Design Project 5',
      category: 'Poster Design',
      description: 'Description of your fifth design project',
      image: 'https://via.placeholder.com/800x600/4c1d95/ffffff?text=Design+5',
    },
    {
      id: 6,
      title: 'Design Project 6',
      category: 'Digital Art',
      description: 'Description of your sixth design project',
      image: 'https://via.placeholder.com/800x600/3b0764/ffffff?text=Design+6',
    },
  ]);

  // New item forms
  const [newVideo, setNewVideo] = useState({ title: '', description: '', videoId: '', isVertical: false });
  const [newDesign, setNewDesign] = useState({ title: '', category: '', description: '', image: '' });

  const extractVideoId = (url) => {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([^&\s]+)/);
    return match ? match[1] : url;
  };

  const addVideo = () => {
    if (!newVideo.title || !newVideo.videoId) return;
    const videoId = extractVideoId(newVideo.videoId);
    setVideos([...videos, { ...newVideo, videoId, id: Date.now() }]);
    setNewVideo({ title: '', description: '', videoId: '', isVertical: false });
  };

  const removeVideo = (id) => {
    setVideos(videos.filter(v => v.id !== id));
  };

  const addDesign = () => {
    if (!newDesign.title || !newDesign.image) return;
    setDesigns([...designs, { ...newDesign, id: Date.now() }]);
    setNewDesign({ title: '', category: '', description: '', image: '' });
  };

  const removeDesign = (id) => {
    setDesigns(designs.filter(d => d.id !== id));
  };

  const generateVideosFileContent = () => {
    return `import { useState } from 'react';

export default function Videos() {
  const [videos] = useState([
${videos.map(v => `    {
      id: ${v.id},
      title: ${JSON.stringify(v.title)},
      description: ${JSON.stringify(v.description)},
      thumbnail: 'https://img.youtube.com/vi/${v.videoId}/${v.isVertical ? 'hqdefault' : 'maxresdefault'}.jpg',
      videoUrl: 'https://youtu.be/${v.videoId}',
      videoId: '${v.videoId}',
    }`).join(',\n')},
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
                  src={\`https://www.youtube.com/embed/\${selectedVideo.videoId}\`}
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
`;
  };

  const generateDesignsFileContent = () => {
    return `import { useState } from 'react';

export default function Design() {
  const [designs] = useState([
${designs.map(d => `    {
      id: ${d.id},
      title: ${JSON.stringify(d.title)},
      category: ${JSON.stringify(d.category)},
      description: ${JSON.stringify(d.description)},
      image: ${JSON.stringify(d.image)},
    }`).join(',\n')},
  ]);

  const [selectedDesign, setSelectedDesign] = useState(null);

  return (
    <div className="space-y-8 px-4">
      <div className="text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">designs</h1>
        <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto px-4">
          photoshop stuff from class and random projects when i'm bored
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {designs.map((design) => (
          <div
            key={design.id}
            className="bg-slate-dark rounded-lg overflow-hidden border-2 border-transparent hover:border-amber-400 transition-colors cursor-pointer"
            onClick={() => setSelectedDesign(design)}
          >
            <div className="aspect-[4/3] bg-charcoal-300 overflow-hidden">
              <img
                src={design.image}
                alt={design.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-white mb-2">
                {design.title}
              </h3>
              <span className="text-xs font-medium text-amber-400 bg-amber-400/20 px-2 py-1 rounded inline-block mb-2">
                {design.category}
              </span>
              <p className="text-gray-300">{design.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for viewing full design */}
      {selectedDesign && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedDesign(null)}
        >
          <div
            className="bg-slate-dark rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto border border-amber-400"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">
                    {selectedDesign.title}
                  </h2>
                  <span className="text-sm font-medium text-amber-400 bg-amber-400/20 px-3 py-1 rounded">
                    {selectedDesign.category}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedDesign(null)}
                  className="text-gray-400 hover:text-white text-3xl"
                >
                  ×
                </button>
              </div>
              <img
                src={selectedDesign.image}
                alt={selectedDesign.title}
                className="w-full rounded-lg mb-4"
              />
              <p className="text-gray-300">{selectedDesign.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
`;
  };

  const pushToGitHub = async (filePath, content, commitMessage) => {
    if (!githubToken) {
      setPushStatus({ loading: false, message: 'Please enter your GitHub token', error: true });
      return;
    }

    setPushStatus({ loading: true, message: 'Pushing to GitHub...', error: false });

    try {
      // Get the current file to get its SHA
      const getFileResponse = await fetch(
        `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${filePath}?ref=${BRANCH}`,
        {
          headers: {
            'Authorization': `token ${githubToken}`,
            'Accept': 'application/vnd.github.v3+json',
          },
        }
      );

      if (!getFileResponse.ok && getFileResponse.status !== 404) {
        throw new Error('Failed to fetch file info');
      }

      const fileData = getFileResponse.status === 404 ? null : await getFileResponse.json();
      const sha = fileData?.sha;

      // Update or create the file
      const updateResponse = await fetch(
        `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${filePath}`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `token ${githubToken}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: commitMessage,
            content: btoa(unescape(encodeURIComponent(content))),
            branch: BRANCH,
            ...(sha && { sha }),
          }),
        }
      );

      if (!updateResponse.ok) {
        const errorData = await updateResponse.json();
        throw new Error(errorData.message || 'Failed to push to GitHub');
      }

      setPushStatus({ loading: false, message: 'Successfully pushed to GitHub! Site will update shortly.', error: false });
    } catch (error) {
      setPushStatus({ loading: false, message: `Error: ${error.message}`, error: true });
    }
  };

  const pushVideos = () => {
    const content = generateVideosFileContent();
    pushToGitHub('src/pages/Videos.jsx', content, 'Update videos from admin panel');
  };

  const pushDesigns = () => {
    const content = generateDesignsFileContent();
    pushToGitHub('src/pages/Design.jsx', content, 'Update designs from admin panel');
  };

  return (
    <div className="space-y-8 px-4 max-w-4xl mx-auto">
      <div className="text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">admin</h1>
        <p className="text-base sm:text-lg text-gray-300">
          manage your site content
        </p>
      </div>

      {/* GitHub Token Input */}
      <div className="bg-slate-dark rounded-lg p-6 border border-gray-700">
        <h3 className="text-xl font-semibold text-white mb-4">GitHub Authentication</h3>
        <p className="text-gray-400 text-sm mb-4">
          Enter your GitHub personal access token to push changes directly.
          Token is only stored in your browser session and never saved.
        </p>
        <input
          type="password"
          placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
          value={githubToken}
          onChange={(e) => setGithubToken(e.target.value)}
          className="w-full bg-charcoal text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-amber-400 focus:outline-none"
        />
        {pushStatus.message && (
          <p className={`mt-2 text-sm ${pushStatus.error ? 'text-red-400' : 'text-green-400'}`}>
            {pushStatus.message}
          </p>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-4 justify-center">
        <button
          onClick={() => setActiveTab('videos')}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'videos'
              ? 'bg-amber-400 text-charcoal'
              : 'bg-slate-dark text-white hover:bg-slate-dark/80'
          }`}
        >
          Videos
        </button>
        <button
          onClick={() => setActiveTab('designs')}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'designs'
              ? 'bg-amber-400 text-charcoal'
              : 'bg-slate-dark text-white hover:bg-slate-dark/80'
          }`}
        >
          Designs
        </button>
      </div>

      {/* Videos Tab */}
      {activeTab === 'videos' && (
        <div className="space-y-6">
          {/* Add new video form */}
          <div className="bg-slate-dark rounded-lg p-6 border border-gray-700">
            <h3 className="text-xl font-semibold text-white mb-4">Add New Video</h3>
            <div className="grid gap-4">
              <input
                type="text"
                placeholder="Video title"
                value={newVideo.title}
                onChange={(e) => setNewVideo({ ...newVideo, title: e.target.value })}
                className="bg-charcoal text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-amber-400 focus:outline-none"
              />
              <input
                type="text"
                placeholder="YouTube URL or video ID"
                value={newVideo.videoId}
                onChange={(e) => setNewVideo({ ...newVideo, videoId: e.target.value })}
                className="bg-charcoal text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-amber-400 focus:outline-none"
              />
              <input
                type="text"
                placeholder="Description (optional)"
                value={newVideo.description}
                onChange={(e) => setNewVideo({ ...newVideo, description: e.target.value })}
                className="bg-charcoal text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-amber-400 focus:outline-none"
              />
              <label className="flex items-center gap-2 text-gray-300">
                <input
                  type="checkbox"
                  checked={newVideo.isVertical}
                  onChange={(e) => setNewVideo({ ...newVideo, isVertical: e.target.checked })}
                  className="w-4 h-4"
                />
                Vertical video (shorts/reels)
              </label>
              <button
                onClick={addVideo}
                className="bg-amber-400 text-charcoal px-6 py-2 rounded-lg font-medium hover:bg-amber-500 transition-colors"
              >
                Add Video
              </button>
            </div>
          </div>

          {/* Current videos list */}
          <div className="bg-slate-dark rounded-lg p-6 border border-gray-700">
            <h3 className="text-xl font-semibold text-white mb-4">Current Videos</h3>
            <div className="space-y-3">
              {videos.map((video) => (
                <div key={video.id} className="flex items-center justify-between bg-charcoal p-4 rounded-lg">
                  <div className="flex items-center gap-4">
                    <img
                      src={`https://img.youtube.com/vi/${video.videoId}/${video.isVertical ? 'hqdefault' : 'maxresdefault'}.jpg`}
                      alt={video.title}
                      className="w-24 h-14 object-cover rounded"
                    />
                    <div>
                      <p className="text-white font-medium">{video.title}</p>
                      <p className="text-gray-400 text-sm">{video.description || 'No description'}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeVideo(video.id)}
                    className="text-red-400 hover:text-red-300 px-3 py-1"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Push button */}
          <button
            onClick={pushVideos}
            disabled={pushStatus.loading || !githubToken}
            className={`w-full px-6 py-3 rounded-lg font-medium transition-colors ${
              pushStatus.loading || !githubToken
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : 'bg-crimson text-white hover:bg-crimson/80'
            }`}
          >
            {pushStatus.loading ? 'Pushing...' : 'Push Videos to GitHub'}
          </button>
        </div>
      )}

      {/* Designs Tab */}
      {activeTab === 'designs' && (
        <div className="space-y-6">
          {/* Add new design form */}
          <div className="bg-slate-dark rounded-lg p-6 border border-gray-700">
            <h3 className="text-xl font-semibold text-white mb-4">Add New Design</h3>
            <div className="grid gap-4">
              <input
                type="text"
                placeholder="Design title"
                value={newDesign.title}
                onChange={(e) => setNewDesign({ ...newDesign, title: e.target.value })}
                className="bg-charcoal text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-amber-400 focus:outline-none"
              />
              <input
                type="text"
                placeholder="Category (e.g., Branding, Typography)"
                value={newDesign.category}
                onChange={(e) => setNewDesign({ ...newDesign, category: e.target.value })}
                className="bg-charcoal text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-amber-400 focus:outline-none"
              />
              <input
                type="text"
                placeholder="Image URL"
                value={newDesign.image}
                onChange={(e) => setNewDesign({ ...newDesign, image: e.target.value })}
                className="bg-charcoal text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-amber-400 focus:outline-none"
              />
              <input
                type="text"
                placeholder="Description (optional)"
                value={newDesign.description}
                onChange={(e) => setNewDesign({ ...newDesign, description: e.target.value })}
                className="bg-charcoal text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-amber-400 focus:outline-none"
              />
              <button
                onClick={addDesign}
                className="bg-amber-400 text-charcoal px-6 py-2 rounded-lg font-medium hover:bg-amber-500 transition-colors"
              >
                Add Design
              </button>
            </div>
          </div>

          {/* Current designs list */}
          <div className="bg-slate-dark rounded-lg p-6 border border-gray-700">
            <h3 className="text-xl font-semibold text-white mb-4">Current Designs</h3>
            <div className="space-y-3">
              {designs.map((design) => (
                <div key={design.id} className="flex items-center justify-between bg-charcoal p-4 rounded-lg">
                  <div className="flex items-center gap-4">
                    <img
                      src={design.image}
                      alt={design.title}
                      className="w-16 h-12 object-cover rounded"
                    />
                    <div>
                      <p className="text-white font-medium">{design.title}</p>
                      <p className="text-amber-400 text-sm">{design.category}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeDesign(design.id)}
                    className="text-red-400 hover:text-red-300 px-3 py-1"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Push button */}
          <button
            onClick={pushDesigns}
            disabled={pushStatus.loading || !githubToken}
            className={`w-full px-6 py-3 rounded-lg font-medium transition-colors ${
              pushStatus.loading || !githubToken
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : 'bg-crimson text-white hover:bg-crimson/80'
            }`}
          >
            {pushStatus.loading ? 'Pushing...' : 'Push Designs to GitHub'}
          </button>
        </div>
      )}
    </div>
  );
}
