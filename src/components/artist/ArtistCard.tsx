import React from 'react';
import { Star, Instagram } from 'lucide-react';

interface Artist {
  name: string;
  image: string;
  experience: string;
  specialties: string[];
  dayRate: string;
  description: string;
  portfolio: string[];
  reviews: Array<{
    name: string;
    rating: number;
    comment: string;
  }>;
}

interface ArtistCardProps {
  artist: Artist;
  onSelect: () => void;
  isSelected?: boolean;
}

const ArtistCard: React.FC<ArtistCardProps> = ({ artist, onSelect, isSelected = false }) => {
  const handleCardClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Artist card clicked:', artist.name);
    onSelect();
  };

  const handleButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Select button clicked:', artist.name);
    onSelect();
  };

  return (
    <div
      className={`bg-white border-2 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer ${
        isSelected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200 hover:border-gray-300'
      }`}
      onClick={handleCardClick}
    >
      {/* Artist Photo */}
      <div className="aspect-square overflow-hidden relative">
        <img
          src={artist.image}
          alt={artist.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
        {/* Artist Type Badge */}
        <div className="absolute top-3 left-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            artist.name === 'Jingxi Gu' ? 'bg-yellow-500 text-white' :
            ['Rachel Hong', 'Jasmine Hsueh'].includes(artist.name) ? 'bg-blue-500 text-white' :
            ['Lauren Hacaga', 'Annika Riggins'].includes(artist.name) ? 'bg-green-500 text-white' :
            'bg-purple-500 text-white'
          }`}>
            {artist.name === 'Jingxi Gu' ? 'Lead Artist' :
             ['Rachel Hong', 'Jasmine Hsueh'].includes(artist.name) ? 'Senior Artist' :
             ['Lauren Hacaga', 'Annika Riggins'].includes(artist.name) ? 'Junior Artist' :
             'Apprentice'}
          </span>
        </div>
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
          {artist.specialties.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded-full">
              +{artist.specialties.length - 3} more
            </span>
          )}
        </div>

        {/* Pricing */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-gray-600">Day Rate</span>
          <span className="font-semibold text-gray-900">{artist.dayRate}</span>
        </div>

        {/* Action Button */}
        <button
          onClick={handleButtonClick}
          className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
            isSelected
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md'
          }`}
        >
          {isSelected ? 'Selected' : 'Select Artist'}
        </button>

        {/* Instagram Link */}
        <div className="mt-3 text-center">
          <a
            href={`https://instagram.com/${artist.name.toLowerCase().replace(' ', '_')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700"
            onClick={(e) => e.stopPropagation()}
          >
            <Instagram className="w-3 h-3" />
            <span>View Portfolio</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default ArtistCard;
