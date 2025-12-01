import { useEffect, useState } from 'react';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { Bed, Users, Wifi, ArrowRight } from 'lucide-react';
import { fetchRooms, type Room } from '../../utils/api';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';

// Import room images
import twoBedroomMain from 'figma:asset/34698d3956c98ba238415e83a94fe4015ef18c7a.png';
import studioMain from 'figma:asset/16b9c369160ee8579831901802a1d7a0eac56ac4.png';
import superiorMain from 'figma:asset/a9c6149e291b9bd9c958ebc649bf36eae12daa4c.png';
import deluxeMain from 'figma:asset/2c5532567f860a12f7a4d72eac8307cf5518949b.png';
import standardMain from 'figma:asset/0e0a73303f94fbcda4f792767963cdc15472a826.png';
import economyMain from 'figma:asset/a68cf997350d49c0c703169ad9b88ff5905b1cde.png';

export default function RoomsListPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  // Room images mapping
  const roomImages: { [key: number]: string } = {
    1: twoBedroomMain,
    2: studioMain,
    3: superiorMain,
    4: deluxeMain,
    5: standardMain,
    6: economyMain,
  };

  // Map room names to slugs
  const nameToSlug = (name: string): string => {
    return name.toLowerCase().replace(/\s+/g, '-');
  };

  useEffect(() => {
    const loadRooms = async () => {
      try {
        const data = await fetchRooms();
        setRooms(data.rooms);
      } catch (error) {
        console.error('Failed to load rooms:', error);
      } finally {
        setLoading(false);
      }
    };

    loadRooms();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5c2e3e] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading rooms...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <div className="relative h-[400px] flex items-center justify-center">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1626868449668-fb47a048d9cb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBob3RlbCUyMHJvb20lMjBiZWR8ZW58MXx8fHwxNzYxNjMxOTMyfDA&ixlib=rb-4.1.0&q=80&w=1080)',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/60"></div>
        </div>
        
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="mb-4">Our Rooms & Suites</h1>
          <p className="max-w-2xl mx-auto">
            Discover the perfect accommodation for your stay at VillaWatuna. From luxurious suites to comfortable budget rooms, we have something for everyone.
          </p>
        </div>
      </div>

      {/* Rooms Grid */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {rooms.map((room) => (
            <div
              key={room.id}
              className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
            >
              {/* Room Image */}
              <div className="relative h-64 overflow-hidden">
                <ImageWithFallback
                  src={roomImages[room.id]}
                  alt={room.name}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
              </div>

              {/* Room Content */}
              <div className="p-6">
                <h3 className="text-2xl mb-3 text-[#5c2e3e]">{room.name}</h3>
                <p className="text-gray-600 mb-4 line-clamp-2">{room.description}</p>

                {/* Room Info */}
                <div className="flex flex-wrap gap-4 mb-6 text-sm text-gray-600">
                  {room.size && (
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[#5c2e3e]/10 flex items-center justify-center">
                        <Bed size={16} className="text-[#5c2e3e]" />
                      </div>
                      <span>{room.size}</span>
                    </div>
                  )}
                  {room.guests && (
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[#5c2e3e]/10 flex items-center justify-center">
                        <Users size={16} className="text-[#5c2e3e]" />
                      </div>
                      <span>{room.guests}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#5c2e3e]/10 flex items-center justify-center">
                      <Wifi size={16} className="text-[#5c2e3e]" />
                    </div>
                    <span>Free WiFi</span>
                  </div>
                </div>

                {/* Key Amenities */}
                {room.keyAmenities && room.keyAmenities.length > 0 && (
                  <div className="mb-6">
                    <div className="flex flex-wrap gap-2">
                      {room.keyAmenities.slice(0, 3).map((amenity, index) => (
                        <span
                          key={index}
                          className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full"
                        >
                          {amenity}
                        </span>
                      ))}
                      {room.keyAmenities.length > 3 && (
                        <span className="text-xs text-gray-500 px-3 py-1">
                          +{room.keyAmenities.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* View Details Button */}
                <a
                  href={`/rooms/${nameToSlug(room.name)}`}
                  className="flex items-center justify-center gap-2 w-full bg-[#5c2e3e] text-white py-3 rounded-lg hover:bg-[#7d3d52] transition-colors group"
                >
                  <span>View Details</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}