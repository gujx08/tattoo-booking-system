import React from 'react';
import { Calendar, MapPin, Phone, Clock, Instagram, Star } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { ARTISTS_DATA } from '../data/artists';
import Button from './common/Button';

const HomePage: React.FC = () => {
  const { dispatch } = useAppContext();

  const handleArtistSelect = (artistName: string) => {
    dispatch({ type: 'SET_SELECTED_ARTIST', payload: artistName });
    dispatch({ type: 'SET_STEP', payload: 2 });
  };

  const handleNeedHelp = () => {
    dispatch({ type: 'SET_SELECTED_ARTIST', payload: 'I need help choosing the right artist' });
    dispatch({ type: 'SET_STEP', payload: 2 });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-4xl font-light text-gray-900 mb-2">Patch Tattoo Therapy</h1>
            <p className="text-gray-600">Professional tattoo artistry in Tarzana, CA</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Introduction */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-light text-gray-900 mb-4">Meet Our Artists</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Choose from our talented team of tattoo artists, each specializing in unique styles and techniques. 
            Browse their portfolios and book your consultation today.
          </p>
        </div>

        {/* Artists Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {ARTISTS_DATA.map((artist) => (
            <div
              key={artist.name}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
              onClick={() => handleArtistSelect(artist.name)}
            >
              {/* Artist Photo */}
              <div className="aspect-square overflow-hidden">
                <img
                  src={artist.image}
                  alt={artist.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Artist Info */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-semibold text-gray-900">{artist.name}</h3>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm text-gray-600">4.9</span>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-3">{artist.experience}</p>

                {/* Specialties */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {artist.specialties.slice(0, 3).map((specialty, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>

                {/* Pricing */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-600">Day Rate</span>
                  <span className="font-semibold text-gray-900">{artist.dayRate}</span>
                </div>

                {/* Action Button */}
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleArtistSelect(artist.name);
                  }}
                  className="w-full"
                >
                  Select Artist
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Need Help Section */}
        <div className="text-center mb-16">
          <div className="bg-gray-50 rounded-lg p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-light text-gray-900 mb-4">Not sure which artist to choose?</h3>
            <p className="text-gray-600 mb-6">
              Let us help you find the perfect artist based on your tattoo idea, style preferences, and budget.
            </p>
            <Button onClick={handleNeedHelp} variant="outline">
              I need help choosing the right artist
            </Button>
          </div>
        </div>

        {/* Studio Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <MapPin className="w-6 h-6 text-blue-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-1">Location</h4>
            <p className="text-sm text-gray-600">18547 1/2 Ventura Blvd<br />Tarzana, CA 91356</p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Clock className="w-6 h-6 text-green-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-1">Hours</h4>
            <p className="text-sm text-gray-600">Monday - Sunday<br />11AM - 7PM</p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Phone className="w-6 h-6 text-purple-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-1">Contact</h4>
            <p className="text-sm text-gray-600">(818) 857-7937<br />info@patchtattootherapy.com</p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Instagram className="w-6 h-6 text-pink-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-1">Follow Us</h4>
            <p className="text-sm text-gray-600">@patch_tattoo_therapy<br />Latest work & updates</p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <h3 className="text-2xl font-light text-gray-900 mb-4">Ready to get started?</h3>
          <p className="text-gray-600 mb-6">
            Book your consultation today and bring your tattoo vision to life.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={handleNeedHelp} size="lg">
              Start Booking Process
            </Button>
            <Button variant="outline" size="lg">
              View Portfolio
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center text-sm text-gray-600">
            <p>&copy; 2024 Patch Tattoo Therapy. All rights reserved.</p>
            <p className="mt-2">Licensed tattoo studio in Tarzana, California</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
