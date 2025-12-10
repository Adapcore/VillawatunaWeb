import { X, Clock, DollarSign, CheckCircle, TrendingUp } from 'lucide-react';

interface Tour {
  id: number;
  name: string;
  price: number;
  priceTitle?: string;
  duration: string;
  description: string;
  highlights: string[];
  includes: string[];
  whatsIncluded: string[];
  difficultyLevel?: string;
  image?: string;
  subTitle?: string;
  subDescription?: string;
  slug?: string;
}

interface TourModalProps {
  tour: Tour | null;
  isOpen: boolean;
  onClose: () => void;
  image: string;
}

export function TourModal({ tour, isOpen, onClose, image }: TourModalProps) {
  console.log('TourModal render - isOpen:', isOpen, 'tour:', tour);
  
  if (!isOpen) {
    console.log('TourModal not rendering - isOpen is false');
    return null;
  }
  
  if (!tour) {
    console.log('TourModal not rendering - tour is null/undefined');
    return null;
  }
  
  // Validate required tour properties - be more lenient
  // Only reject if name is completely missing (null/undefined), allow empty strings
  if (tour.name === null || tour.name === undefined) {
    console.error('TourModal - Tour missing name property (null/undefined):', tour);
    return null;
  }
  
  // Ensure arrays exist
  const highlights = Array.isArray(tour.highlights) ? tour.highlights : [];
  const includes = Array.isArray(tour.includes) ? tour.includes : [];
  const whatsIncluded = Array.isArray(tour.whatsIncluded) ? tour.whatsIncluded : [];
  
  // Log tour data for debugging
  console.log('TourModal - Tour data:', {
    id: tour.id,
    name: tour.name,
    hasDescription: !!tour.description,
    highlightsCount: highlights.length,
    includesCount: includes.length
  });

  const getDifficultyColor = (level: string) => {
    const normalizedLevel = (level || '').toLowerCase().trim();
    switch (normalizedLevel) {
      case 'easy':
        return 'bg-green-100 text-green-800';
      case 'moderate':
        return 'bg-yellow-100 text-yellow-800';
      case 'hard':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Use difficultyLevel from API
  const displayDifficulty = tour.difficultyLevel || '';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70" onClick={onClose}>
      <div 
        className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Image */}
        <div className="relative h-80">
          <img 
            src={image} 
            alt={tour.name}
            className="w-full h-full object-cover rounded-t-xl"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white rounded-full p-2 hover:bg-gray-100 transition-colors"
          >
            <X className="w-6 h-6 text-gray-800" />
          </button>
          {/* Only show difficulty badge if we have a value */}
          {displayDifficulty && displayDifficulty.trim() !== '' && (
            <div className={`absolute top-4 left-4 px-4 py-2 rounded-full ${getDifficultyColor(displayDifficulty)}`}>
              <span className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                {displayDifficulty}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Title and Price */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="mb-2 text-[#5c2e3e]">{tour.name}</h2>
              {tour.duration && (
                <div className="flex items-center gap-2 text-gray-700">
                  <Clock className="w-5 h-5" />
                  <span>{tour.duration}</span>
                </div>
              )}
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1">
                <DollarSign className="w-6 h-6 text-[#5c2e3e]" />
                <span className="text-amber-400">{tour.price || 0}</span>
                {tour.priceTitle && <span className="text-gray-600">/{tour.priceTitle}</span>}
              </div>
            </div>
          </div>

          {/* Description */}
          {tour.description && typeof tour.description === 'string' && tour.description.trim() !== '' && (
            <div className="mb-6">
              <h3 className="mb-3 text-[#5c2e3e]">Description</h3>
              <div 
                className="text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: tour.description }}
              />
            </div>
          )}

          {/* Highlights */}
          {highlights.length > 0 && (
            <div className="mb-6">
              <h3 className="mb-3 text-[#5c2e3e]">Highlights</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {highlights.map((highlight, index) => {
                  // Ensure highlight is a string
                  const highlightText = typeof highlight === 'string' ? highlight : String(highlight || '');
                  if (!highlightText) return null;
                  return (
                    <div key={index} className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{highlightText}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Includes */}
          {includes.length > 0 && (
            <div className="mb-6">
              <h3 className="mb-3 text-[#5c2e3e]">What's Included</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {includes.map((item, index) => {
                  // Ensure item is a string
                  const itemText = typeof item === 'string' ? item : String(item || '');
                  if (!itemText) return null;
                  return (
                    <div key={index} className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-[#5c2e3e] flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{itemText}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* What's Included (from whatsIncluded property) */}
          {whatsIncluded.length > 0 && (
            <div className="mb-6">
              <h3 className="mb-3 text-[#5c2e3e]">What's Included</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {whatsIncluded.map((item, index) => {
                  // Ensure item is a string
                  const itemText = typeof item === 'string' ? item : String(item || '');
                  if (!itemText) return null;
                  return (
                    <div key={index} className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-[#5c2e3e] flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{itemText}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Book Now Button */}
          <div className="flex gap-4">
            <button className="flex-1 bg-[#5c2e3e] text-white py-3 rounded-lg hover:bg-[#4a2530] transition-colors">
              Book Now
            </button>
            <button 
              onClick={onClose}
              className="px-6 border-2 border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
