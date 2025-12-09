import { useEffect, useState } from 'react';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { Bed, Users, Wifi, ArrowRight } from 'lucide-react';
import { fetchRooms, type Room } from '../../utils/api';
import { fetchRoomsDataFromUmbracoApi, type RoomCategory } from '../../services/roomService';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';

export default function RoomsListPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [pageTitle, setPageTitle] = useState<string>('Our Rooms & Suites');
  const [pageDescription, setPageDescription] = useState<string>('');
  const [roomCategories, setRoomCategories] = useState<RoomCategory[]>([]);
  const [loading, setLoading] = useState(true);

  // Map room names to slugs
  const nameToSlug = (name: string): string => {
    return name.toLowerCase().replace(/\s+/g, '-');
  };

  useEffect(() => {
    const loadRooms = async () => {
      try {
        // Load static rooms data
        const data = await fetchRooms();
        console.log('Loaded static rooms:', data.rooms);
        
        // Load page title, description, and room categories from Umbraco API
        try {
          const roomsPageData = await fetchRoomsDataFromUmbracoApi();
          console.log('Full Umbraco API response:', roomsPageData);
          
          if (roomsPageData.title) {
            setPageTitle(roomsPageData.title);
          }
          if (roomsPageData.description) {
            setPageDescription(roomsPageData.description);
          }
          
          // Store room categories for display
          if (roomsPageData.roomCategories && roomsPageData.roomCategories.length > 0) {
            setRoomCategories(roomsPageData.roomCategories);
            
            // Map room categories to rooms by index (assuming same order as static rooms)
            console.log('Room categories from API:', roomsPageData.roomCategories);
            console.log('Room categories length:', roomsPageData.roomCategories.length);
            console.log('Static rooms count:', data.rooms.length);
            
            // Update room names with category titles
            const updatedRooms = data.rooms.map((room, index) => {
              const category = roomsPageData.roomCategories?.[index];
              console.log(`Room ${index} (ID: ${room.id}, Name: "${room.name}") -> Category:`, category);
              
              if (category && category.title) {
                console.log(`✓ Updating room ${room.id} name from "${room.name}" to "${category.title}"`);
                return { ...room, name: category.title };
              } else {
                console.log(`✗ No category found for room ${index}, keeping original name: "${room.name}"`);
              }
              return room;
            });
            
            console.log('=== ROOM NAME UPDATE SUMMARY ===');
            console.log('Original room names:', data.rooms.map((r, i) => `${i}: ${r.name}`));
            console.log('Updated room names:', updatedRooms.map((r, i) => `${i}: ${r.name}`));
            console.log('===============================');
            
            setRooms(updatedRooms);
          } else {
            console.warn('No room categories found in API response, using static room names');
            // No categories found, use static rooms as-is
            setRooms(data.rooms);
          }
        } catch (umbracoError) {
          console.error('Failed to load page data from Umbraco:', umbracoError);
          console.error('Error details:', umbracoError);
          // Keep default values if Umbraco API fails
          setRooms(data.rooms);
        }
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
          <h1 className="mb-4">{pageTitle}</h1>
          <p className="max-w-2xl mx-auto">
            {pageDescription}
          </p>
        </div>
      </div>

      {/* Rooms Grid */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Display room categories using the same template */}
          {roomCategories.length > 0 ? (
            roomCategories.map((category, index) => {
              // Find corresponding room data by index, or use fallback
              const room = rooms[index] || {
                id: index + 1,
                name: category.title,
                price: 0,
                image: '',
                rating: 5,
                description: '',
                images: [],
                accessories: [],
                facilities: [],
                keyAmenities: []
              };
              
              // Get accessories from API: Category accessories first, then roomData accessories
              const categoryAccessories = category.categoryAccessories || [];
              const roomDataAccessories = category.roomData?.accessories || [];
              
              // Start with category accessories (from API), then add roomData accessories
              const apiAccessories = [...categoryAccessories];
              roomDataAccessories.forEach((roomAcc) => {
                // Only add roomData accessory if it's not already in category accessories
                const exists = categoryAccessories.some(
                  (catAcc) => catAcc.toLowerCase().trim() === roomAcc.toLowerCase().trim()
                );
                if (!exists) {
                  apiAccessories.push(roomAcc);
                }
              });
              
              // Get top 3 accessories
              const top3Accessories = apiAccessories.slice(0, 3);
              
              return (
                <div
                  key={category.id || index}
                  className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                >
                  {/* Room Image */}
                  <div className="relative h-64 overflow-hidden">
                    <ImageWithFallback
                      src={category.mainImage || ''}
                      alt={category.title}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    />
                  </div>

                  {/* Room Content */}
                  <div className="p-6">
                    <h3 className="text-2xl mb-3 text-[#5c2e3e]">{category.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-2">{category.description || ''}</p>

                {/* Room Info */}
                <div className="flex flex-wrap gap-4 mb-6 text-sm text-gray-600">
                  {(category.size && String(category.size).trim() !== '') && (
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[#5c2e3e]/10 flex items-center justify-center">
                        <Bed size={16} className="text-[#5c2e3e]" />
                      </div>
                      <span>{String(category.size)}</span>
                    </div>
                  )}
                  {(category.capacity && String(category.capacity).trim() !== '') && (
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[#5c2e3e]/10 flex items-center justify-center">
                        <Users size={16} className="text-[#5c2e3e]" />
                      </div>
                      <span>{String(category.capacity)}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#5c2e3e]/10 flex items-center justify-center">
                      <Wifi size={16} className="text-[#5c2e3e]" />
                    </div>
                    <span>Free WiFi</span>
                  </div>
                </div>

                    {/* Room Accessories - Top 3 from API */}
                    {top3Accessories.length > 0 && (
                      <div className="mb-6 Accessories">
                        <div className="flex flex-wrap gap-2">
                          {top3Accessories.map((accessory, accessoryIndex) => (
                            <span
                              key={accessoryIndex}
                              className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full"
                            >
                              {accessory}
                            </span>
                          ))}
                          {apiAccessories.length > 3 && (
                            <span className="text-xs text-gray-500 px-3 py-1">
                              +{apiAccessories.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* View Details Button */}
                    <a
                      href={`/rooms/${nameToSlug(category.title)}`}
                      className="flex items-center justify-center gap-2 w-full bg-[#5c2e3e] text-white py-3 rounded-lg hover:bg-[#7d3d52] transition-colors group"
                    >
                      <span>View Details</span>
                      <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </a>
                  </div>
                </div>
              );
            })
          ) : (
            // Fallback to static rooms if no categories
            rooms.map((room) => (
              <div
                key={room.id}
                className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              >
                      {/* Room Image */}
                      <div className="relative h-64 overflow-hidden">
                        <ImageWithFallback
                          src={room.image || ''}
                          alt={room.name}
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                        />
                      </div>

                {/* Room Content */}
                <div className="p-6">
                  <h3 className="text-2xl mb-3 text-[#5c2e3e]">{room.name}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2"></p>

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
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[#5c2e3e]/10 flex items-center justify-center">
                        <Wifi size={16} className="text-[#5c2e3e]" />
                      </div>
                      <span>Free WiFi</span>
                    </div>
                  </div>

                  {/* Room Accessories - Top 3 from API */}
                  {room.accessories && Array.isArray(room.accessories) && room.accessories.length > 0 && (
                    <div className="mb-6 Accessories">
                      <div className="flex flex-wrap gap-2">
                        {room.accessories.slice(0, 3).map((accessory, index) => (
                          <span
                            key={index}
                            className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full"
                          >
                            {accessory}
                          </span>
                        ))}
                        {room.accessories.length > 3 && (
                          <span className="text-xs text-gray-500 px-3 py-1">
                            +{room.accessories.length - 3} more
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
            ))
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}