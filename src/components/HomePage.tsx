import React from 'react';
import { Calendar, MapPin, Phone, Clock, Instagram, Star } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ARTISTS_DATA } from '../data/artists';
import Button from './common/Button';

const HomePage: React.FC = () => {
  const { dispatch } = useApp();

  const handleBookNow = () => {
    dispatch({ type: 'SET_STEP', payload: 1 });
  };

  const featuredArtists = ARTISTS_DATA.slice(0, 3);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Patch Tattoo Therapy
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Where artistry meets healing. Expert tattoo artists creating meaningful 
              body art in the heart of Tarzana.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={handleBookNow} size="lg" className="text-lg px-8">
                <Calendar className="w-5 h-5 mr-2" />
                Book Your Tattoo
              </Button>
              <a
                href="https://instagram.com/patch_tattoo_therapy"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" size="lg" className="text-lg px-8 text-white border-white hover:bg-white hover:text-gray-900">
                  <Instagram className="w-5 h-5 mr-2" />
                  Follow Us
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Artists */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Meet Our Artists
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Each artist brings their unique style and expertise to create 
              tattoos that tell your story.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredArtists.map((artist) => (
              <div key={artist.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="aspect-square">
                  <img
                    src={artist.avatar}
                    alt={artist.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {artist.displayName}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      artist.category === 'Lead Artist' ? 'bg-yellow-100 text-yellow-800' :
                      artist.category === 'Senior Artist' ? 'bg-blue-100 text-blue-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {artist.category}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {artist.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      From ${artist.deposit} deposit
                    </span>
                    {artist.instagram && (
                      <a
                        href={`https://instagram.com/${artist.instagram.replace('@', '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-pink-500 hover:text-pink-600 transition-colors"
                      >
                        <Instagram className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button onClick={handleBookNow} size="lg">
              View All Artists & Book
            </Button>
          </div>
        </div>
      </section>

      {/* Studio Info */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Your Tattoo Journey Starts Here
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                At Patch Tattoo Therapy, we believe that every tattoo should be a 
                meaningful expression of your story. Our experienced artists work 
                closely with you to bring your vision to life, ensuring every detail 
                is perfect.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <span className="text-gray-700">18547 1/2 Ventura Blvd, Tarzana, CA 91356</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <span className="text-gray-700">Monday - Sunday: 11AM - 7PM</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <span className="text-gray-700">818-857-7937</span>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-100 rounded-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Why Choose Us?
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Star className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Expert Artists</h4>
                    <p className="text-sm text-gray-600">
                      Highly skilled artists with diverse specialties and years of experience
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Star className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Custom Designs</h4>
                    <p className="text-sm text-gray-600">
                      Every tattoo is uniquely designed to match your vision and story
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Star className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Clean & Safe</h4>
                    <p className="text-sm text-gray-600">
                      Sterile equipment and safe practices ensuring your health and safety
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Star className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Personal Consultation</h4>
                    <p className="text-sm text-gray-600">
                      One-on-one consultations to ensure your tattoo is perfect
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Start Your Tattoo Journey?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Book your consultation today and let our artists help bring your vision to life. 
            Your story deserves to be told beautifully.
          </p>
          <Button 
            onClick={handleBookNow} 
            size="lg" 
            className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8"
          >
            <Calendar className="w-5 h-5 mr-2" />
            Book Your Appointment
          </Button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;