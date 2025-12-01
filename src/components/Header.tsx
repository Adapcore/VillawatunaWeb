import { Menu } from 'lucide-react';
import { useState, useEffect } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import villaWatunaLogo from 'figma:asset/6bf53d0cfba93b4b2107f1d06c7f1f94effa1477.png';

interface HeaderProps {
  sticky?: boolean;
}

export function Header({ sticky = true }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`${sticky ? 'fixed top-0 left-0 right-0 z-50' : ''} transition-all duration-300 ${isScrolled && sticky ? 'shadow-lg' : ''}`}>
      <div className={`absolute inset-0 bg-gradient-to-b transition-opacity duration-300 ${isScrolled && sticky ? 'from-[#5c2e3e]/95 to-[#5c2e3e]/90 opacity-100' : 'from-[#5c2e3e] to-[#5c2e3e] opacity-100'}`}></div>
      
      <div className="container mx-auto px-4 relative">
        <div className={`flex items-center justify-between ${sticky ? 'py-6' : 'py-2'}`}>
          {/* Logo */}
          <a href="/" className="text-white">
            <ImageWithFallback 
              src={villaWatunaLogo} 
              alt="VillaWatuna"
              className={`${sticky ? 'h-20' : 'h-10'} object-contain brightness-0 invert`}
            />
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="/" className="text-white hover:text-gray-200 transition-colors">Home</a>
            <a href="/rooms" className="text-white hover:text-gray-200 transition-colors">Rooms</a>
            <a href="/menu/beverages" className="text-white hover:text-gray-200 transition-colors">Menu</a>
            <a href="/tours" className="text-white hover:text-gray-200 transition-colors">Tours</a>
            <a href="/#gallery" className="text-white hover:text-gray-200 transition-colors">Gallery</a>
            <a href="/contact" className="text-white hover:text-gray-200 transition-colors">Contact</a>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white"
          >
            <Menu size={24} />
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="md:hidden pb-4 flex flex-col gap-4">
            <a href="/" className="text-white hover:text-gray-200 transition-colors">Home</a>
            <a href="/rooms" className="text-white hover:text-gray-200 transition-colors">Rooms</a>
            <a href="/menu/beverages" className="text-white hover:text-gray-200 transition-colors">Menu</a>
            <a href="/tours" className="text-white hover:text-gray-200 transition-colors">Tours</a>
            <a href="/#gallery" className="text-white hover:text-gray-200 transition-colors">Gallery</a>
            <a href="/contact" className="text-white hover:text-gray-200 transition-colors">Contact</a>
          </nav>
        )}
      </div>
    </header>
  );
}