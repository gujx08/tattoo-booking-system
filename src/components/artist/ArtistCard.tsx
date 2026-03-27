import React from 'react';
import { Instagram } from 'lucide-react';
import { Artist } from '../../types';

interface ArtistCardProps {
  artist: Artist;
  onSelect: () => void;
  onCardClick: () => void;
}

const ArtistCard: React.FC<ArtistCardProps> = ({ artist, onSelect, onCardClick }) => {
  const handleSelectClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect();
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
      onClick={onCardClick}
    >
      {/* Artist Avatar & Video Preview */}
      <div className="relative h-48">
        <img
          src={artist.avatar}
          alt={artist.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 left-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            artist.category === 'Lead Artist' ? 'bg-yellow-100 text-yellow-800' :
            artist.category === 'Senior Artist' ? 'bg-yellow-100 text-yellow-800' :
            artist.category === 'Junior Artist' ? 'bg-green-100 text-green-800' :
            'bg-purple-100 text-purple-800'
          }`}>
            {artist.category}
          </span>
        </div>
      </div>

      {/* Artist Info */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-stone-900">{artist.name}</h3>
          {artist.instagram && (
            <a
              href={`https://instagram.com/${artist.instagram.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-stone-400 hover:text-pink-500 transition-colors"
            >
              <Instagram className="w-4 h-4" />
            </a>
          )}
        </div>

        {/* Specialties */}
        {artist.specialties && (
          <div className="mb-3">
            <div className="flex flex-wrap gap-1">
              {artist.specialties.map((specialty, index) => (
                <span
                  key={index}
                  className="text-xs bg-neutral-100 text-stone-700 px-2 py-1 rounded-full"
                >
                  {specialty}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Pricing Information */}
        <div className="flex items-center justify-between">
          <div className="text-sm">
            {artist.category === 'Apprentice' ? (
              <>
                <span className="text-stone-600">Price Range: </span>
                <span className="font-semibold text-stone-900">{artist.priceRange}</span>
              </>
            ) : (
              <>
                <span className="text-stone-600">Day Rate: </span>
                <span className="font-semibold text-stone-900">
                  ${artist.pricing?.dayRate || 'Contact for pricing'}
                </span>
              </>
            )}
          </div>
          <button
            onClick={handleSelectClick}
            className="bg-yellow-500 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-yellow-600 transition-colors"
          >
            Select Artist
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArtistCard;