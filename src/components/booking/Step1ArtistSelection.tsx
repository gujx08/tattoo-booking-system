import React from 'react';
import { useApp } from '../../context/AppContext';
import { ARTISTS_DATA } from '../../data/artists';
import ArtistCard from '../artist/ArtistCard';
import ArtistProfile from '../artist/ArtistProfile';
import Button from '../common/Button';
import { trackArtistSelection, trackBookingStep } from '../../utils/analytics';

const Step1ArtistSelection: React.FC = () => {
  const { state, dispatch } = useApp();
  const [viewingArtist, setViewingArtist] = React.useState<string | null>(null);

  const handleArtistSelect = (artistId: string) => {
    const selectedArtist = ARTISTS_DATA.find(a => a.id === artistId);
    if (selectedArtist) {
      // 追踪艺术家选择
      trackArtistSelection(selectedArtist.displayName);
      trackBookingStep(1, 'Artist Selection');
      
      dispatch({ type: 'SET_SELECTED_ARTIST', payload: selectedArtist });
      dispatch({ type: 'UPDATE_FORM_DATA', payload: { artistId, needsHelpChoosing: false } });
      dispatch({ type: 'SET_STEP', payload: 2 });
    }
  };

  const handleNeedHelp = () => {
    dispatch({ type: 'UPDATE_FORM_DATA', payload: { artistId: 'help', needsHelpChoosing: true } });
  };

  const handleCardClick = (artistId: string) => {
    setViewingArtist(artistId);
  };

  const handleBackFromProfile = () => {
    setViewingArtist(null);
  };

  const handleBookFromProfile = (artistId: string) => {
    handleArtistSelect(artistId);
  };

  const canProceed = state.formData.artistId && state.formData.artistId !== '';

  const handleNext = () => {
    if (canProceed) {
      dispatch({ type: 'SET_STEP', payload: 2 });
    }
  };

  // Show artist profile if viewing one
  if (viewingArtist) {
    const artist = ARTISTS_DATA.find(a => a.id === viewingArtist);
    if (artist) {
      return (
        <ArtistProfile
          artist={artist}
          onBack={handleBackFromProfile}
          onBookAppointment={() => handleBookFromProfile(artist.id)}
        />
      );
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Choose your tattoo artist
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Each of our talented artists has their own unique style and specialties. 
          Click on any artist card to view their profile, or select an artist to start booking.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {ARTISTS_DATA.filter(artist => 
          !artist.hidden && 
          artist.id !== 'maili' && 
          artist.id !== 'keani'
        ).map((artist) => (
          <ArtistCard
            key={artist.id}
            artist={artist}
            onSelect={() => handleArtistSelect(artist.id)}
            onCardClick={() => handleCardClick(artist.id)}
          />
        ))}
      </div>

      {/* Need Help Option */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Not sure which artist is right for you?
          </h3>
          <p className="text-gray-600 mb-4">
            Let us help you choose the perfect artist based on your tattoo idea and style preferences.
          </p>
          <Button
            variant={state.formData.needsHelpChoosing ? 'primary' : 'outline'}
            onClick={handleNeedHelp}
          >
            I need help choosing the right artist
          </Button>
        </div>
      </div>

      {/* Selected Artist Display */}

      {state.formData.needsHelpChoosing && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8">
          <h4 className="font-medium text-green-900 mb-2">
            Perfect! We'll help you choose.
          </h4>
          <p className="text-sm text-green-700">
            After you complete the booking form, we'll match you with the best artist 
            for your specific tattoo idea and style preferences.
          </p>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-end">
        <Button
          onClick={handleNext}
          disabled={!canProceed}
          size="lg"
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default Step1ArtistSelection;