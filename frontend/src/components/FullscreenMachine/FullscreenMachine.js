import { useEffect } from 'react';
import HighScoresTable from '../HighScoresTable';
import { clearQueryParams } from '../../utils/queryParams';
import './FullscreenMachine.css';

function FullscreenMachine({ machine, highScores, loadingScores, avatars, onFetchHighScores }) {
  const backgroundImage = machine.model?.title?.primary_background;
  const variableWidthLogo = machine.model?.title?.variable_width_logo;
  const squareLogo = machine.model?.title?.square_logo;
  const gameName = machine.model?.title?.name || 'Game Logo';

  const containerStyle = backgroundImage ? {
    backgroundImage: `linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.8)), url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  } : {};

  useEffect(() => {
    // Fetch high scores when component mounts
    if (!highScores[machine.id] && !loadingScores[machine.id]) {
      onFetchHighScores(machine.id);
    }
  }, [machine.id, onFetchHighScores, highScores, loadingScores]);

  const handleExit = () => {
    clearQueryParams();
  };

  // Handle escape key to exit fullscreen
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === 'Escape') {
        handleExit();
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, []);

  return (
    <div className="fullscreen-machine" style={containerStyle}>
      <div className="fullscreen-content">
        {/* Header with game logo and status */}
        <div className="fullscreen-header">
          <div className="game-logo-container">
            <img
              src={variableWidthLogo ? variableWidthLogo : squareLogo}
              alt={gameName}
              className="fullscreen-game-logo"
              onClick={handleExit}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleExit();
                }
              }}
              tabIndex="0"
              title="Click to exit fullscreen"
            />
          </div>

          <div className="status-container">
            <div className="status-indicator-large" title={machine.online ? 'Online' : 'Offline'}>
              <span className={machine.online ? 'status-dot-online-large' : 'status-dot-offline-large'} />
            </div>
          </div>
        </div>

        {/* High scores section */}
        <div className="fullscreen-scores">
          <div className="scores-table-container">
            <HighScoresTable
              scores={highScores[machine.id]}
              isLoading={loadingScores[machine.id]}
              avatars={avatars}
            />
          </div>
        </div>

        {/* Footer with last played */}
        <div className="fullscreen-footer">
          <div className="last-played-large">
            Last Played: {machine.last_played
              ? new Date(machine.last_played).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })
              : 'Never'
            }
          </div>
        </div>
      </div>
    </div>
  );
}

export default FullscreenMachine;
