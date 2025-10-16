

function PlayerInfo({ username, avatarData, isNewScore = false }) {
  const avatarUrl = avatarData?.avatar_url;
  const backgroundColor = avatarData?.background_color;

  return (
    <div className="player-cell">
      <div
        className="player-avatar"
        style={backgroundColor ? { backgroundColor } : {}}
      >
        <img className={avatarUrl ? '' : 'placeholder'} src={avatarUrl || '/pinball.svg'} alt={username} />
      </div>
      <span className="player-name">
        {username}
        {isNewScore && <span className="trophy-icon" title="New Score!">🏆</span>}
      </span>
    </div>
  );
}

export default PlayerInfo;
