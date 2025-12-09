import { useEffect, useState } from 'react';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { Bed, Users, Maximize2, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { fetchRoomsDataFromUmbracoApi, type Room, type RoomCategory } from '../../services/roomService';
import Slider from 'react-slick';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';
import { roomsData } from '../../json/rooms';

// Import room images
import twoBedroomMain from 'figma:asset/34698d3956c98ba238415e83a94fe4015ef18c7a.png';
import twoBedroomKitchen from 'figma:asset/49eccebae28f9007ff58320a3472b4b336ffc4ab.png';
import twoBedroomWide from 'figma:asset/ef6ed11a325f1ab22eabfe63f38bc9dab8bf4002.png';
import studioMain from 'figma:asset/16b9c369160ee8579831901802a1d7a0eac56ac4.png';
import studioWindow from 'figma:asset/297d47366642d6365b5f218e287da879406c2fa2.png';
import studioSeating from 'figma:asset/97881c26c94a7d24acadbb0845edecffc9609f38.png';
import superiorMain from 'figma:asset/a9c6149e291b9bd9c958ebc649bf36eae12daa4c.png';
import superiorGreen from 'figma:asset/928bf20fa670700d404042714440482203865abc.png';
import superiorSeating from 'figma:asset/8e3b09ef16252b6b3fe1289884e25e685a57c379.png';
import deluxeMain from 'figma:asset/2c5532567f860a12f7a4d72eac8307cf5518949b.png';
import deluxeOrange from 'figma:asset/8fc558616a1b12ba94cd9f4e67c7e34d79fda673.png';
import deluxeWarm from 'figma:asset/69abc74ec21eb93adfb2cc2d76539e5f31151ff9.png';
import standardMain from 'figma:asset/0e0a73303f94fbcda4f792767963cdc15472a826.png';
import economyMain from 'figma:asset/a68cf997350d49c0c703169ad9b88ff5905b1cde.png';
import economyBathroom from 'figma:asset/f8276de381e0d52a36feafb17c5b3fa17cf48e22.png';
import economyWoodCeiling from 'figma:asset/1c392ca0c0b3e063da301c0dc82dcbf5c16023f0.png';
import economyWhiteCeiling from 'figma:asset/cb32c5a37fb6b8b8cb7be09532f77a5cc7813458.png';

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

interface RoomDetailPageProps {
  roomSlug: string;
}

export default function RoomDetailPage({ roomSlug }: RoomDetailPageProps) {
  const [room, setRoom] = useState<Room | null>(null);
  const [allRooms, setAllRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Room detail images
  const roomDetailImages: { [key: number]: string[] } = {
    1: [twoBedroomMain, twoBedroomKitchen, twoBedroomWide],
    2: [studioMain, studioWindow, studioSeating],
    3: [superiorMain, superiorGreen, superiorSeating],
    4: [deluxeMain, deluxeOrange, deluxeWarm],
    5: [standardMain],
    6: [economyMain, economyBathroom, economyWoodCeiling, economyWhiteCeiling],
  };

  // Map slugs to room names
  const slugToRoomName: { [key: string]: string } = {
    'two-bedroom-suite': 'Two Bedroom Suite',
    'studio-apartment': 'Studio Apartment',
    'superior-room': 'Superior Room',
    'deluxe-room': 'Deluxe Room',
    'standard-room': 'Standard Room',
    'economy-room': 'Economy Room',
  };

  // Static accessories mapping by room name
  const staticAccessoriesByRoomName: { [key: string]: string[] } = {};
  roomsData.rooms.forEach((staticRoom) => {
    staticAccessoriesByRoomName[staticRoom.name] = staticRoom.accessories || [];
  });

  useEffect(() => {
    const loadRooms = async () => {
      try {
        // Load rooms from Umbraco API
        const roomsPageData = await fetchRoomsDataFromUmbracoApi();
        
        console.log('Full Umbraco API response:', roomsPageData);
        console.log('Room categories:', roomsPageData.roomCategories);
        console.log('Rooms:', roomsPageData.rooms);
        
        // Convert roomCategories to Room objects for display
        // Merge category info with detailed room data from child room items
        const roomsFromCategories: Room[] = (roomsPageData.roomCategories || []).map((category, index) => {
          const roomData = category.roomData;
          
          // Only use API accessories: Category accessories first, then roomData accessories
          // Category accessories come from roomCategory.roomAccessories (API)
          const categoryAccessories = category.categoryAccessories || [];
          const roomDataAccessories = roomData?.accessories || [];
          
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
          
          // Only use API facilities: Category facilities first, then roomData facilities
          // Category facilities come from roomCategory.facilitiesAmenities (API)
          const categoryFacilities = category.categoryFacilities || [];
          const roomDataFacilities = roomData?.facilities || [];
          
          // Start with category facilities (from API), then add roomData facilities
          const apiFacilities = [...categoryFacilities];
          roomDataFacilities.forEach((roomFac) => {
            // Only add roomData facility if it's not already in category facilities
            const exists = categoryFacilities.some(
              (catFac) => catFac.toLowerCase().trim() === roomFac.toLowerCase().trim()
            );
            if (!exists) {
              apiFacilities.push(roomFac);
            }
          });
          
          // Only use API keyAmenities: Category keyAmenities first, then roomData keyAmenities
          // Category keyAmenities come from roomCategory.facilitiesAmenities where keyAmenity === true (API)
          const categoryKeyAmenities = category.categoryKeyAmenities || [];
          const roomDataKeyAmenities = roomData?.keyAmenities || [];
          
          // Start with category keyAmenities (from API), then add roomData keyAmenities
          const apiKeyAmenities = [...categoryKeyAmenities];
          roomDataKeyAmenities.forEach((roomKeyAmenity) => {
            // Only add roomData keyAmenity if it's not already in category keyAmenities
            const exists = categoryKeyAmenities.some(
              (catKeyAmenity) => catKeyAmenity.toLowerCase().trim() === roomKeyAmenity.toLowerCase().trim()
            );
            if (!exists) {
              apiKeyAmenities.push(roomKeyAmenity);
            }
          });
          
          // Only use API bedrooms: Category bedrooms first, then roomData bedrooms
          // Category bedrooms come from roomCategory.bedrooms (API)
          const categoryBedrooms = category.categoryBedrooms || [];
          // Handle case where roomData.bedrooms might be undefined or not an array
          const roomDataBedrooms = (roomData?.bedrooms && Array.isArray(roomData.bedrooms)) ? roomData.bedrooms : [];
          
          console.log(`Room "${category.title}" - categoryBedrooms from category:`, categoryBedrooms);
          console.log(`Room "${category.title}" - roomDataBedrooms from roomData:`, roomDataBedrooms);
          
          // Start with category bedrooms (from API), then add roomData bedrooms if not already present
          const apiBedrooms = [...categoryBedrooms];
          if (categoryBedrooms.length === 0 && roomDataBedrooms.length > 0) {
            // If no category bedrooms, use roomData bedrooms
            console.log(`Room "${category.title}" - Using roomData bedrooms (no category bedrooms)`);
            apiBedrooms.push(...roomDataBedrooms);
          } else if (categoryBedrooms.length > 0 && roomDataBedrooms.length > 0) {
            // If both exist, merge them (avoid duplicates by name)
            console.log(`Room "${category.title}" - Merging category and roomData bedrooms`);
            roomDataBedrooms.forEach((roomBedroom) => {
              const exists = categoryBedrooms.some(
                (catBedroom) => catBedroom.name.toLowerCase().trim() === roomBedroom.name.toLowerCase().trim()
              );
              if (!exists) {
                apiBedrooms.push(roomBedroom);
              }
            });
          } else if (categoryBedrooms.length > 0) {
            console.log(`Room "${category.title}" - Using category bedrooms only`);
          }
          
          console.log(`Room "${category.title}" - Category accessories:`, categoryAccessories);
          console.log(`Room "${category.title}" - RoomData accessories:`, roomDataAccessories);
          console.log(`Room "${category.title}" - Final API accessories:`, apiAccessories);
          console.log(`Room "${category.title}" - Category facilities:`, categoryFacilities);
          console.log(`Room "${category.title}" - RoomData facilities:`, roomDataFacilities);
          console.log(`Room "${category.title}" - Final API facilities:`, apiFacilities);
          console.log(`Room "${category.title}" - Category keyAmenities:`, categoryKeyAmenities);
          console.log(`Room "${category.title}" - RoomData keyAmenities:`, roomDataKeyAmenities);
          console.log(`Room "${category.title}" - Final API keyAmenities:`, apiKeyAmenities);
          console.log(`Room "${category.title}" - Category bedrooms:`, categoryBedrooms);
          console.log(`Room "${category.title}" - RoomData bedrooms:`, roomDataBedrooms);
          console.log(`Room "${category.title}" - Final API bedrooms:`, apiBedrooms);
          
          return {
            id: index + 1,
            name: category.title,
            price: roomData?.price || 0,
            image: category.mainImage || roomData?.image || '',
            rating: roomData?.rating || 5,
            description: category.description || roomData?.description || '',
            size: category.size || roomData?.size,
            guests: category.capacity || roomData?.guests,
            bedrooms: apiBedrooms.length > 0 ? apiBedrooms : undefined, // Use API bedrooms (category first, then roomData)
            keyAmenities: apiKeyAmenities, // Only API keyAmenities from facilitiesAmenities where keyAmenity === true
            images: roomData?.images?.length ? roomData.images : (category.mainImage ? [category.mainImage] : []),
            accessories: apiAccessories, // Only API accessories, no static
            facilities: apiFacilities, // Only API facilities, no static
            slug: roomData?.slug || category.title.toLowerCase().replace(/\s+/g, '-')
          };
        });
        
        // Combine with actual room items from API - prioritize actual room items as they have full data
        const allRoomsData = [...(roomsPageData.rooms || []), ...roomsFromCategories];
        
        console.log('Combined rooms data:', allRoomsData);
        console.log('Room items from API (with full data):', roomsPageData.rooms);
        setAllRooms(allRoomsData);
        
        // Find room by slug - prioritize actual room items from API first (they have complete data)
        // First, try to find in actual room items (which have full API data including accessories)
        let foundRoom = (roomsPageData.rooms || []).find((r: Room) => {
          const roomSlugNormalized = r.slug || r.name.toLowerCase().replace(/\s+/g, '-');
          console.log(`Comparing API room: "${roomSlugNormalized}" === "${roomSlug}"`);
          return roomSlugNormalized === roomSlug;
        });
        
        // If not found in API rooms, try in all rooms (including category-based)
        if (!foundRoom) {
          foundRoom = allRoomsData.find((r: Room) => {
            const roomSlugNormalized = r.slug || r.name.toLowerCase().replace(/\s+/g, '-');
            console.log(`Comparing all rooms: "${roomSlugNormalized}" === "${roomSlug}"`);
            return roomSlugNormalized === roomSlug;
          });
        }
        
        // Fallback: try matching by name using slugToRoomName mapping
        if (!foundRoom) {
          const roomName = slugToRoomName[roomSlug];
          console.log('Fallback: Looking for room name:', roomName);
          if (roomName) {
            // Try API rooms first
            foundRoom = (roomsPageData.rooms || []).find((r: Room) => r.name === roomName);
            // If not found, try all rooms
            if (!foundRoom) {
              foundRoom = allRoomsData.find((r: Room) => r.name === roomName);
            }
          }
        }
        
        console.log('Found room:', foundRoom);
        if (foundRoom) {
          console.log('Room accessories from API:', foundRoom.accessories);
          console.log('Room facilities from API:', foundRoom.facilities);
          console.log('Room keyAmenities from API:', foundRoom.keyAmenities);
          
          // Only use API accessories, no static accessories
          const apiAccessories = foundRoom.accessories || [];
          
          console.log('Final API accessories:', apiAccessories);
          
          // Update room with only API accessories
          const roomWithApiAccessories = {
            ...foundRoom,
            accessories: apiAccessories // Only API accessories
          };
          
          setRoom(roomWithApiAccessories);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error loading rooms:', error);
        setLoading(false);
      }
    };

    loadRooms();
  }, [roomSlug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5c2e3e] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading room details...</p>
        </div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-32 text-center">
          <h1 className="mb-4 text-[#5c2e3e]">Room Not Found</h1>
          <p className="text-gray-600 mb-8">The room you're looking for doesn't exist.</p>
          <a 
            href="/"
            className="inline-block bg-[#5c2e3e] text-white px-8 py-3 rounded-lg hover:bg-[#4a2530] transition-colors"
          >
            Return to Homepage
          </a>
        </div>
        <Footer />
      </div>
    );
  }

  // Use images from API first, fallback to hardcoded images
  const imageUrls = (room.images && room.images.length > 0) 
    ? room.images 
    : (roomDetailImages[room.id] || [room.image].filter(Boolean));

  const sliderSettings = {
    dots: true,
    infinite: imageUrls.length > 1,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: imageUrls.length > 1,
    autoplaySpeed: 4000,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    beforeChange: (_: number, next: number) => setCurrentSlide(next),
    dotsClass: 'slick-dots custom-dots',
    customPaging: (i: number) => (
      <div 
        className={`w-3 h-3 rounded-full transition-all duration-300 ${
          currentSlide === i ? 'bg-white w-8' : 'bg-white/50'
        }`}
      ></div>
    ),
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Image Carousel Section */}
      <div className="pt-24">
        <div className="relative bg-black">
          {imageUrls.length > 0 ? (
            <Slider {...sliderSettings}>
              {imageUrls.map((imageUrl, index) => (
                <div key={index}>
                  <div className="relative h-[60vh] md:h-[70vh]">
                    <ImageWithFallback
                      src={imageUrl}
                      alt={`${room.name} - Image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  </div>
                </div>
              ))}
            </Slider>
          ) : (
            <div className="relative h-[60vh] md:h-[70vh] bg-gray-800 flex items-center justify-center">
              <p className="text-white text-lg">No images available</p>
            </div>
          )}
        </div>
      </div>

      {/* Room Details Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl md:text-5xl mb-4 text-[#5c2e3e]">{room.name}</h1>
              <p className="text-gray-700 leading-relaxed">{room.description}</p>
            </div>

            {/* Quick Info */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8 p-6 bg-white rounded-lg shadow-md">
              {room.size && (
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#5c2e3e]/10 flex items-center justify-center">
                    <Maximize2 className="w-6 h-6 text-[#5c2e3e]" />
                  </div>
                  <div>
                    <p className="text-gray-600">Size</p>
                    <p className="text-gray-900">{room.size}</p>
                  </div>
                </div>
              )}
              
              {room.guests && (
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#5c2e3e]/10 flex items-center justify-center">
                    <Users className="w-6 h-6 text-[#5c2e3e]" />
                  </div>
                  <div>
                    <p className="text-gray-600">Capacity</p>
                    <p className="text-gray-900">{room.guests}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#5c2e3e]/10 flex items-center justify-center">
                  <Bed className="w-6 h-6 text-[#5c2e3e]" />
                </div>
                <div>
                  <p className="text-gray-600">Bedrooms</p>
                  <p className="text-gray-900">
                    {room.bedrooms && Array.isArray(room.bedrooms) && room.bedrooms.length > 0 
                      ? room.bedrooms.length 
                      : 0}
                  </p>
                </div>
              </div>
            </div>

            {/* Bedroom Details */}
            {room.bedrooms && room.bedrooms.length > 0 && (
              <div className="mb-8">
                <h3 className="mb-4 text-[#5c2e3e]">Bedroom Configuration</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {room.bedrooms.map((bedroom, index) => (
                    <div key={index} className="p-4 bg-white rounded-lg shadow-md border-l-4 border-[#5c2e3e]">
                      <p className="text-gray-900 mb-1">{bedroom.name}</p>
                      <p className="text-gray-600">{bedroom.beds}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Accessories - Only show if API has accessories */}
            {room.accessories && Array.isArray(room.accessories) && room.accessories.length > 0 && (
              <div className="mb-8">
                <h3 className="mb-4 text-[#5c2e3e]">Room Accessories</h3>
                <div className="grid md:grid-cols-2 gap-3">
                  {room.accessories.map((accessory, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm">
                      <CheckCircle className="w-5 h-5 text-teal-600 flex-shrink-0" />
                      <span className="text-gray-700">{accessory}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Facilities & Amenities - Only show if API has facilities */}
            {room.facilities && Array.isArray(room.facilities) && room.facilities.length > 0 && (
              <div className="mb-8">
                <h3 className="mb-4 text-[#5c2e3e]">Facilities & Amenities</h3>
                <div className="grid md:grid-cols-2 gap-3">
                  {room.facilities.map((facility, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm">
                      <CheckCircle className="w-5 h-5 text-[#5c2e3e] flex-shrink-0" />
                      <span className="text-gray-700">{facility}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Key Amenities - Only show if API has keyAmenities (from facilitiesAmenities where keyAmenity === true) */}
            {room.keyAmenities && Array.isArray(room.keyAmenities) && room.keyAmenities.length > 0 && (
              <div className="mb-8">
                <h3 className="mb-4 text-[#5c2e3e]">Key Amenities</h3>
                <div className="flex flex-wrap gap-3">
                  {room.keyAmenities.map((amenity, index) => (
                    <div key={index} className="px-4 py-2 bg-[#5c2e3e] text-white rounded-full">
                      {amenity}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 bg-white rounded-xl shadow-lg p-6 border-2 border-gray-200">
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-gray-700 mb-2">Check-in</label>
                  <input 
                    type="date" 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#5c2e3e]"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2">Check-out</label>
                  <input 
                    type="date" 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#5c2e3e]"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Guests</label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#5c2e3e]">
                    <option>1 Guest</option>
                    <option>2 Guests</option>
                    <option>3 Guests</option>
                    <option>4 Guests</option>
                  </select>
                </div>
              </div>

              <button className="w-full bg-[#5c2e3e] text-white py-3 rounded-lg hover:bg-[#4a2530] transition-colors mb-4">
                Book Now
              </button>

              <a 
                href="/#contact"
                className="block w-full text-center border-2 border-[#5c2e3e] text-[#5c2e3e] py-3 rounded-lg hover:bg-[#5c2e3e] hover:text-white transition-colors"
              >
                Contact Us
              </a>

              <div className="mt-6 pt-6 border-t border-gray-200 text-center text-gray-600">
                <p className="mb-2">Need help?</p>
                <p className="text-[#5c2e3e]">+94 77 695 5500</p>
              </div>
            </div>
          </div>
        </div>

        {/* Other Rooms Section */}
        <div className="mt-16 pt-16 border-t border-gray-300">
          <h2 className="mb-8 text-center text-[#5c2e3e]">Explore Other Rooms</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {allRooms.filter(r => r.id !== room.id).slice(0, 3).map((otherRoom) => {
              // Use slug from API, or generate from name as fallback
              const slug = otherRoom.slug || otherRoom.name.toLowerCase().replace(/\s+/g, '-');
              // Use images from API, fallback to hardcoded images
              const otherRoomImage = (otherRoom.images && otherRoom.images.length > 0) 
                ? otherRoom.images[0] 
                : (roomDetailImages[otherRoom.id]?.[0] || otherRoom.image || '');
              
              return (
                <a 
                  key={otherRoom.id}
                  href={`/rooms/${slug}`}
                  className="group block bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <div className="relative h-48">
                    <ImageWithFallback
                      src={otherRoomImage}
                      alt={otherRoom.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="mb-2 text-[#5c2e3e]">{otherRoom.name}</h3>
                    <p className="text-gray-600 mb-3 line-clamp-2">{otherRoom.description}</p>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}