import { useState } from 'react';
import { useSiteData } from '../data/siteData';

export default function Design() {
  const { designs, siteSettings } = useSiteData();
  const [selectedDesign, setSelectedDesign] = useState(null);

  return (
    <div className="space-y-8 px-4">
      <div className="text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">{siteSettings.designs.title}</h1>
        <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto px-4">
          {siteSettings.designs.intro}
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
              {design.category && (
                <span className="text-xs font-medium text-amber-400 bg-amber-400/20 px-2 py-1 rounded inline-block mb-2">
                  {design.category}
                </span>
              )}
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
                  {selectedDesign.category && (
                    <span className="text-sm font-medium text-amber-400 bg-amber-400/20 px-3 py-1 rounded">
                      {selectedDesign.category}
                    </span>
                  )}
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
