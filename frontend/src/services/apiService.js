import { API_BASE_URL } from '../config';

class ApiService {
  async makeRequest(url, options = {}) {
    const response = await fetch(url, {
      credentials: 'include',
      ...options
    });

    if (response.status === 403) {
      const reAuthResponse = await fetch(`${API_BASE_URL}/api/reauth`, {
        method: 'POST',
        credentials: 'include'
      });

      if (reAuthResponse.ok) {
        // Retry the original request
        return fetch(url, { credentials: 'include', ...options });
      } else {
        throw new Error('Authentication failed and could not be refreshed');
      }
    }

    return response;
  }

  async fetchMachines() {
    const response = await this.makeRequest(`${API_BASE_URL}/api/machines`);
    if (!response.ok) {
      throw new Error('Failed to fetch machines');
    }
    const data = await response.json();
    return data.user?.machines || [];
  }

  async fetchHighScores(machineId) {
    const response = await this.makeRequest(`${API_BASE_URL}/api/high-scores/${machineId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch high scores');
    }
    return response.json();
  }

  async fetchGameTeams(locationId) {
    const response = await this.makeRequest(`${API_BASE_URL}/api/game-teams/${locationId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch game teams');
    }
    return response.json();
  }
}

export default new ApiService();
