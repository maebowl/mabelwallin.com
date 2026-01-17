import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [showCounter, setShowCounter] = useState(false);
  const resetTimer = useRef(null);
  const hideTimer = useRef(null);

  const isActive = (path) => {
    return location.pathname === path;
  };

  useEffect(() => {
    return () => {
      if (resetTimer.current) clearTimeout(resetTimer.current);
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, []);

  const handleHomeClick = (e) => {
    e.preventDefault();

    const newCount = clickCount + 1;
    setClickCount(newCount);
    setShowCounter(true);

    // Clear existing timers
    if (resetTimer.current) clearTimeout(resetTimer.current);
    if (hideTimer.current) clearTimeout(hideTimer.current);

    // Hide counter after 1 second
    hideTimer.current = setTimeout(() => setShowCounter(false), 1000);

    // Reset counter after 2 seconds of no clicks
    resetTimer.current = setTimeout(() => setClickCount(0), 2000);

    if (newCount >= 10) {
      setClickCount(0);
      setShowCounter(false);
      navigate('/admin');
    } else if (newCount === 1) {
      // Only navigate home on first click
      navigate('/portfolio');
    }
  };

  return (
    <nav className="bg-slate-dark shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <a href="/portfolio" onClick={handleHomeClick} className="flex items-center relative">
              <span className="text-xl sm:text-2xl font-bold text-amber-400">mabel wallin</span>
              {showCounter && clickCount > 0 && (
                <span
                  key={clickCount}
                  className="absolute -top-2 -right-7 text-sm font-bold font-mono"
                  style={{
                    color: clickCount >= 7 ? '#ef4444' : clickCount >= 4 ? '#fbbf24' : '#9ca3af',
                    textShadow: clickCount >= 7 ? '0 0 8px #ef4444' : 'none',
                    display: 'inline-block',
                    animation: 'counterPop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                  }}
                >
                  {clickCount}
                </span>
              )}
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/portfolio"
              className={`${
                isActive('/') || isActive('/portfolio')
                  ? 'text-amber-400 border-b-2 border-amber-400'
                  : 'text-gray-300 hover:text-amber-400'
              } px-3 py-2 text-sm font-medium transition-colors`}
            >
              Home
            </Link>
            <Link
              to="/portfolio/videos"
              className={`${
                isActive('/portfolio/videos')
                  ? 'text-amber-400 border-b-2 border-amber-400'
                  : 'text-gray-300 hover:text-amber-400'
              } px-3 py-2 text-sm font-medium transition-colors`}
            >
              Videos
            </Link>
            <Link
              to="/portfolio/designs"
              className={`${
                isActive('/portfolio/designs')
                  ? 'text-amber-400 border-b-2 border-amber-400'
                  : 'text-gray-300 hover:text-amber-400'
              } px-3 py-2 text-sm font-medium transition-colors`}
            >
              Designs
            </Link>
            <Link
              to="/contact"
              className={`${
                isActive('/contact')
                  ? 'text-amber-400 border-b-2 border-amber-400'
                  : 'text-gray-300 hover:text-amber-400'
              } px-3 py-2 text-sm font-medium transition-colors`}
            >
              Contact
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-amber-400 focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-4">
            <div className="flex flex-col space-y-2">
              <Link
                to="/portfolio"
                onClick={() => setIsOpen(false)}
                className={`${
                  isActive('/') || isActive('/portfolio')
                    ? 'text-amber-400 bg-charcoal-300'
                    : 'text-gray-300 hover:text-amber-400 hover:bg-charcoal-300'
                } px-3 py-2 text-sm font-medium transition-colors rounded`}
              >
                Home
              </Link>
              <Link
                to="/portfolio/videos"
                onClick={() => setIsOpen(false)}
                className={`${
                  isActive('/portfolio/videos')
                    ? 'text-amber-400 bg-charcoal-300'
                    : 'text-gray-300 hover:text-amber-400 hover:bg-charcoal-300'
                } px-3 py-2 text-sm font-medium transition-colors rounded`}
              >
                Videos
              </Link>
              <Link
                to="/portfolio/designs"
                onClick={() => setIsOpen(false)}
                className={`${
                  isActive('/portfolio/designs')
                    ? 'text-amber-400 bg-charcoal-300'
                    : 'text-gray-300 hover:text-amber-400 hover:bg-charcoal-300'
                } px-3 py-2 text-sm font-medium transition-colors rounded`}
              >
                Designs
              </Link>
              <Link
                to="/contact"
                onClick={() => setIsOpen(false)}
                className={`${
                  isActive('/contact')
                    ? 'text-amber-400 bg-charcoal-300'
                    : 'text-gray-300 hover:text-amber-400 hover:bg-charcoal-300'
                } px-3 py-2 text-sm font-medium transition-colors rounded`}
              >
                Contact
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
