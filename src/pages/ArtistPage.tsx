import React, { useEffect } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { ARTISTS_DATA } from '../data/artists';
import { Artist } from '../types';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import ArtistProfile from '../components/artist/ArtistProfile';

const HIDDEN_ARTIST_IDS = new Set(['maili', 'keani']);
const RESERVED_PATHS = new Set(['success', 'booking-success', 'admin', 'api', 'static']);

const CHATWME_TOKENS: Record<string, string> = {
  jing: '4440cc13-d9fc-47c6-bf09-54e050ca888c',
  rachel: '140e1c0f-3124-4692-826c-1fa3290ef8d0',
  jasmine: 'aee5aab1-fe4e-4a9d-87d4-1902037e18bd',
};

function isPubliclyVisible(artist: Artist): boolean {
  return !artist.hidden && !HIDDEN_ARTIST_IDS.has(artist.id);
}

const ArtistPage: React.FC = () => {
  const { artistId } = useParams<{ artistId: string }>();
  const navigate = useNavigate();

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

  useEffect(() => {
    const token = CHATWME_TOKENS[artistId || ''];
    if (!token) return;

    const initialChildren = new Set(Array.from(document.body.children));

    const script = document.createElement('script');
    script.src = 'https://chatwme.co/widget.js';
    script.setAttribute('data-token', token);
    script.async = true;
    document.body.appendChild(script);

    return () => {
      const toRemove = Array.from(document.body.children).filter(
        (el) => !initialChildren.has(el)
      );
      toRemove.forEach((el) => el.remove());
    };
  }, [artistId]);

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
        />
      </main>
      <Footer />
    </div>
  );
};

export default ArtistPage;
