import { ImageWithFallback } from './figma/ImageWithFallback';
import { Star } from 'lucide-react';
import type { BanquetSpace } from '../utils/api';

interface BanquetCardProps {
  space: BanquetSpace;
  imageUrl: string;
}

export function BanquetCard({ space, imageUrl }: BanquetCardProps) {
  return (
    <div className="bg-white overflow-hidden shadow-lg">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <ImageWithFallback 
          src={imageUrl}
          alt={space.name}
          className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
        />
      </div>

      {/* Content */}
      <div className="p-5 text-center">
        <h3 className="text-gray-900 mb-2">{space.name}</h3>
        <p className="text-gray-600 text-sm mb-2">{space.capacity}</p>
        <p className="text-gray-500 text-sm mb-3">{space.description}</p>
        
        {/* Rating */}
        <div className="flex gap-1 justify-center">
          {[...Array(space.rating)].map((_, i) => (
            <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
          ))}
        </div>
      </div>
    </div>
  );
}
