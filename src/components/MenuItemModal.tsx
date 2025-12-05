import { X } from 'lucide-react';
import { useEffect } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface MenuItemModalProps {
  item: {
    id: number;
    name: string;
    description: string;
    price: number;
    image: string;
    ingredients?: string | { markup?: string; blocks?: any[] };
  };
  onClose: () => void;
}

// Map of placeholder images for menu items
const imageMap: { [key: string]: string } = {
  'breakfast-1': 'https://images.unsplash.com/photo-1587094666821-7a1ecab87e70?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicmVha2Zhc3QlMjBmb29kJTIwcGxhdHRlcnxlbnwxfHx8fDE3NjMzODI4NTJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
  'breakfast-2': 'https://images.unsplash.com/photo-1660034096812-37fc304dd763?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbmdsaXNoJTIwYnJlYWtmYXN0JTIwZWdncyUyMGJhY29ufGVufDF8fHx8MTc2MzM4Mjg1M3ww&ixlib=rb-4.1.0&q=80&w=1080',
  'breakfast-3': 'https://images.unsplash.com/photo-1541288097308-7b8e3f58c4c6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYW5jYWtlcyUyMHN5cnVwfGVufDF8fHx8MTc2MzM4Mjg1M3ww&ixlib=rb-4.1.0&q=80&w=1080',
  'breakfast-4': 'https://images.unsplash.com/photo-1653194512065-ced623ac3cfc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVuY2glMjB0b2FzdCUyMGJlcnJpZXN8ZW58MXx8fHwxNzYzMzM5NjQxfDA&ixlib=rb-4.1.0&q=80&w=1080',
  'breakfast-5': 'https://images.unsplash.com/photo-1604242684508-c309e173a3e7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvbWVsZXR0ZSUyMGJyZWFrZmFzdHxlbnwxfHx8fDE3NjMzODI4NTR8MA&ixlib=rb-4.1.0&q=80&w=1080',
};

export function MenuItemModal({ item, onClose }: MenuItemModalProps) {
  useEffect(() => {
    // Prevent scrolling when modal is open
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // Determine image URL - use actual image if it's a URL, otherwise use fallback
  const getImageUrl = () => {
    if (item.image && typeof item.image === 'string') {
      if (item.image.startsWith('http') || item.image.startsWith('//') || item.image.startsWith('/')) {
        return item.image;
      }
      // Fallback to imageMap for placeholder images
      return imageMap[item.image] || imageMap['breakfast-1'];
    }
    return imageMap['breakfast-1'];
  };

  const imageUrl = getImageUrl();

  return (
    <div 
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-white/90 hover:bg-white rounded-full p-2 transition-colors shadow-lg"
        >
          <X className="w-6 h-6 text-gray-700" />
        </button>

        {/* Image */}
        <div className="w-full h-64 md:h-96 overflow-hidden rounded-t-lg bg-[#3a3a3a]">
          <ImageWithFallback 
            src={imageUrl} 
            alt={item.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="p-6 md:p-8">
          {/* Title and Price */}
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h2 className="text-[#5c2e3e] mb-2">{item.name}</h2>
              <p className="text-gray-600">{item.description}</p>
            </div>
            <div className="ml-4">
              <span className="text-[#5c2e3e]">LKR {item.price * 100}</span>
            </div>
          </div>

          {/* Content (Rich Text) - Display exact HTML from Umbraco without modification */}
          {item.ingredients && (() => {
            // Extract markup if it's an object, otherwise use string directly
            // Preserve exact HTML structure from Umbraco
            let htmlContent: string | undefined;
            if (typeof item.ingredients === 'string') {
              // Already a string - use directly
              htmlContent = item.ingredients;
            } else if (typeof item.ingredients === 'object' && item.ingredients !== null) {
              // Object format - extract markup property (exact HTML from Umbraco)
              if ('markup' in item.ingredients && typeof item.ingredients.markup === 'string') {
                htmlContent = item.ingredients.markup;
              }
            }
            
            // Render exact HTML but force single column layout (override any grid/column layouts from Umbraco)
            return htmlContent ? (
              <div className="border-t border-gray-200 pt-6">
                <div 
                  className="menu-content-wrapper text-gray-700 leading-relaxed [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-2 [&_ul]:list-outside [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:my-2 [&_ol]:list-outside [&_li]:mb-1 [&_li]:pl-1 [&_div]:block"
                  dangerouslySetInnerHTML={{ __html: htmlContent }}
                />
                <style dangerouslySetInnerHTML={{
                  __html: `
                    .menu-content-wrapper div[class*="grid"],
                    .menu-content-wrapper div[style*="grid"] {
                      display: block !important;
                      grid-template-columns: none !important;
                    }
                    .menu-content-wrapper div[class*="flex"],
                    .menu-content-wrapper div[style*="flex"] {
                      display: block !important;
                      flex-direction: column !important;
                    }
                    .menu-content-wrapper > div {
                      width: 100% !important;
                    }
                  `
                }} />
              </div>
            ) : null;
          })()}
        </div>
      </div>
    </div>
  );
}