import { useState } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface GalleryImage {
  url: string;
  alt: string;
  category: string;
}

interface PhotoGalleryProps {
  images: GalleryImage[];
}

export function PhotoGallery({ images }: PhotoGalleryProps) {
  const [activeTab, setActiveTab] = useState<'rooms' | 'foods' | 'tours'>('rooms');

  const filteredImages = images.filter(img => img.category === activeTab);

  return (
    <section className="py-16 bg-gray-50" id="gallery">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl text-gray-900 mb-4">Photo Gallery</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our beautiful facilities and discover the elegance of VillaWatuna Hotel through our curated photo collection.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => setActiveTab('rooms')}
            className={`px-6 py-3 transition-all ${
              activeTab === 'rooms'
                ? 'bg-[#5c2e3e] text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Rooms
          </button>
          <button
            onClick={() => setActiveTab('foods')}
            className={`px-6 py-3 transition-all ${
              activeTab === 'foods'
                ? 'bg-[#5c2e3e] text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Foods
          </button>
          <button
            onClick={() => setActiveTab('tours')}
            className={`px-6 py-3 transition-all ${
              activeTab === 'tours'
                ? 'bg-[#5c2e3e] text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Tours
          </button>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
          {filteredImages.map((image, index) => (
            <div 
              key={index} 
              className="relative overflow-hidden aspect-square group cursor-pointer"
            >
              <ImageWithFallback 
                src={image.url}
                alt={image.alt}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
