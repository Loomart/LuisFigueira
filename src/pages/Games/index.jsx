import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './Games.css';

const Games = () => {
  const { t } = useTranslation();
  const [activeGameId, setActiveGameId] = useState(null);
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  // Memoized game list data
  const GAME_DATA = [
    { id: 'shape-sorter', name: 'Shape Sorter', description: t('games.shapeSorter.description') },
    // Add more games here as needed
  ];

  useEffect(() => {
    // Simulate loading games from a data source
    const fetchGames = async () => {
      try {
        // In production, this would fetch from an API or local storage
        setGames(GAME_DATA);
      } catch (error) {
        console.error('Error fetching games:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  const handleGameSelect = (gameId) => {
    setActiveGameId(gameId);
  };

  const handleBackToMenu = () => {
    setActiveGameId(null);
  };

  // Memoized game component loader
  const GameComponent = React.memo(({ gameId }) => {
    switch (gameId) {
      case 'shape-sorter':
        return <ShapeSorter onBack={handleBackToMenu} />;
      default:
        return null;
    }
  });

  if (loading) {
    return (
      <div className="games-container">
        <p>{t('games.loading')}</p>
      </div>
    );
  }

  return (
    <div className="games-container">
      <header className="games-header">
        <h1>{t('games.title')}</h1>
        <button 
          className="back-button" 
          onClick={handleBackToMenu}
          disabled={!activeGameId}
          aria-label={t('games.backToMenu')}
        >
          {t('games.backButton')}
        </button>
      </header>

      {activeGameId ? (
        <div className="game-view">
          <GameComponent gameId={activeGameId} />
        </div>
      ) : (
        <div className="games-grid">
          {games.map((game) => (
            <button
              key={game.id}
              className={`game-card ${activeGameId === game.id ? 'active' : ''}`}
              onClick={() => handleGameSelect(game.id)}
              aria-label={`${game.name} - ${game.description}`}
            >
              <h3>{game.name}</h3>
              <p>{game.description}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// Lazy load ShapeSorter component
const ShapeSorter = React.lazy(() => import('./ShapeSorter/index.jsx'));

export default Games;
