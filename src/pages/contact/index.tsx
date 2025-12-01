import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Button } from '../../components/ui/button';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <div className="relative h-[40vh] bg-gradient-to-r from-[#5c2e3e] to-[#7d3d52] flex items-center justify-center">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 text-center px-4">
          <h1 className="text-white text-4xl md:text-5xl mb-4">Get in Touch</h1>
          <p className="text-white/90 text-lg max-w-2xl mx-auto">
            We're here to help make your stay at VillaWatuna unforgettable
          </p>
        </div>
      </div>

      {/* Contact Content */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
              {/* Contact Form */}
              <div className="bg-gray-50 p-8 rounded-lg">
                <h2 className="text-2xl text-gray-900 mb-6">Send us a Message</h2>
                <form className="space-y-6">
                  {/* First Name and Last Name */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="firstName" className="block text-sm text-gray-700 mb-2">
                        First Name
                      </label>
                      <Input
                        id="firstName"
                        type="text"
                        placeholder="John"
                        className="w-full bg-white border-gray-200"
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm text-gray-700 mb-2">
                        Last Name
                      </label>
                      <Input
                        id="lastName"
                        type="text"
                        placeholder="Doe"
                        className="w-full bg-white border-gray-200"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm text-gray-700 mb-2">
                      Email
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john.doe@example.com"
                      className="w-full bg-white border-gray-200"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label htmlFor="phone" className="block text-sm text-gray-700 mb-2">
                      Phone
                    </label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      className="w-full bg-white border-gray-200"
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="message" className="block text-sm text-gray-700 mb-2">
                      Message
                    </label>
                    <Textarea
                      id="message"
                      placeholder="Tell us about your inquiry..."
                      rows={5}
                      className="w-full bg-white border-gray-200 resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full bg-[#5c2e3e] hover:bg-[#4a2531] text-white py-6"
                  >
                    Send Message
                  </Button>
                </form>
              </div>

              {/* Contact Information */}
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl text-gray-900 mb-6">Contact Information</h2>
                  <p className="text-gray-600 mb-8">
                    Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                  </p>
                </div>

                {/* Address */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-[#5c2e3e]/10 flex items-center justify-center">
                      <MapPin className="h-6 w-6 text-[#5c2e3e]" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-gray-900 mb-2">Address</h3>
                    <p className="text-gray-600">
                      Yaddehimulla, Unawatuna 80600,<br />
                      Galle, Sri Lanka
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-[#5c2e3e]/10 flex items-center justify-center">
                      <Phone className="h-6 w-6 text-[#5c2e3e]" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-gray-900 mb-2">Phone</h3>
                    <p className="text-gray-600">+94 77 695 5500</p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-[#5c2e3e]/10 flex items-center justify-center">
                      <Mail className="h-6 w-6 text-[#5c2e3e]" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-gray-900 mb-2">Email</h3>
                    <p className="text-gray-600">
                      info@villawatuna.com<br />
                      reservations@villawatuna.com
                    </p>
                  </div>
                </div>

                {/* Business Hours */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-[#5c2e3e]/10 flex items-center justify-center">
                      <Clock className="h-6 w-6 text-[#5c2e3e]" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-gray-900 mb-2">Business Hours</h3>
                    <p className="text-gray-600">
                      Front Desk: 24/7<br />
                      Restaurant: 8:00 AM - 10:00 PM<br />
                      Check-in: 2:00 PM | Check-out: 11:00 AM
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Section */}
            <div>
              <h2 className="text-2xl text-gray-900 mb-6">Find Us</h2>
              <div className="w-full h-96 rounded-lg overflow-hidden shadow-lg">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3967.8865700466204!2d80.24184677474871!3d6.010309793974942!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae172ef9e7b6327%3A0x847162e2dab43ba!2sVillaWatuna!5e0!3m2!1sen!2slk!4v1761670839309!5m2!1sen!2slk" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen={true}
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  title="VillaWatuna Location"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}