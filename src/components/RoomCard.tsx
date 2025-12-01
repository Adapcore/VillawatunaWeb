import { ImageWithFallback } from './figma/ImageWithFallback';
import { Image, Home, Users, Wifi, Tv, Coffee, Bath, ChefHat } from 'lucide-react';
import type { Room } from '../utils/api';

interface RoomCardProps {
  room: Room;
  imageUrl: string;
  onClick: () => void;
}

// Helper function to get icon for amenity
const getAmenityIcon = (amenity: string) => {
  const amenityLower = amenity.toLowerCase();
  if (amenityLower.includes('wifi')) return Wifi;
  if (amenityLower.includes('tv')) return Tv;
  if (amenityLower.includes('coffee')) return Coffee;
  if (amenityLower.includes('kitchen')) return ChefHat;
  if (amenityLower.includes('bathroom') || amenityLower.includes('bath')) return Bath;
  return Wifi; // default
};

export function RoomCard({ room, imageUrl, onClick }: RoomCardProps) {
  return (
    <div 
      onClick={onClick}
      className="bg-white overflow-hidden shadow-lg group cursor-pointer hover:shadow-xl transition-shadow"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <ImageWithFallback 
          src={imageUrl}
          alt={room.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        {/* Image Count Badge */}
        <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 flex items-center gap-2">
          <Image size={16} />
          <span className="text-sm">{room.images.length}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-gray-900 mb-2">{room.name}</h3>
        <p className="text-gray-600 text-sm mb-4">{room.description}</p>
        
        {/* Size and Guests */}
        <div className="flex items-center gap-4 mb-4 text-sm text-gray-700">
          {room.size && (
            <div className="flex items-center gap-1.5">
              <Home size={16} className="text-gray-500" />
              <span>{room.size}</span>
            </div>
          )}
          {room.guests && (
            <div className="flex items-center gap-1.5">
              <Users size={16} className="text-gray-500" />
              <span>{room.guests}</span>
            </div>
          )}
        </div>

        {/* Key Amenities Grid */}
        {room.keyAmenities && room.keyAmenities.length > 0 && (
          <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
            {room.keyAmenities.map((amenity, index) => {
              const Icon = getAmenityIcon(amenity);
              return (
                <div key={index} className="flex items-center gap-1.5">
                  <Icon size={16} className="text-gray-500 flex-shrink-0" />
                  <span className="truncate">{amenity}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
