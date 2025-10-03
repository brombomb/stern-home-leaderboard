import { useState, useEffect } from 'react';
import MachinesPage from './pages/MachinesPage';
import FullscreenMachine from './components/FullscreenMachine';
import { useMachinesData } from './hooks/useMachinesData';
import { getQueryParams } from './utils/queryParams';
import Loader from './components/Loader';
import ErrorMessage from './components/ErrorMessage';

function App() {
  const [queryParams, setQueryParams] = useState(getQueryParams());
  const {
    machines,
    highScores,
    avatars,
    loading,
    loadingScores,
    error,
    fetchHighScores,
    newScoreIds,
    newScoreNotification,
    setNewScoreNotification,
    setNewScoreIds,
  } = useMachinesData();

  // Listen for URL changes
  useEffect(() => {
    const handlePopState = () => {
      setQueryParams(getQueryParams());
    };

    const handleUrlChange = () => {
      setQueryParams(getQueryParams());
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('urlchange', handleUrlChange);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('urlchange', handleUrlChange);
    };
  }, []);

  // Debug: log main data props
  console.log({ machines, highScores, avatars, loading, error });

  // If we're in fullscreen mode and have a machine ID
  if (queryParams.fullscreen && queryParams.machineId) {
    if (loading) {
      return <Loader />;
    }
    if (error) {
      return <ErrorMessage message={error} />;
    }

    // Convert machineId to both string and number for comparison
    const machineIdStr = queryParams.machineId;
    const machineIdNum = parseInt(queryParams.machineId, 10);

    const machine = machines.find(m =>
      m.id === machineIdStr ||
      m.id === machineIdNum ||
      String(m.id) === machineIdStr,
    );

    if (!machine) {
      // Show available machine IDs for debugging
      const availableIds = machines.map(m => `${m.id} (${typeof m.id})`).join(', ');
      return (
        <ErrorMessage
          message={`Machine with ID "${queryParams.machineId}" not found. Available machine IDs: ${availableIds}`}
        />
      );
    }

    return (
      <FullscreenMachine
        machine={machine}
        highScores={highScores}
        loadingScores={loadingScores}
        avatars={avatars}
        onFetchHighScores={fetchHighScores}
        newScoreIds={newScoreIds[machine.id] || []}
      />
    );
  }

  // Default view - show all machines
  return (
    <div className="App">
      <MachinesPage
        machines={machines}
        highScores={highScores}
        avatars={avatars}
        loading={loading}
        loadingScores={loadingScores}
        error={error}
        fetchHighScores={fetchHighScores}
        newScoreIds={newScoreIds}
        newScoreNotification={newScoreNotification}
        setNewScoreNotification={setNewScoreNotification}
        setNewScoreIds={setNewScoreIds}
      />
    </div>
  );
}

export default App;