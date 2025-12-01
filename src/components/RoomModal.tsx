import { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Bed, Users, Wifi, Coffee, Wind, Tv, Maximize2, ArrowRight } from 'lucide-react';
import Slider from 'react-slick';
import { ImageWithFallback } from './figma/ImageWithFallback';
import type { Room } from '../utils/api';

interface RoomModalProps {
  room: Room;
  allRooms: Room[];
  roomDetailImages: { [key: number]: string[] };
  isOpen: boolean;
  onClose: () => void;
  onRoomChange: (room: Room) => void;
}

function NextArrow(props: any) {
  const { onClick } = props;
  return (
    <button
      onClick={onClick}
      className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all"
    >
      <ChevronRight size={24} className="text-gray-800" />
    </button>
  );
}

function PrevArrow(props: any) {
  const { onClick } = props;
  return (
    <button
      onClick={onClick}
      className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all"
    >
      <ChevronLeft size={24} className="text-gray-800" />
    </button>
  );
}

export function RoomModal({ room, allRooms, roomDetailImages, isOpen, onClose, onRoomChange }: RoomModalProps) {
  const [current, setCurrent] = useState(0);
  const [sliderKey, setSliderKey] = useState(0);
  
  if (!isOpen) return null;

  const currentIndex = allRooms.findIndex(r => r.id === room.id);
  const nextIndex = (currentIndex + 1) % allRooms.length;
  const prevIndex = (currentIndex - 1 + allRooms.length) % allRooms.length;
  
  const nextRoom = allRooms[nextIndex];
  const prevRoom = allRooms[prevIndex];
  const imageUrls = roomDetailImages[room.id] || [];

  const handleClose = () => {
    setCurrent(0);
    onClose();
  };

  const handleRoomChange = (newRoom: Room) => {
    setCurrent(0);
    setSliderKey(prev => prev + 1);
    onRoomChange(newRoom);
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    swipeToSlide: true,
    autoplay: false,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    beforeChange: (_: number, next: number) => setCurrent(next),
    dotsClass: 'slick-dots custom-dots',
    customPaging: (i: number) => (
      <div 
        className={`w-3 h-3 rounded-full transition-all duration-300 ${
          current === i ? 'bg-white w-8' : 'bg-white/50'
        }`}
      ></div>
    )
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 p-4 overflow-y-auto">
      <div className="bg-white max-w-5xl w-full my-auto relative rounded-lg shadow-2xl">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-20 text-white hover:text-gray-300 transition-colors p-2"
        >
          <X size={32} strokeWidth={2.5} />
        </button>

        {/* Image Carousel */}
        <div className="relative bg-black rounded-t-lg overflow-hidden">
          <Slider key={sliderKey} {...settings}>
            {imageUrls.map((imageUrl, index) => (
              <div key={index} className="outline-none">
                <div className="relative h-[50vh] md:h-[55vh]">
                  <ImageWithFallback
                    src={imageUrl}
                    alt={`${room.name} - Image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            ))}
          </Slider>
        </div>

        {/* Room Details */}
        <div className="p-5 md:p-6">
          {/* Header with Room Navigation */}
          <div className="mb-5">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl text-gray-900">{room.name}</h2>
              {nextRoom && (
                <button
                  onClick={() => handleRoomChange(nextRoom)}
                  className="text-sm text-[#5c2e3e] hover:text-[#4a2531] flex items-center gap-1 transition-colors"
                >
                  <span className="underline">{nextRoom.name}</span>
                  <ChevronRight size={16} />
                </button>
              )}
            </div>
            <p className="text-gray-600 text-sm">{room.description}</p>
            
            {/* Size and Bedrooms Info */}
            {(room.size || room.bedrooms) && (
              <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-700">
                {room.size && (
                  <div className="flex items-center gap-1.5">
                    <Maximize2 size={16} className="text-gray-500" />
                    <span>{room.size}</span>
                  </div>
                )}
                {room.bedrooms && room.bedrooms.map((bedroom, index) => (
                  <div key={index} className="flex items-center gap-1.5">
                    <Bed size={16} className="text-gray-500" />
                    <span>{bedroom.name}: {bedroom.beds}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Compact Grid Layout */}
          <div className="grid md:grid-cols-3 gap-5 mb-5">
            {/* Accessories */}
            <div>
              <h3 className="text-xs uppercase tracking-wide text-gray-900 mb-2 flex items-center gap-1.5">
                <Bed size={14} className="text-gray-500" />
                Accessories
              </h3>
              <ul className="space-y-1">
                {room.accessories.map((accessory, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm text-gray-700">
                    <span className="w-1 h-1 rounded-full bg-gray-400 flex-shrink-0"></span>
                    <span>{accessory}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Facilities */}
            <div className="md:col-span-2">
              <h3 className="text-xs uppercase tracking-wide text-gray-900 mb-2 flex items-center gap-1.5">
                <Wifi size={14} className="text-gray-500" />
                Facilities
              </h3>
              <div className="grid md:grid-cols-2 gap-x-4">
                <ul className="space-y-1">
                  {room.facilities.slice(0, Math.ceil(room.facilities.length / 2)).map((facility, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm text-gray-700">
                      <span className="w-1 h-1 rounded-full bg-gray-400 flex-shrink-0"></span>
                      <span>{facility}</span>
                    </li>
                  ))}
                </ul>
                <ul className="space-y-1">
                  {room.facilities.slice(Math.ceil(room.facilities.length / 2)).map((facility, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm text-gray-700">
                      <span className="w-1 h-1 rounded-full bg-gray-400 flex-shrink-0"></span>
                      <span>{facility}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="border-t border-gray-200 pt-4">
            <a 
              href={`/rooms/${room.name.toLowerCase().replace(/ /g, '-')}`}
              className="flex items-center justify-center gap-2 w-full bg-[#5c2e3e] text-white py-3 rounded-lg hover:bg-[#7d3d52] transition-colors group"
            >
              <span>View Details</span>
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
