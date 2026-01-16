import { Link } from 'react-router-dom';
import { useSiteData } from '../data/siteData';

export default function Home() {
  const { siteSettings } = useSiteData();
  const hero = siteSettings?.hero || {};

  return (
    <div className="space-y-12 px-4">
      {/* Hero Section */}
      <section className="text-center py-12 sm:py-16 md:py-20">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
          {hero.greeting || "hi, i'm"} {hero.name || 'mabel'}
        </h1>
        <p className="text-lg sm:text-xl text-gray-300 mb-8 max-w-2xl mx-auto px-4">
          {hero.subtitle || '16. messing around and making videos about it'}
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            to="/portfolio/videos"
            className="bg-amber-400 text-charcoal px-6 py-2 rounded-lg font-medium hover:bg-amber-500 transition-colors"
          >
            my videos
          </Link>
        </div>
      </section>
    </div>
  );
}
