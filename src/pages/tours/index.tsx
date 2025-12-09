import { useState, useEffect } from 'react';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { TourCard } from '../../components/TourCard';
import { TourModal } from '../../components/TourModal';
import { fetchToursDataFromUmbracoApi } from '../../services/tourService';

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
    const [pageHeader, setPageHeader] = useState<string>('');
    const [pageDescription, setPageDescription] = useState<string>('');
    const [pageSubHeader, setPageSubHeader] = useState<string>('');
    const [pageSubDescription, setPageSubDescription] = useState<string>('');
    const [bookingInformation, setBookingInformation] = useState<string>('');

    useEffect(() => {
        const loadTours = async () => {
            try {
                // Load tours from Umbraco API
                const toursPageData = await fetchToursDataFromUmbracoApi();

                console.log('Full Umbraco API response for tours:', toursPageData);

                // Set page header and description from API (empty if not available)
                setPageHeader(toursPageData.title || '');
                setPageDescription(toursPageData.description || '');
                setPageSubHeader(toursPageData.subTitle || '');
                setPageSubDescription(toursPageData.subDescription || '');
                setBookingInformation(toursPageData.bookingInformation || '');

                // Set tours from API only (empty array if not available)
                setTours(toursPageData.tours || []);
            } catch (error) {
                console.error('Error loading tours:', error);
                // Keep empty values on error
                setPageHeader('');
                setPageDescription('');
                setPageSubHeader('');
                setPageSubDescription('');
                setBookingInformation('');
                setTours([]);
            }
        };

        loadTours();
    }, []);


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
                    <h1 className="mb-4 header">{pageHeader}</h1>
                    <p className="max-w-2xl mx-auto description">
                        {pageDescription}
                    </p>
                </div>
            </div>

            {/* Tours Grid */}
            <div className="container mx-auto px-4 py-16">
                <div className="mb-12 text-center">
                    <h2 className="mb-4 text-[#5c2e3e]">{pageSubHeader}</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        {pageSubDescription}
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
                            image={tour.image || ''}
                            onClick={() => handleTourClick(tour)}
                        />
                    ))}
                </div>

                {/* Info Section */}
                {bookingInformation && (
                    <div className="mt-16 bg-white rounded-xl shadow-lg p-8 BookingInformation">
                        <div 
                            className="text-gray-700"
                            dangerouslySetInnerHTML={{ __html: bookingInformation }}
                        />
                    </div>
                )}
            </div>

            <Footer />

            {/* Tour Modal */}
            <TourModal
                tour={selectedTour}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                image={selectedTour?.image || ''}
            />
        </div>
    );
}
