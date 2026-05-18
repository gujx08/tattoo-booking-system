import React, { useEffect } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ARTISTS_DATA } from '../data/artists';
import { Artist } from '../types';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import NotificationModal from '../components/common/NotificationModal';
import ArtistProfile from '../components/artist/ArtistProfile';

const HIDDEN_ARTIST_IDS = new Set(['maili', 'keani']);
const RESERVED_PATHS = new Set(['success', 'booking-success', 'admin', 'api', 'static']);

function isPubliclyVisible(artist: Artist): boolean {
  return !artist.hidden && !HIDDEN_ARTIST_IDS.has(artist.id);
}

const ArtistPage: React.FC = () => {
  const { artistId } = useParams<{ artistId: string }>();
  const navigate = useNavigate();
  const { state } = useApp();

  const artist =
    !artistId || RESERVED_PATHS.has(artistId)
      ? undefined
      : ARTISTS_DATA.find((a) => a.id === artistId);

  const isValid = !!artist && isPubliclyVisible(artist);

  useEffect(() => {
    if (isValid && artist) {
      document.title = `Book a tattoo with ${artist.name} | Patch Tattoo Therapy`;
    }
  }, [artist, isValid]);

  if (!isValid || !artist) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      <Header />
      <main className="flex-1">
        <ArtistProfile
          artist={artist}
          onBack={() => navigate('/')}
          onBookAppointment={() => navigate(`/${artist.id}/book`)}
        />
      </main>
      <Footer />
      <NotificationModal
        isOpen={state.showNotification}
        message={state.notificationMessage}
      />
    </div>
  );
};

export default ArtistPage;
