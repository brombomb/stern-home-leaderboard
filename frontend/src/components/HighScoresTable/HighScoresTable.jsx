
import PlayerInfo from '../PlayerInfo';
import './HighScoresTable.css';

function HighScoresTable({ scores, isLoading, avatars, newScoreIds = [] }) {
  if (isLoading) {
    return <div className="loading-scores">Loading high scores...</div>;
  }

  if (!scores) {
    return <div className="loading-scores">No high scores loaded yet</div>;
  }

  if (scores.error) {
    return <div className="error-scores">Error: {scores.error}</div>;
  }

  if (!scores.high_score || scores.high_score.length === 0) {
    return <div className="no-scores">No high scores found</div>;
  }

  return (
    <table className="high-scores-table">
      <thead>
        <tr className="table-header">
          <th>Rank</th>
          <th>Player</th>
          <th className="score-column">Score</th>
        </tr>
      </thead>
      <tbody>
        {scores.high_score.map((scoreEntry, index) => {
          const username = scoreEntry.user?.username ||
                          scoreEntry.user?.name ||
                          scoreEntry.user?.initials ||
                          'Unknown';
          const avatarData = avatars[username.toLowerCase()];
          const scoreId = scoreEntry.id || `${username}-${scoreEntry.score}`;
          const isNewScore = newScoreIds.includes(scoreId) ||
                           (index === 0 && newScoreIds.includes('test-score-highlight'));

          return (
            <tr key={index} className={`table-row ${isNewScore ? 'new-score' : ''}`}>
              <td className="table-cell rank-cell">
                {index === 0 ? 'GC' : index}
              </td>
              <td className="table-cell">
                <PlayerInfo
                  username={username}
                  avatarData={avatarData}
                  isNewScore={isNewScore}
                />
              </td>
              <td className="table-cell score-cell">
                {parseInt(scoreEntry.score)?.toLocaleString() || 'N/A'}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default HighScoresTable;
