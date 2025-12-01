import { useState, useRef } from 'react';
import Slider from 'react-slick';
import type { Settings } from 'react-slick';
import { Building, MapPin, UtensilsCrossed, Info } from 'lucide-react';
import bannerImage1 from 'figma:asset/7ea07d9b170bef015e157b10b53d6ed9f0ded285.png';
import bannerImage2 from 'figma:asset/2c5532567f860a12f7a4d72eac8307cf5518949b.png';
import bannerImage3 from 'figma:asset/12dea62243ae21681df141f7011e1497c1bff8cf.png';

const beachHotelImages = [
  {
    url: bannerImage1,
    alt: 'Garden View Room'
  },
  {
    url: bannerImage2,
    alt: 'Deluxe Room'
  },
  {
    url: bannerImage3,
    alt: 'Suite with Orange Accent'
  }
];

export function Hero() {
  const [current, setCurrent] = useState(0);
  const sliderRef = useRef<Slider>(null);

  const settings: Settings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: false,
    swipeToSlide: true,
    cssEase: 'ease-in-out',
    beforeChange: (_, next) => setCurrent(next),
    dotsClass: 'slick-dots hero-dots',
    customPaging: (i) => (
      <div 
        className={`w-3 h-3 rounded-full transition-all duration-300 ${
          current === i ? 'bg-white w-8' : 'bg-white/50'
        }`}
      ></div>
    ),
    arrows: false
  };

  const scrollToSlide = (index: number) => {
    sliderRef.current?.slickGoTo(index);
  };

  return (
    <section className="relative h-screen flex items-center justify-center pt-24">
      {/* Background Carousel */}
      <div className="absolute inset-0 w-full h-full top-24">
        <Slider ref={sliderRef} {...settings}>
          {beachHotelImages.map((image, index) => (
            <div key={index} className="outline-none">
              <div className="relative h-screen w-full">
                <img 
                  src={image.url}
                  alt={image.alt}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50"></div>
              </div>
            </div>
          ))}
        </Slider>
      </div>

      {/* Content */}
      <div className="relative z-20 text-center px-4 max-w-5xl mx-auto">
        <h1 className="text-white text-4xl md:text-5xl lg:text-6xl mb-6">
          A Boutique Stay in the Heart of VillaWatuna
        </h1>
        <p className="text-white text-base md:text-lg mb-3 max-w-3xl mx-auto">
          A 2-minute walk from the ocean, VillaWatuna is a collection of spacious, homely rooms. The entire property has free WiFi Coverage.
        </p>
        <p className="text-white text-base md:text-lg mb-12 max-w-3xl mx-auto">
          Couples in particular like the location – they rated it 9.7 for a two-person trip.
        </p>
        
        {/* Navigation Tiles */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <a 
            href="#rooms" 
            className="group relative overflow-hidden bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all duration-300 p-8 flex flex-col items-center justify-center gap-4 cursor-pointer"
          >
            <Building size={48} className="text-white" strokeWidth={1.5} />
            <span className="text-white uppercase tracking-wider">Rooms</span>
          </a>
          
          <a 
            href="#gallery" 
            className="group relative overflow-hidden bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all duration-300 p-8 flex flex-col items-center justify-center gap-4 cursor-pointer"
          >
            <MapPin size={48} className="text-white" strokeWidth={1.5} />
            <span className="text-white uppercase tracking-wider">Tours</span>
          </a>
          
          <a 
            href="/menu" 
            className="group relative overflow-hidden bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all duration-300 p-8 flex flex-col items-center justify-center gap-4 cursor-pointer"
          >
            <UtensilsCrossed size={48} className="text-white" strokeWidth={1.5} />
            <span className="text-white uppercase tracking-wider">Menu</span>
          </a>
          
          <a 
            href="#contact" 
            className="group relative overflow-hidden bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all duration-300 p-8 flex flex-col items-center justify-center gap-4 cursor-pointer"
          >
            <Info size={48} className="text-white" strokeWidth={1.5} />
            <span className="text-white uppercase tracking-wider">About Us</span>
          </a>
        </div>
      </div>
    </section>
  );
}