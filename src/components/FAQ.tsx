import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Plus, Minus } from 'lucide-react';
import faqImage from 'figma:asset/c942ce059bb03dfd20e3469da017519b05864f9a.png';

export function FAQ() {
  const faqs = [
    {
      question: "Where is VillaWatuna located?",
      answer: "VillaWatuna is located in Yaddehimulla, Unawatuna 80600, Galle, Sri Lanka. We are situated in the beautiful coastal area of Unawatuna, known for its pristine beaches and tropical scenery."
    },
    {
      question: "What types of rooms do you offer?",
      answer: "We offer a variety of room categories to suit different needs and budgets: Two Bedroom Suite, Studio Apartment, Superior Room, Deluxe Room, Standard Room, and Economy Room. Each room is designed to provide comfort and relaxation with modern amenities."
    },
    {
      question: "How can I make a reservation?",
      answer: "You can make a reservation by contacting us directly through our website's contact form, calling our front desk, or booking through any of our trusted partner platforms such as Booking.com, Agoda, or Tripadvisor."
    },
    {
      question: "Do you offer tours and activities?",
      answer: "Yes! We offer a wide range of tours and activities including water sports, sunset cruises, snorkeling, island hopping, cultural temple tours, spa and wellness treatments, and nature exploration. Our team can help arrange customized experiences for you."
    },
    {
      question: "Is there a restaurant on-site?",
      answer: "Yes, VillaWatuna features an on-site restaurant offering a diverse menu including appetizers, main courses, desserts, and beverages. We serve both traditional Sri Lankan cuisine and international dishes to cater to all tastes."
    },
    {
      question: "What amenities are available at VillaWatuna?",
      answer: "Our hotel offers various amenities including free Wi-Fi, air conditioning, swimming pool, restaurant, room service, beach access, tour desk, and 24-hour front desk service. Room-specific amenities vary by category."
    },
    {
      question: "How far is VillaWatuna from the beach?",
      answer: "VillaWatuna is perfectly located just a short walk from the beautiful Unawatuna Beach, one of Sri Lanka's most popular beaches. You can enjoy easy access to pristine sandy shores and crystal-clear waters."
    },
    {
      question: "What is your cancellation policy?",
      answer: "Our cancellation policy varies depending on the room category and booking platform used. Generally, free cancellation is available up to a certain number of days before check-in. Please contact us directly or check with your booking platform for specific terms."
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto bg-[#f5f1ed] rounded-3xl p-8 md:p-12 lg:p-16">
          <h2 className="text-3xl text-gray-900 mb-12">
            FAQs About VillaWatuna
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* FAQ Accordion */}
            <div>
              <Accordion type="single" collapsible defaultValue="item-0" className="space-y-0">
                {faqs.map((faq, index) => (
                  <AccordionItem 
                    key={index} 
                    value={`item-${index}`}
                    className="border-b border-gray-300"
                  >
                    <AccordionTrigger className="text-left hover:no-underline py-5 text-gray-800 group">
                      <span className="flex-1 pr-4">{faq.question}</span>
                      <Plus className="h-5 w-5 shrink-0 text-[#5c2e3e] transition-all group-data-[state=open]:hidden" />
                      <Minus className="h-5 w-5 shrink-0 text-[#5c2e3e] transition-all group-data-[state=closed]:hidden" />
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-600 pb-6 pt-2">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>

            {/* Circular Image */}
            <div className="flex justify-center lg:justify-start lg:pl-12">
              <div className="w-[280px] h-[280px] md:w-[320px] md:h-[320px] rounded-full overflow-hidden shadow-lg">
                <ImageWithFallback 
                  src={faqImage}
                  alt="VillaWatuna Beach View"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}