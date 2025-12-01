import { useState, useEffect } from 'react';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { TourCard } from '../../components/TourCard';
import { TourModal } from '../../components/TourModal';
import { toursData } from '../../json/tours';

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

export default function ToursPage() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Simulate API call
    setTours(toursData.tours);
  }, []);

  const tourImages = [
    'https://images.unsplash.com/photo-1704797390682-76479a29dc9a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYWxsZSUyMGZvcnQlMjBzcmklMjBsYW5rYXxlbnwxfHx8fDE3NjE2NzUwNjd8MA&ixlib=rb-4.1.0&q=80&w=1080',
    'https://images.unsplash.com/photo-1465103692162-a9bf9c7bd0fc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGFsZSUyMHdhdGNoaW5nJTIwb2NlYW58ZW58MXx8fHwxNzYxNjc1MDY3fDA&ixlib=rb-4.1.0&q=80&w=1080',
    'https://images.unsplash.com/photo-1585171328560-947fbd92d6f0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWElMjBwbGFudGF0aW9uJTIwc3JpJTIwbGFua2F8ZW58MXx8fHwxNzYxNjc1MDY4fDA&ixlib=rb-4.1.0&q=80&w=1080',
    'https://images.unsplash.com/photo-1666963341825-c93a87892e55?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYWZhcmklMjBsZW9wYXJkJTIwd2lsZGxpZmV8ZW58MXx8fHwxNzYxNjc1MDY4fDA&ixlib=rb-4.1.0&q=80&w=1080',
    'https://images.unsplash.com/photo-1705391490743-3ec7258ab548?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZWElMjB0dXJ0bGUlMjBiZWFjaHxlbnwxfHx8fDE3NjE2NzUwNjh8MA&ixlib=rb-4.1.0&q=80&w=1080',
  ];

  const handleTourClick = (tour: Tour) => {
    setSelectedTour(tour);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <div className="relative h-[400px] flex items-center justify-center">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1488646953014-85cb44e25828?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080)',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/60"></div>
        </div>
        
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="mb-4">Tours & Excursions</h1>
          <p className="max-w-2xl mx-auto">
            Discover the beauty and culture of Sri Lanka with our carefully curated tour experiences
          </p>
        </div>
      </div>

      {/* Tours Grid */}
      <div className="container mx-auto px-4 py-16">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-[#5c2e3e]">Available Tours</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Choose from our selection of exciting tours and adventures designed to showcase the best of Sri Lanka's natural beauty, wildlife, and cultural heritage
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tours.map((tour, index) => (
            <TourCard
              key={tour.id}
              name={tour.name}
              price={tour.price}
              duration={tour.duration}
              description={tour.description}
              difficulty={tour.difficulty}
              image={tourImages[index]}
              onClick={() => handleTourClick(tour)}
            />
          ))}
        </div>

        {/* Info Section */}
        <div className="mt-16 bg-white rounded-xl shadow-lg p-8">
          <h3 className="mb-4 text-[#5c2e3e]">Booking Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700">
            <div>
              <h4 className="mb-2 text-[#5c2e3e]">How to Book</h4>
              <ul className="list-disc list-inside space-y-2">
                <li>Select your desired tour and click "View Details"</li>
                <li>Choose your preferred date and number of participants</li>
                <li>Complete the booking form with your information</li>
                <li>Receive confirmation via email within 24 hours</li>
              </ul>
            </div>
            <div>
              <h4 className="mb-2 text-[#5c2e3e]">Important Notes</h4>
              <ul className="list-disc list-inside space-y-2">
                <li>Tours are subject to weather conditions</li>
                <li>Hotel guests receive a 10% discount on all tours</li>
                <li>Cancellations must be made 48 hours in advance</li>
                <li>Private tours available upon request</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <Footer />

      {/* Tour Modal */}
      <TourModal
        tour={selectedTour}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        image={selectedTour ? tourImages[selectedTour.id - 1] : ''}
      />
    </div>
  );
}
