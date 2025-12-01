import { Wifi, Utensils, Plane, Ban, Flower2, CarFront, Users, Coffee, UtensilsCrossed } from 'lucide-react';

export function Facilities() {
  const facilities = [
    {
      icon: Wifi,
      title: 'Free Wifi',
      description: 'High-speed internet throughout the property',
    },
    {
      icon: Utensils,
      title: 'Fine Dining',
      description: 'Experience world-class cuisine at our restaurants',
    },
    {
      icon: Plane,
      title: 'Airport Shuttle',
      description: 'Convenient transportation to and from the airport',
    },
    {
      icon: Ban,
      title: 'Non-smoking rooms',
      description: 'Clean and fresh air in all our rooms',
    },
    {
      icon: Flower2,
      title: 'Garden',
      description: 'Beautiful tropical gardens to relax and unwind',
    },
    {
      icon: CarFront,
      title: 'Parking',
      description: 'Free secure parking for all guests',
    },
    {
      icon: Users,
      title: 'Family Rooms',
      description: 'Spacious rooms perfect for families',
    },
    {
      icon: Coffee,
      title: 'Tea/Coffee Maker in All Rooms',
      description: 'Enjoy freshly brewed beverages anytime',
    },
    {
      icon: UtensilsCrossed,
      title: 'Breakfast',
      description: 'Delicious complimentary breakfast daily',
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <p className="text-teal-500 mb-2">Facilities</p>
            <h2 className="text-3xl text-gray-900 mb-4">Hotel Amenities</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Everything you need for a perfect stay in Unawatuna
            </p>
          </div>

          {/* Facilities Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {facilities.map((facility, index) => {
              const Icon = facility.icon;
              return (
                <div key={index} className="flex flex-col items-center text-center">
                  {/* Icon Circle */}
                  <div className="w-20 h-20 rounded-full bg-teal-100 flex items-center justify-center mb-4">
                    <Icon className="h-9 w-9 text-teal-500" />
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-gray-900 mb-2">{facility.title}</h3>
                  
                  {/* Description */}
                  <p className="text-gray-600 text-sm">
                    {facility.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
