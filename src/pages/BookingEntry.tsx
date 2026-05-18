import React, { useEffect, useLayoutEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ARTISTS_DATA } from '../data/artists';
import { Artist } from '../types';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import NotificationModal from '../components/common/NotificationModal';
import BookingWizard from '../components/BookingWizard';

const HIDDEN_ARTIST_IDS = new Set(['maili', 'keani']);
const RESERVED_PATHS = new Set(['success', 'booking-success', 'admin', 'api', 'static']);

function isPubliclyVisible(artist: Artist): boolean {
  return !artist.hidden && !HIDDEN_ARTIST_IDS.has(artist.id);
}

const BookingEntry: React.FC = () => {
  const { artistId } = useParams<{ artistId: string }>();
  const { state, dispatch } = useApp();

  const artist =
    !artistId || RESERVED_PATHS.has(artistId)
      ? undefined
      : ARTISTS_DATA.find((a) => a.id === artistId);

  const isValid = !!artist && isPubliclyVisible(artist);

  // useLayoutEffect so the wizard's first paint already reflects Step 2 + selected artist,
  // avoiding a one-frame flash of Step 1 (Artist Selection).
  useLayoutEffect(() => {
    if (isValid && artist) {
      dispatch({ type: 'SET_SELECTED_ARTIST', payload: artist });
      dispatch({
        type: 'UPDATE_FORM_DATA',
        payload: { artistId: artist.id, needsHelpChoosing: false },
      });
      dispatch({ type: 'SET_STEP', payload: 2 });
    }
  }, [artist, isValid, dispatch]);

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
        <BookingWizard />
      </main>
      <Footer />
      <NotificationModal
        isOpen={state.showNotification}
        message={state.notificationMessage}
      />
    </div>
  );
};

export default BookingEntry;
