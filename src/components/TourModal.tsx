import { X, Clock, DollarSign, CheckCircle, TrendingUp } from 'lucide-react';

interface Tour {
  id: number;
  name: string;
  price: number;
  duration: string;
  description: string;
  highlights: string[];
  includes: string[];
  difficulty: string;
}

interface TourModalProps {
  tour: Tour | null;
  isOpen: boolean;
  onClose: () => void;
  image: string;
}

export function TourModal({ tour, isOpen, onClose, image }: TourModalProps) {
  if (!isOpen || !tour) return null;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
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
          <div className={`absolute top-4 left-4 px-4 py-2 rounded-full ${getDifficultyColor(tour.difficulty)}`}>
            <span className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              {tour.difficulty}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Title and Price */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="mb-2 text-[#5c2e3e]">{tour.name}</h2>
              <div className="flex items-center gap-2 text-gray-700">
                <Clock className="w-5 h-5" />
                <span>{tour.duration}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1">
                <DollarSign className="w-6 h-6 text-[#5c2e3e]" />
                <span className="text-amber-400">{tour.price}</span>
              </div>
              <span className="text-gray-600">per person</span>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="mb-3 text-[#5c2e3e]">Description</h3>
            <p className="text-gray-700 leading-relaxed">{tour.description}</p>
          </div>

          {/* Highlights */}
          <div className="mb-6">
            <h3 className="mb-3 text-[#5c2e3e]">Highlights</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {tour.highlights.map((highlight, index) => (
                <div key={index} className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{highlight}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Includes */}
          <div className="mb-6">
            <h3 className="mb-3 text-[#5c2e3e]">What's Included</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {tour.includes.map((item, index) => (
                <div key={index} className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-[#5c2e3e] flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </div>

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
