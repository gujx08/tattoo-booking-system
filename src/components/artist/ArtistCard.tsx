import React from 'react';
import { Star } from 'lucide-react';

interface Artist {
  name: string;
  image: string;
  experience: string;
  specialties: string[];
  dayRate: string;
  description?: string;
  portfolio?: string[];
  reviews?: Array<{
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
  const handleClick = () => {
    onSelect();
  };

  // 安全地处理specialties数组
  const specialties = artist.specialties || [];

  return (
    <div
      className={`bg-white border-2 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer ${
        isSelected ? 'border-blue-500' : 'border-gray-200'
      }`}
      onClick={handleClick}
    >
      {/* Artist Photo */}
      <div className="aspect-square overflow-hidden">
        <img
          src={artist.image}
          alt={artist.name}
          className="w-full h-full object-cover"
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

        {/* Specialties - 安全处理 */}
        {specialties.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {specialties.slice(0, 3).map((specialty, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
              >
                {specialty}
              </span>
            ))}
          </div>
        )}

        {/* Pricing */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-gray-600">Day Rate</span>
          <span className="font-semibold text-gray-900">{artist.dayRate}</span>
        </div>

        {/* Action Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSelect();
          }}
          className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Select Artist
        </button>
      </div>
    </div>
  );
};

export default ArtistCard;
