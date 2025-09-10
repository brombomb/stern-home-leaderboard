import React, { useEffect } from 'react';
import HighScoresTable from './HighScoresTable';
import { setQueryParams } from '../utils/queryParams';

function MachineCard({ machine, highScores, loadingScores, avatars, onFetchHighScores }) {
  const backgroundImage = machine.model?.title?.primary_background;
  const variableWidthLogo = machine.model?.title?.variable_width_logo;
  const squareLogo = machine.model?.title?.square_logo;
  const gameName = machine.model?.title?.name || 'Game Logo';

  const cardStyle = backgroundImage ? {
    backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(${backgroundImage})`
  } : {};

  useEffect(() => {
    // Only fetch if we don't already have scores for this machine
    if (!highScores[machine.id] && !loadingScores[machine.id]) {
      onFetchHighScores(machine.id);
    }
  }, [machine.id, onFetchHighScores, highScores, loadingScores]);

  const handleFullscreen = () => {
    setQueryParams({
      machine: String(machine.id), // Ensure it's always a string
      fullscreen: 'true'
    });
  };

  return (
    <div
      className={`machine-card ${backgroundImage ? 'with-background' : ''}`}
      style={cardStyle}
    >
      <div className="status-indicator" title={machine.online ? 'Online' : 'Offline'}>
        <span className={machine.online ? 'status-dot-online' : 'status-dot-offline'}></span>
      </div>

      <div className="machine-header">
        {variableWidthLogo ? (
          <img
            src={variableWidthLogo}
            alt={gameName}
            className="game-logo"
            onClick={handleFullscreen}
            title="Click to view fullscreen"
          />
        ) : squareLogo && (
          <img
            src={squareLogo}
            alt={gameName}
            className="game-logo square"
            onClick={handleFullscreen}
            title="Click to view fullscreen"
          />
        )}
      </div>

      <div className="high-scores-section">
        <HighScoresTable
          scores={highScores[machine.id]}
          isLoading={loadingScores[machine.id]}
          avatars={avatars}
        />
      </div>

      <div className="last-played">
        Last Played: {machine.last_played
          ? new Date(machine.last_played).toLocaleDateString()
          : 'Never'
        }
      </div>
    </div>
  );
}

export default MachineCard;
