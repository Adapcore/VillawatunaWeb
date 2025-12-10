import { Clock, DollarSign, TrendingUp } from 'lucide-react';

interface TourCardProps {
  name: string;
  price: number;
  priceTitle?: string;
  duration: string;
  description: string;
  difficultyLevel?: string;
  image: string;
  onClick: () => void;
}

export function TourCard({ name, price, priceTitle, duration, description, difficultyLevel, image, onClick }: TourCardProps) {
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
  const displayDifficulty = difficultyLevel || '';

  return (
    <div 
      className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer transition-transform hover:scale-[1.02] hover:shadow-xl"
      onClick={onClick}
    >
      <div className="relative h-64">
        <img 
          src={image} 
          alt={name}
          className="w-full h-full object-cover"
        />
        {/* Only show difficulty badge if we have a value */}
        {displayDifficulty && displayDifficulty.trim() !== '' && (
          <div className={`absolute top-4 right-4 px-3 py-1 rounded-full ${getDifficultyColor(displayDifficulty)}`}>
            <span className="flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              {displayDifficulty}
            </span>
          </div>
        )}
      </div>
      
      <div className="p-6">
        <h3 className="mb-2 text-[#5c2e3e]">{name}</h3>
        
        <p className="text-gray-600 mb-4 line-clamp-2">{description}</p>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-gray-700">
            <Clock className="w-4 h-4" />
            <span>{duration}</span>
          </div>
          
          <div className="flex items-center gap-1 text-[#5c2e3e]">
            <DollarSign className="w-5 h-5" />
            <span className="text-amber-400">{price}</span>
            {priceTitle && <span className="text-gray-600">/{priceTitle}</span>}
          </div>
        </div>
        
        <button 
          className="w-full bg-[#5c2e3e] text-white py-2 rounded-lg hover:bg-[#4a2530] transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
        >
          View Details
        </button>
      </div>
    </div>
  );
}
