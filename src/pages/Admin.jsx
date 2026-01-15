import { useState } from 'react';

export default function Admin() {
  const [activeTab, setActiveTab] = useState('videos');
  const [generatedCode, setGeneratedCode] = useState('');
  const [copied, setCopied] = useState(false);

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

  const generateVideosCode = () => {
    const code = `const [videos] = useState([
${videos.map(v => `    {
      id: ${v.id},
      title: '${v.title.replace(/'/g, "\\'")}',
      description: '${v.description.replace(/'/g, "\\'")}',
      thumbnail: 'https://img.youtube.com/vi/${v.videoId}/${v.isVertical ? 'hqdefault' : 'maxresdefault'}.jpg',
      videoUrl: 'https://youtu.be/${v.videoId}',
      videoId: '${v.videoId}',
    }`).join(',\n')},
  ]);`;
    setGeneratedCode(code);
  };

  const generateDesignsCode = () => {
    const code = `const [designs] = useState([
${designs.map(d => `    {
      id: ${d.id},
      title: '${d.title.replace(/'/g, "\\'")}',
      category: '${d.category.replace(/'/g, "\\'")}',
      description: '${d.description.replace(/'/g, "\\'")}',
      image: '${d.image}',
    }`).join(',\n')},
  ]);`;
    setGeneratedCode(code);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 px-4 max-w-4xl mx-auto">
      <div className="text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">admin</h1>
        <p className="text-base sm:text-lg text-gray-300">
          manage your site content
        </p>
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

          {/* Generate code button */}
          <button
            onClick={generateVideosCode}
            className="w-full bg-crimson text-white px-6 py-3 rounded-lg font-medium hover:bg-crimson/80 transition-colors"
          >
            Generate Videos Code
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

          {/* Generate code button */}
          <button
            onClick={generateDesignsCode}
            className="w-full bg-crimson text-white px-6 py-3 rounded-lg font-medium hover:bg-crimson/80 transition-colors"
          >
            Generate Designs Code
          </button>
        </div>
      )}

      {/* Generated code output */}
      {generatedCode && (
        <div className="bg-slate-dark rounded-lg p-6 border border-amber-400">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-white">Generated Code</h3>
            <button
              onClick={copyCode}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                copied
                  ? 'bg-green-500 text-white'
                  : 'bg-amber-400 text-charcoal hover:bg-amber-500'
              }`}
            >
              {copied ? 'Copied!' : 'Copy Code'}
            </button>
          </div>
          <p className="text-gray-400 text-sm mb-4">
            Copy this code and replace the corresponding section in{' '}
            <code className="text-amber-400">
              {activeTab === 'videos' ? 'src/pages/Videos.jsx' : 'src/pages/Design.jsx'}
            </code>
          </p>
          <pre className="bg-charcoal p-4 rounded-lg overflow-x-auto text-sm text-gray-300">
            <code>{generatedCode}</code>
          </pre>
        </div>
      )}
    </div>
  );
}
