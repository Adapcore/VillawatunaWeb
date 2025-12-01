import { Star } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import anexLogo from 'figma:asset/2e7e7eb62c102736d71abd8cc9de81a33cc9d9f5.png';
import aitkenSpenceLogo from 'figma:asset/b8f3d275b27e08bac821ca085bae408984bffd30.png';
import exoticHolidaysLogo from 'figma:asset/4f6338337476dfe8813976f4c632d7d4eed91d83.png';
import ceylonMyDreamLogo from 'figma:asset/68d9ff7dedeb48e2d43a923a46baec7ef81977ad.png';

interface Partner {
  name: string;
  logo: string;
  logoImage?: string;
  rating: number;
  maxRating: number;
  review: string;
  stars: number;
}

export function TrustedPartners() {
  const partners: Partner[] = [
    {
      name: 'Booking.com',
      logo: 'Booking.com',
      logoImage: 'https://append-cloak-93204404.figma.site/_assets/v11/54b4bca20e9ce88312d4e15aaf808cb6857c3668.png',
      rating: 9.1,
      maxRating: 10,
      review: 'Superb',
      stars: 4
    },
    {
      name: 'Agoda',
      logo: 'agoda',
      logoImage: 'https://cdn6.agoda.net/images/kite-js/logo/agoda/color-default.svg',
      rating: 8.4,
      maxRating: 10,
      review: 'Excellent',
      stars: 4
    },
    {
      name: 'Google',
      logo: 'Google',
      rating: 4.1,
      maxRating: 5,
      review: '',
      stars: 4
    },
    {
      name: 'FunSun',
      logo: 'FUN SUN',
      logoImage: 'https://static.funsuntravel.com/assets/WhitelableLogo/1/2/logo.svg?v1',
      rating: 0,
      maxRating: 0,
      review: '',
      stars: 0
    },
    {
      name: 'Anex',
      logo: 'anex',
      logoImage: anexLogo,
      rating: 0,
      maxRating: 0,
      review: '',
      stars: 0
    },
    {
      name: 'Tripadvisor',
      logo: 'Tripadvisor',
      logoImage: 'https://static.tacdn.com/img2/brand_refresh_2025/logos/wordmark.svg',
      rating: 4.4,
      maxRating: 5,
      review: '',
      stars: 4
    },
    {
      name: 'Aitken Spence Travels',
      logo: 'Aitken Spence Travels',
      logoImage: aitkenSpenceLogo,
      rating: 0,
      maxRating: 0,
      review: '',
      stars: 0
    },
    {
      name: 'Trip Crafters',
      logo: 'Trip Crafters',
      logoImage: 'https://www.tripcrafters.com/agent/agent_photos/9673-1503001826.jpg',
      rating: 0,
      maxRating: 0,
      review: '',
      stars: 0
    },
    {
      name: 'Exotic Holidays International',
      logo: 'Exotic Holidays International',
      logoImage: exoticHolidaysLogo,
      rating: 0,
      maxRating: 0,
      review: '',
      stars: 0
    },
    {
      name: 'Ceylon My Dream',
      logo: 'Ceylon My Dream',
      logoImage: ceylonMyDreamLogo,
      rating: 0,
      maxRating: 0,
      review: '',
      stars: 0
    }
  ];

  const renderStars = (count: number) => {
    return (
      <div className="flex gap-1 justify-center mb-2">
        {[...Array(5)].map((_, index) => (
          <Star
            key={index}
            size={14}
            className={index < count ? 'fill-amber-400 text-amber-400' : 'fill-gray-300 text-gray-300'}
          />
        ))}
      </div>
    );
  };

  const PartnerCard = ({ partner }: { partner: Partner }) => (
    <div className="flex-shrink-0 w-64 px-3">
      <div className="bg-white border border-gray-200 rounded-lg p-6 h-48 flex flex-col items-center justify-center hover:shadow-lg transition-shadow duration-300">
        {/* Logo/Name */}
        <div className="mb-4 h-16 flex items-center justify-center">
          {partner.logoImage ? (
            <ImageWithFallback 
              src={partner.logoImage} 
              alt={partner.name}
              className={partner.name === 'Ceylon My Dream' ? 'h-16 object-contain' : 'h-12 object-contain'}
            />
          ) : (
            <span className="text-2xl text-gray-800">{partner.logo}</span>
          )}
        </div>

        {/* Stars */}
        {partner.stars > 0 && renderStars(partner.stars)}

        {/* Rating */}
        {partner.rating > 0 && (
          <div className="text-center">
            <p className="text-gray-900">
              <span className="font-semibold">{partner.rating}</span>
              {partner.maxRating > 0 && (
                <span className="text-gray-500"> out of {partner.maxRating}</span>
              )}
            </p>
            {partner.review && (
              <p className="text-gray-600 text-sm mt-1">{partner.review}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <section className="py-16 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-teal-500 uppercase tracking-wider mb-2">
            Our Network
          </p>
          <h2 className="text-3xl md:text-4xl text-gray-900 mb-4">
            Trusted Partners
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            We're proud to partner with leading travel platforms and agencies worldwide
          </p>
        </div>

        {/* Partners Carousel - Continuous Scrolling */}
        <div className="relative mb-8">
          <div className="flex animate-scroll hover:[animation-play-state:paused]">
            {/* First set */}
            {partners.map((partner, index) => (
              <PartnerCard key={`first-${index}`} partner={partner} />
            ))}
            {/* Duplicate set for seamless loop */}
            {partners.map((partner, index) => (
              <PartnerCard key={`second-${index}`} partner={partner} />
            ))}
            {/* Triple set for larger screens */}
            {partners.map((partner, index) => (
              <PartnerCard key={`third-${index}`} partner={partner} />
            ))}
          </div>
        </div>

        {/* Footer Text */}
        <div className="text-center">
          <p className="text-gray-500">
            Featured on major travel platforms with excellent reviews and ratings
          </p>
        </div>
      </div>

      <style>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-270px * 10));
          }
        }

        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
      `}</style>
    </section>
  );
}
