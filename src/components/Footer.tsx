import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* About Section */}
          <div>
            <h3 className="text-xl mb-4">VillaWatuna</h3>
            <p className="text-gray-400 text-sm mb-4">
              Experience luxury and comfort at VillaWatuna Hotel. Your perfect getaway destination with world-class amenities and exceptional service.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center hover:bg-blue-700 transition-colors">
                <Facebook size={16} />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-sky-500 flex items-center justify-center hover:bg-sky-600 transition-colors">
                <Twitter size={16} />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-pink-600 flex items-center justify-center hover:bg-pink-700 transition-colors">
                <Instagram size={16} />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-blue-700 flex items-center justify-center hover:bg-blue-800 transition-colors">
                <Linkedin size={16} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl mb-4">Quick Links</h3>
            <ul className="grid grid-cols-3 gap-x-1 gap-y-1 text-sm">
              <li><a href="/" className="text-gray-400 hover:text-white transition-colors">Home</a></li>
              <li><a href="/rooms" className="text-gray-400 hover:text-white transition-colors">Rooms</a></li>
              <li><a href="/menu/beverages" className="text-gray-400 hover:text-white transition-colors">Menu</a></li>
              <li><a href="/tours" className="text-gray-400 hover:text-white transition-colors">Tours</a></li>
              <li><a href="/#gallery" className="text-gray-400 hover:text-white transition-colors">Gallery</a></li>
              <li><a href="/contact" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3 text-gray-400">
                <MapPin size={16} className="mt-1 flex-shrink-0" />
                <span>Yaddehimulla, Unawatuna 80600, Galle, Sri Lanka</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <Phone size={16} className="flex-shrink-0" />
                <span>+94 77 695 5500</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <Mail size={16} className="flex-shrink-0" />
                <span>info@villawatuna.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
            <p>&copy; 2025 VillaWatuna Hotel. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Sitemap</a>
            </div>
          </div>
          
          {/* Powered By */}
          <div className="mt-6 text-center">
            <a 
              href="https://www.adapcore.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-gray-500 hover:text-gray-300 transition-colors inline-flex items-center gap-1"
            >
              Powered By <span className="text-[#5c2e3e] hover:text-[#7d3e52] transition-colors">Adapcore</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
