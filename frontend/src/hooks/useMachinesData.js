import { useState, useEffect, useCallback } from 'react';
import apiService from '../services/apiService';

export function useMachinesData() {
  const [machines, setMachines] = useState([]);
  const [highScores, setHighScores] = useState({});
  const [avatars, setAvatars] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadingScores, setLoadingScores] = useState({});
  const [error, setError] = useState('');

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
      console.error(`Error fetching avatars for location ${locationId}:`, err.message);
      setAvatars({});
    }
  }, []);

  useEffect(() => {
    const loadMachines = async () => {
      setLoading(true);
      setError('');
      try {
        const userMachines = await apiService.fetchMachines();
        setMachines(userMachines);

        const locationId = userMachines[0]?.address?.location_id;
        if (locationId) {
          fetchAvatars(locationId);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadMachines();
  }, [fetchAvatars]);

  return {
    machines,
    highScores,
    avatars,
    loading,
    loadingScores,
    error,
    fetchHighScores,
  };
}
