import { API_BASE_URL } from '../config';

class ApiService {
  async makeRequest(url, options = {}, retryCount = 0) {
    const MAX_RETRIES = 2;

    try {
      const response = await fetch(url, {
        credentials: 'include',
        ...options,
      });

      // Handle 401 Unauthorized or 403 Forbidden - likely authentication issue
      if ((response.status === 401 || response.status === 403) && retryCount < MAX_RETRIES) {
        // Try to get error details for better error messages
        let errorDetails = '';
        try {
          errorDetails = await response.clone().text();
        } catch {
          // Ignore error reading response body
        }

        const reAuthResponse = await fetch(`${API_BASE_URL}/api/reauth`, {
          method: 'POST',
          credentials: 'include',
        });

        if (reAuthResponse.ok) {
          // Retry the original request
          return this.makeRequest(url, options, retryCount + 1);
        } else {
          throw new Error(`Authentication failed and could not be refreshed. ${errorDetails ? `Server response: ${errorDetails}` : ''}`);
        }
      }

      // For non-auth errors, include response details in error
      if (!response.ok) {
        let errorDetails = '';
        try {
          errorDetails = await response.clone().text();
        } catch {
          // Ignore error reading response body
        }

        throw new Error(`Request failed with status ${response.status}${errorDetails ? `: ${errorDetails}` : ''}`);
      }

      return response;
    } catch (error) {
      // Re-throw the error with additional context if it's a network error
      if (error.name === 'TypeError' || error.message.includes('fetch')) {
        throw new Error(`Network error: ${error.message}`);
      }
      throw error;
    }
  }

  async fetchMachines() {
    const response = await this.makeRequest(`${API_BASE_URL}/api/machines`);
    const data = await response.json();
    return data.user?.machines || [];
  }

  async fetchHighScores(machineId) {
    const response = await this.makeRequest(`${API_BASE_URL}/api/high-scores/${machineId}`);
    return response.json();
  }

  async fetchGameTeams(locationId) {
    const response = await this.makeRequest(`${API_BASE_URL}/api/game-teams/${locationId}`);
    return response.json();
  }
}

const apiServiceInstance = new ApiService();
export default apiServiceInstance;
