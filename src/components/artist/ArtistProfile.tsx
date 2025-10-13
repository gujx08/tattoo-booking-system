import React from 'react';
import { Instagram, ArrowLeft, Calendar, Clock, MapPin, Star } from 'lucide-react';
import { Artist } from '../../types';
import Button from '../common/Button';

interface ArtistProfileProps {
  artist: Artist;
  onBack: () => void;
  onBookAppointment: () => void;
}

const ArtistProfile: React.FC<ArtistProfileProps> = ({ 
  artist, 
  onBack, 
  onBookAppointment 
}) => {
  const getPricingDisplay = (artist: Artist) => {
    if (artist.id === 'jing') {
      return {
        dayRate: artist.pricing?.dayRate || 2500,
        halfDay: 'Does not take half day requests',
        minimum: 2500,
        deposit: artist.deposit,
        coverUpExtra: artist.pricing?.coverUpExtra
      };
    }
    
    return {
      dayRate: artist.pricing?.dayRate,
      halfDay: `$${artist.pricing?.halfDay}`,
      minimum: `$${artist.pricing?.minimum}`,
      deposit: artist.deposit,
      coverUpExtra: artist.pricing?.coverUpExtra
    };
  };

  const pricingData = getPricingDisplay(artist);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button
            onClick={onBack}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Artists
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Artist Name */}
            <h1 className="text-3xl font-bold text-gray-900 mb-6">
              {artist.name}
            </h1>

            {/* Video Section - At the top */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="aspect-video rounded-lg overflow-hidden mb-4">
                <video
                  controls
                  autoPlay
                  muted
                  preload="metadata"
                  className="w-full h-full object-cover"
                  poster={artist.avatar}
                  onError={(e) => {
                    console.error('Video loading error:', e);
                  }}
                  onLoadStart={() => {
                    console.log('Video loading started');
                  }}
                  onCanPlay={() => {
                    console.log('Video can play');
                  }}
                >
                  <source src={artist.video} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>

            {/* Artist Description - Below video, no specialties */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <p className="text-gray-700 leading-relaxed">
                {artist.description}
              </p>
            </div>

            {/* Pricing Section */}
            {artist.pricing && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Pricing</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p><strong>Day rate:</strong> ${pricingData.dayRate}</p>
                    <p><strong>Minimum:</strong> 
                      {artist.id === 'jing' ? ` $${pricingData.minimum}` : ` ${pricingData.minimum}`}
                    </p>
                    <p><strong>Deposit:</strong> ${pricingData.deposit} (deducted from total)</p>
                  </div>
                  <div className="space-y-2">
                    <p><strong>Half day:</strong> {pricingData.halfDay}</p>
                    <p><strong>Cover-up extra:</strong> +${pricingData.coverUpExtra}</p>
                  </div>
                </div>
                
                {artist.specialNote && (
                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                    <p className="text-sm text-yellow-800">
                      <strong>Special Note:</strong> {artist.specialNote}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Portfolio */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Portfolio</h2>
              <div className="grid grid-cols-2 gap-4">
                {artist.portfolio.map((image, index) => (
                  <div key={index} className="portfolio-item">
                    <div className="aspect-square rounded-lg overflow-hidden">
                      <img
                        src={image}
                        alt={`${artist.name} work ${index + 1}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/placeholder-portfolio.jpg';
                          target.alt = 'Portfolio Image';
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Instagram Link - Below Portfolio */}
            {artist.instagram && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <a
                  href={`https://instagram.com/${artist.instagram.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-pink-600 hover:text-pink-700 font-medium transition-colors"
                >
                  <Instagram className="w-5 h-5 mr-2" />
                  See more work on Instagram
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            )}

            {/* Client Reviews - 修复后的版本，使用真实数据 */}
            {artist.reviews && artist.reviews.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Client Reviews</h2>
                
                <div className="space-y-6">
                  {artist.reviews.map((review, index) => (
                    <div 
                      key={index} 
                      className={`review ${index < artist.reviews.length - 1 ? 'border-b border-gray-200 pb-4' : ''}`}
                    >
                      <div className="flex items-center mb-2">
                        <div className="flex text-yellow-400">
                          {[1,2,3,4,5].map(star => (
                            <Star key={star} className="w-5 h-5 fill-current" />
                          ))}
                        </div>
                        <span className="ml-2 font-semibold text-gray-900">{review.name}</span>
                      </div>
                      <p className="text-gray-700">
                        {review.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Bottom Booking Button */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <Button
                onClick={onBookAppointment}
                className="w-full bg-black text-white hover:bg-gray-800 text-lg py-4"
                size="lg"
              >
                Book a tattoo with {artist.displayName}
              </Button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Artist Info Card */}
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
              {/* Experience */}
              {artist.experience && (
                <div className="info-item mb-4">
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 mr-3 text-gray-600" />
                    <div>
                      <p className="font-semibold text-gray-900">Experience</p>
                      <p className="text-gray-600">{artist.experience}</p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Location */}
              <div className="info-item mb-4">
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 mr-3 text-gray-600" />
                  <div>
                    <p className="font-semibold text-gray-900">Location</p>
                    <p className="text-gray-600">18547 1/2 Ventura Blvd</p>
                  </div>
                </div>
              </div>
              
              {/* Instagram */}
              <div className="info-item mb-6">
                <div className="flex items-center">
                  <Instagram className="w-5 h-5 mr-3 text-gray-600" />
                  <div>
                    <p className="font-semibold text-gray-900">Instagram</p>
                    {artist.instagram && (
                      <a
                        href={`https://instagram.com/${artist.instagram.replace('@', '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-pink-600 hover:text-pink-700"
                      >
                        {artist.instagram}
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Book Button */}
              <Button
                onClick={onBookAppointment}
                className="w-full mb-6 bg-black text-white hover:bg-gray-800"
                size="lg"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Book a tattoo with {artist.displayName}
              </Button>

              {/* Booking Process */}
              <div className="booking-process">
                <h3 className="font-semibold text-gray-900 mb-4">Booking Process:</h3>
                <ol className="text-sm space-y-2 text-gray-700">
                  <li>1. Submit your tattoo request</li>
                  <li>2. Pay the deposit</li>
                  <li>3. Book 1-1 consultation with your artist (optional)</li>
                  <li>4. Discuss design details with your artist in consultation, or via email</li>
                  <li>5. Schedule the appointment</li>
                  <li>6. Complete your tattoo on the scheduled day</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtistProfile;