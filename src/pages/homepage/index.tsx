import { useEffect, useState } from 'react';
import { Header } from '../../components/Header';
import { Hero } from '../../components/Hero';
import { TrustedPartners } from '../../components/TrustedPartners';
import { RoomCard } from '../../components/RoomCard';
import { RoomModal } from '../../components/RoomModal';
import { Facilities } from '../../components/Facilities';
import { PhotoGallery } from '../../components/PhotoGallery';
import { FAQ } from '../../components/FAQ';
import { GetInTouch } from '../../components/GetInTouch';
import { Footer } from '../../components/Footer';
import { 
  fetchRooms, 
  fetchGallery, 
  type Room,
  type GalleryImage
} from '../../utils/api';
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

export default function Homepage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [galleryImages, setGalleryImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Unsplash images for rooms
  const roomImages = [
    twoBedroomMain, // Two Bedroom Suite
    studioMain, // Studio Apartment
    superiorMain, // Superior Room
    deluxeMain, // Deluxe Room
    standardMain, // Standard Room
    economyMain, // Economy Room
  ];

  // Room detail images for modal carousel (4-6 images per room)
  const roomDetailImages: { [key: number]: string[] } = {
    1: [ // Two Bedroom Suite
      twoBedroomMain,
      twoBedroomKitchen,
      twoBedroomWide,
    ],
    2: [ // Studio Apartment
      studioMain,
      studioWindow,
      studioSeating,
    ],
    3: [ // Superior Room
      superiorMain,
      superiorGreen,
      superiorSeating,
    ],
    4: [ // Deluxe Room
      deluxeMain,
      deluxeOrange,
      deluxeWarm,
    ],
    5: [ // Standard Room
      standardMain,
    ],
    6: [ // Economy Room
      economyMain,
      economyBathroom,
      economyWoodCeiling,
      economyWhiteCeiling,
    ],
  };

  // Gallery images by category
  const galleryImagesByCategory = {
    rooms: [
      // Two Bedroom Suite
      twoBedroomMain,
      twoBedroomKitchen,
      twoBedroomWide,
      // Studio Apartment
      studioMain,
      studioWindow,
      studioSeating,
      // Superior Room
      superiorMain,
      superiorGreen,
      superiorSeating,
      // Deluxe Room
      deluxeMain,
      deluxeOrange,
      deluxeWarm,
      // Standard Room
      standardMain,
      // Economy Room
      economyMain,
      economyBathroom,
      economyWoodCeiling,
      economyWhiteCeiling,
    ],
    foods: [
      'https://images.unsplash.com/photo-1750943082020-4969b2a63084?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb3VybWV0JTIwZm9vZCUyMHBsYXRpbmd8ZW58MXx8fHwxNzYxMDgyMjIzfDA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1722477936580-84aa10762b0b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicmVha2Zhc3QlMjBidWZmZXQlMjBob3RlbHxlbnwxfHx8fDE3NjExNTI4MjR8MA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaW5lJTIwZGluaW5nJTIwcmVzdGF1cmFudHxlbnwxfHx8fDE3NjExMjY5MjR8MA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1711010344957-9d3e70e3cdad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFkaXRpb25hbCUyMGN1aXNpbmV8ZW58MXx8fHwxNzYxMTUyODI1fDA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1671741974888-21b409f4767c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2NrdGFpbCUyMGRyaW5rcyUyMGJhcnxlbnwxfHx8fDE3NjEwNTMyMjF8MA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1705831117065-e0cdd6ee2097?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaWduYXR1cmUlMjBkaXNofGVufDF8fHx8MTc2MTE1MjgyNnww&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1651608609954-8814d5282815?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNzZXJ0JTIwcGxhdHRlcnxlbnwxfHx8fDE3NjExNTI4MjZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1519351635902-7c60d09cb2ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZWFmb29kJTIwcGxhdHRlcnxlbnwxfHx8fDE3NjExMjQ4NDZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    ],
    tours: [
      'https://images.unsplash.com/photo-1704797390682-76479a29dc9a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYWxsZSUyMGZvcnQlMjBzcmklMjBsYW5rYXxlbnwxfHx8fDE3NjE2NzUwNjd8MA&ixlib=rb-4.1.0&q=80&w=1080', // Galle Fort Tour
      'https://images.unsplash.com/photo-1465103692162-a9bf9c7bd0fc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGFsZSUyMHdhdGNoaW5nJTIwb2NlYW58ZW58MXx8fHwxNzYxNjc1MDY3fDA&ixlib=rb-4.1.0&q=80&w=1080', // Whale Watching Adventure
      'https://images.unsplash.com/photo-1585171328560-947fbd92d6f0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWElMjBwbGFudGF0aW9uJTIwc3JpJTIwbGFua2F8ZW58MXx8fHwxNzYxNjc1MDY4fDA&ixlib=rb-4.1.0&q=80&w=1080', // Tea Plantation Experience
      'https://images.unsplash.com/photo-1666963341825-c93a87892e55?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYWZhcmklMjBsZW9wYXJkJTIwd2lsZGxpZmV8ZW58MXx8fHwxNzYxNjc1MDY4fDA&ixlib=rb-4.1.0&q=80&w=1080', // Yala Safari Experience
      'https://images.unsplash.com/photo-1705391490743-3ec7258ab548?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZWElMjB0dXJ0bGUlMjBiZWFjaHxlbnwxfHx8fDE3NjE2NzUwNjh8MA&ixlib=rb-4.1.0&q=80&w=1080', // Turtle Hatchery Visit
    ]
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const [roomsData, galleryData] = await Promise.all([
          fetchRooms(),
          fetchGallery()
        ]);

        setRooms(roomsData.rooms || []);
        
        // Map gallery data with actual image URLs
        const mappedGalleryImages: any[] = [];
        galleryData.images.forEach((item: GalleryImage) => {
          const category = item.category;
          const images = galleryImagesByCategory[category as keyof typeof galleryImagesByCategory];
          if (images && images.length > 0) {
            const imageIndex = mappedGalleryImages.filter(img => img.category === category).length;
            mappedGalleryImages.push({
              url: images[imageIndex % images.length],
              alt: item.alt,
              category: item.category
            });
          }
        });
        setGalleryImages(mappedGalleryImages);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <Hero />

      {/* Trusted Partners Section */}
      <div className="py-16">
        <TrustedPartners />
      </div>

      {/* Hotel Rooms Section */}
      <section className="pt-8 pb-16 bg-white" id="rooms">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl text-gray-900 mb-4">Our Hotel Rooms</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Choose from our selection of luxurious rooms and suites, each designed to provide the ultimate comfort and relaxation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {rooms.map((room, index) => (
              <RoomCard 
                key={room.id} 
                room={room} 
                imageUrl={roomImages[index % roomImages.length]}
                onClick={() => {
                  setSelectedRoom(room);
                  setIsModalOpen(true);
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Facilities Section */}
      <Facilities />

      {/* Photo Gallery */}
      <PhotoGallery images={galleryImages} />

      {/* FAQ Section */}
      <FAQ />

      {/* Get in Touch Section */}
      <GetInTouch />

      {/* Footer */}
      <Footer />

      {/* Room Modal */}
      {selectedRoom && (
        <RoomModal
          room={selectedRoom}
          allRooms={rooms}
          roomDetailImages={roomDetailImages}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedRoom(null);
          }}
          onRoomChange={(newRoom) => {
            setSelectedRoom(newRoom);
          }}
        />
      )}
    </div>
  );
}