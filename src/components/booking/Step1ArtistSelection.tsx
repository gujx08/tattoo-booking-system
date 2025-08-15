import React from 'react';
import { useApp } from '../../context/AppContext';
import { ARTISTS_DATA } from '../../data/artists';
import ArtistCard from '../artist/ArtistCard';

const Step1ArtistSelection: React.FC = () => {
  const { state, dispatch } = useApp();

  const handleArtistSelect = (artistName: string) => {
    console.log('Selecting artist:', artistName);
    console.log('Current state:', state);
    
    try {
      dispatch({ type: 'SET_SELECTED_ARTIST', payload: artistName });
      console.log('Artist set, now changing step...');
      dispatch({ type: 'SET_STEP', payload: 2 });
      console.log('Step changed to 2');
    } catch (error) {
      console.error('Error in handleArtistSelect:', error);
    }
  };

  const handleNeedHelp = () => {
    console.log('Need help clicked');
    handleArtistSelect('I need help choosing the right artist');
  };

  console.log('Step1ArtistSelection rendered');
  console.log('Artists data:', ARTISTS_DATA);
  console.log('Current selected artist:', state.selectedArtist);

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
            onSelect={() => {
              console.log('ArtistCard onSelect called for:', artist.name);
              handleArtistSelect(artist.name);
            }}
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
            onClick={handleNeedHelp}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            I need help choosing the right artist
          </button>
        </div>
      </div>

      {/* Debug Info */}
      <div className="mt-8 p-4 bg-gray-100 rounded-lg text-sm">
        <h4 className="font-semibold mb-2">Debug Info:</h4>
        <p>Current Step: {state.currentStep}</p>
        <p>Selected Artist: {state.selectedArtist || 'None'}</p>
        <p>Artists Count: {ARTISTS_DATA.length}</p>
      </div>
    </div>
  );
};

export default Step1ArtistSelection;
