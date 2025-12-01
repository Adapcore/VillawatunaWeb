import { ImageWithFallback } from './figma/ImageWithFallback';
import { Calendar } from 'lucide-react';
import type { NewsItem } from '../utils/api';

interface NewsSectionProps {
  news: NewsItem[];
  galleryPreview: string[];
}

export function NewsSection({ news, galleryPreview }: NewsSectionProps) {
  return (
    <section className="py-16 bg-white" id="news">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl text-gray-900 mb-4">News & Event</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Stay updated with the latest happenings, special events, and exciting news from VillaWatuna Hotel.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Gallery Grid */}
            <div>
              <h3 className="text-gray-900 mb-4 uppercase text-sm">Photo Gallery</h3>
              <div className="grid grid-cols-3 gap-2">
                {galleryPreview.slice(0, 12).map((imageUrl, index) => (
                  <div key={index} className="aspect-square overflow-hidden">
                    <ImageWithFallback 
                      src={imageUrl}
                      alt={`Gallery preview ${index + 1}`}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-300 cursor-pointer"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Middle Column - Featured Post */}
            <div>
              <h3 className="text-gray-900 mb-4 uppercase text-sm">Latest Feature</h3>
              {news[0] && (
                <div className="bg-white shadow-lg">
                  <div className="relative h-48 overflow-hidden">
                    <ImageWithFallback 
                      src="https://images.unsplash.com/photo-1534612899740-55c821a90129?w=600"
                      alt={news[0].title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 text-sm">
                      Featured
                    </div>
                  </div>
                  <div className="p-5">
                    <h4 className="text-gray-900 mb-3">{news[0].title}</h4>
                    <p className="text-gray-600 text-sm mb-4">{news[0].excerpt}</p>
                    <button className="text-red-600 hover:text-red-700 text-sm">
                      Read More →
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Recent Posts */}
            <div>
              <h3 className="text-gray-900 mb-4 uppercase text-sm">Recent Posts</h3>
              <div className="space-y-4">
                {news.slice(1, 4).map((item) => (
                  <div key={item.id} className="flex gap-4 pb-4 border-b border-gray-200 last:border-0">
                    <div className="w-16 h-16 flex-shrink-0 overflow-hidden">
                      <ImageWithFallback 
                        src="https://images.unsplash.com/photo-1534612899740-55c821a90129?w=200"
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h5 className="text-gray-900 text-sm mb-1">{item.title}</h5>
                      <div className="flex items-center gap-2 text-gray-500 text-xs">
                        <Calendar size={12} />
                        <span>{new Date(item.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
