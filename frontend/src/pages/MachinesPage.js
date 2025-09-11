
import { useMachinesData } from '../hooks/useMachinesData';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';
import MachineCard from '../components/MachineCard';
import './MachinesPage.css';

function MachinesPage() {
  const {
    machines,
    highScores,
    avatars,
    loading,
    loadingScores,
    error,
    fetchHighScores,
  } = useMachinesData();

  if (loading) {
    return <Loader />;
  }
  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <div className="machines-page">
      {machines.length === 0 ? (
        <div className="no-machines-message">No machines found.</div>
      ) : (
        <div className="machines-container">
          {machines.map(machine => (
            <MachineCard
              key={machine.id}
              machine={machine}
              highScores={highScores}
              loadingScores={loadingScores}
              avatars={avatars}
              onFetchHighScores={fetchHighScores}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default MachinesPage;
