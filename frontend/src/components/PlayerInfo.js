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
        <img className={ avatarUrl ? '' : 'placeholder'} src={avatarUrl || '/pinball.svg'} alt={username} />
      </div>
      <span className="player-name">{username}</span>
    </div>
  );
}

export default PlayerInfo;
