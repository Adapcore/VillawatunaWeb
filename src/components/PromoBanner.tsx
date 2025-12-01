import { ImageWithFallback } from './figma/ImageWithFallback';

export function PromoBanner() {
  return (
    <section className="relative py-20 md:py-24 overflow-hidden">
      {/* Parallax Background Image */}
      <div className="absolute inset-0 w-full h-full">
        <div className="parallax-bg w-full h-full">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1628870571248-4f5db428986c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBiZWFjaCUyMHJlc29ydCUyMHJvb218ZW58MXx8fHwxNzYxMjEwOTYyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Beach Resort"
            className="w-full h-full object-cover scale-110"
          />
        </div>
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-[#5c2e3e]/80"></div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between max-w-5xl mx-auto">
          {/* Left Content */}
          <div className="text-white text-center md:text-left mb-8 md:mb-0">
            <div className="flex gap-1 justify-center md:justify-start mb-3">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-yellow-400">★</span>
              ))}
            </div>
            <h2 className="text-3xl md:text-4xl mb-2">STANDARDIZED</h2>
            <h2 className="text-3xl md:text-4xl mb-4">BUDGET ROOMS</h2>
            <div className="flex items-baseline justify-center md:justify-start gap-2">
              <span className="text-5xl">$99</span>
              <span className="text-2xl">/-</span>
            </div>
            
            {/* Feature Icons */}
            <div className="flex gap-6 mt-6 justify-center md:justify-start">
              <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center">
                <span className="text-white">🛏️</span>
              </div>
              <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center">
                <span className="text-white">📺</span>
              </div>
              <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center">
                <span className="text-white">☕</span>
              </div>
              <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center">
                <span className="text-white">🚿</span>
              </div>
            </div>
          </div>

          {/* Right Content - Discount Badge */}
          <div className="relative">
            <div className="w-48 h-48 rounded-full bg-red-600 flex flex-col items-center justify-center relative">
              <div className="absolute -top-4 -left-4 w-24 h-24 rounded-full bg-white flex items-center justify-center shadow-lg">
                <span className="text-2xl">😊</span>
              </div>
              <div className="text-white text-center">
                <div className="text-sm uppercase mb-1">Get</div>
                <div className="text-6xl">70%</div>
                <div className="text-xl uppercase mt-1">Off</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
