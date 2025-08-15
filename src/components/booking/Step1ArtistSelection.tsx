import React from 'react';
import { useApp } from '../../context/AppContext';
import { ARTISTS_DATA } from '../../data/artists';
import ArtistCard from '../artist/ArtistCard';

const Step1ArtistSelection: React.FC = () => {
  const { state, dispatch } = useApp();

  const handleArtistSelect = (artistName: string) => {
    dispatch({ type: 'SET_SELECTED_ARTIST', payload: artistName });
    dispatch({ type: 'SET_STEP', payload: 2 });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-light mb-4">Choose Your Artist</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Each of our artists has their own unique style and specialties. Browse their portfolios and select the artist who best matches your vision.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        {ARTISTS_DATA.map((artist) => (
          <ArtistCard
            key={artist.name}
            artist={artist}
            onSelect={() => handleArtistSelect(artist.name)}
            isSelected={state.selectedArtist === artist.name}
          />
        ))}
      </div>

      {/* Need Help Option */}
      <div className="text-center">
        <div className="bg-gray-50 rounded-lg p-8 max-w-2xl mx-auto">
          <h3 className="text-2xl font-light text-gray-900 mb-4">
            Not sure which artist to choose?
          </h3>
          <p className="text-gray-600 mb-6">
            Let us help you find the perfect artist based on your tattoo idea, style preferences, and budget.
          </p>
          <button
            onClick={() => handleArtistSelect('I need help choosing the right artist')}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            I need help choosing the right artist
          </button>
        </div>
      </div>
    </div>
  );
};

export default Step1ArtistSelection;
