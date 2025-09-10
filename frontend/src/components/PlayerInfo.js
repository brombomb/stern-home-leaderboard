import React from 'react';

function PlayerInfo({ username, avatarData }) {
  const avatarUrl = avatarData?.avatar_url;
  const backgroundColor = avatarData?.background_color;

  return (
    <div className="player-cell">
      <div
        className="player-avatar"
        style={backgroundColor ? { backgroundColor } : {}}
      >
        <img
          src={avatarUrl || '/pinball.svg'}
          alt={username}
          onError={(e) => {
            if (e.target.src !== window.location.origin + '/pinball.svg') {
              e.target.src = '/pinball.svg';
            }
          }}
        />
      </div>
      <span className="player-name">{username}</span>
    </div>
  );
}

export default PlayerInfo;
