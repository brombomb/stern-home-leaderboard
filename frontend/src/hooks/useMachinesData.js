import { useState, useEffect, useCallback, useRef } from 'react';
import apiService from '../services/apiService';
import { DATA_REFRESH_INTERVAL_MINUTES } from '../config';

export function useMachinesData() {
  const [machines, setMachines] = useState([]);
  const [highScores, setHighScores] = useState({});
  const [avatars, setAvatars] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadingScores, setLoadingScores] = useState({});
  const [error, setError] = useState('');
  const [lastRefresh, setLastRefresh] = useState(null);
  const refreshIntervalRef = useRef(null);

  const fetchHighScores = useCallback(async (machineId) => {
    // Prevent duplicate calls
    if (loadingScores[machineId] || highScores[machineId]) {
      return;
    }

    setLoadingScores(prev => ({ ...prev, [machineId]: true }));
    try {
      const data = await apiService.fetchHighScores(machineId);
      setHighScores(prev => ({ ...prev, [machineId]: data }));
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(`Error fetching high scores for machine ${machineId}:`, err.message);
      setHighScores(prev => ({ ...prev, [machineId]: { error: err.message } }));
    } finally {
      setLoadingScores(prev => ({ ...prev, [machineId]: false }));
    }
  }, [loadingScores, highScores]);

  const fetchAvatars = useCallback(async (locationId) => {
    try {
      const data = await apiService.fetchGameTeams(locationId);

      const avatarMap = {};
      if (data.team && Array.isArray(data.team)) {
        data.team.forEach(member => {
          if (member.username && member.avatar_url) {
            avatarMap[member.username.toLowerCase()] = {
              avatar_url: member.avatar_url,
              background_color: member.background_color,
            };
          }
        });
      }

      setAvatars(avatarMap);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(`Error fetching avatars for location ${locationId}:`, err.message);
      setAvatars({});
    }
  }, []);

  const loadMachines = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const userMachines = await apiService.fetchMachines();
      setMachines(userMachines);
      setLastRefresh(new Date());

      const locationId = userMachines[0]?.address?.location_id;
      if (locationId) {
        fetchAvatars(locationId);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [fetchAvatars]);

  const refreshData = useCallback(async () => {
    // Clear high scores and reload machines
    setHighScores({});
    await loadMachines();
  }, [loadMachines]);

  useEffect(() => {
    // Initial load
    loadMachines();

    // Set up periodic refresh
    const refreshIntervalMs = DATA_REFRESH_INTERVAL_MINUTES * 60 * 1000;
    refreshIntervalRef.current = setInterval(() => {
      refreshData();
    }, refreshIntervalMs);

    // Cleanup interval on unmount
    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, [loadMachines, refreshData]);

  return {
    machines,
    highScores,
    avatars,
    loading,
    loadingScores,
    error,
    fetchHighScores,
    refreshData,
    lastRefresh,
  };
}
