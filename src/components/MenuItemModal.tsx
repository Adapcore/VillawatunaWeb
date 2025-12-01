import { X } from 'lucide-react';
import { useEffect } from 'react';

interface MenuItemModalProps {
  item: {
    id: number;
    name: string;
    description: string;
    price: number;
    image: string;
    ingredients?: string;
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

  const imageUrl = imageMap[item.image] || imageMap['breakfast-1'];

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
        <div className="w-full h-64 md:h-96 overflow-hidden rounded-t-lg">
          <img 
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

          {/* Ingredients/How it's made */}
          {item.ingredients && (
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-[#5c2e3e] mb-3">{item.name === 'Pancake' ? "Your choice" : "What's Included"}</h3>
              <div className="text-gray-700 leading-relaxed">
                {item.name === 'Pancake' ? (
                  // Two-column layout for Pancake options
                  <div className="grid grid-cols-2 gap-x-6">
                    {item.ingredients.split('\n').map((option, idx) => (
                      <div key={idx} className="mb-2">{option}</div>
                    ))}
                  </div>
                ) : (
                  // Original layout for other items
                  <>
                    {item.ingredients.split('\n\n').map((section, idx) => {
                      // Check if this section should be in a two-column layout
                      const isEggsOrServed = section.startsWith('Eggs (your choice)') || section.startsWith('Served with:');
                      const nextSection = item.ingredients?.split('\n\n')[idx + 1];
                      const nextIsServed = nextSection?.startsWith('Served with:');
                      
                      // If this is Eggs section and next is Served section, render them side by side
                      if (section.startsWith('Eggs (your choice)') && nextIsServed) {
                        return (
                          <div key={idx} className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                            <div className="whitespace-pre-line">{section}</div>
                            <div className="whitespace-pre-line">{nextSection}</div>
                          </div>
                        );
                      }
                      
                      // Skip the Served section if it was already rendered with Eggs
                      if (section.startsWith('Served with:') && item.ingredients?.split('\n\n')[idx - 1]?.startsWith('Eggs (your choice)')) {
                        return null;
                      }
                      
                      // Render other sections normally
                      return (
                        <div key={idx} className="whitespace-pre-line mb-4">
                          {section}
                        </div>
                      );
                    })}
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}