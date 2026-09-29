import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ARTISTS_DATA } from '../data/artists';
import ArtistCard from '../components/artist/ArtistCard';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import { trackArtistSelection } from '../utils/analytics';

const HELP_CHOOSING_URL = 'https://chatwme.co/jing';

const ArtistIndexPage: React.FC = () => {
  const navigate = useNavigate();

  const handleArtistSelect = (artistId: string) => {
    const selectedArtist = ARTISTS_DATA.find(a => a.id === artistId);
    if (selectedArtist) {
      // 追踪艺术家选择
      trackArtistSelection(selectedArtist.displayName);

      navigate(`/${artistId}`);
    }
  };

  const handleCardClick = (artistId: string) => {
    navigate(`/${artistId}`);
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-stone-900 mb-4">
              Choose your tattoo artist
            </h1>
            <p className="text-stone-600 max-w-2xl mx-auto">
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
              <h3 className="text-lg font-semibold text-stone-900 mb-2">
                Not sure which artist is right for you?
              </h3>
              <p className="text-stone-600 mb-4">
                Let us help you choose the perfect artist based on your tattoo idea and style preferences.
              </p>
              {/* ChatWme 上的 AI 助手可以根据纹身想法和风格推荐艺术家，默认进入 Jing 的页面（同一标签页） */}
              <a
                href={HELP_CHOOSING_URL}
                className="inline-flex items-center justify-center font-semibold rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 border-2 border-stone-700 text-stone-900 hover:bg-stone-700 hover:text-white px-4 py-2 text-base"
              >
                I need help choosing the right artist
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ArtistIndexPage;