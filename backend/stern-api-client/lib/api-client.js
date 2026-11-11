const { SternAuthSession } = require('./auth');

const API_BASE_URL = 'https://cms.prd.sternpinball.io/api/v1/portal';
const GAME_TEAMS_API_URL = 'https://api.prd.sternpinball.io/api/v1/portal';

const DEFAULT_USER_AGENT =
  'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:142.0) Gecko/20100101 Firefox/142.0';

class SternApiClient {
  /**
   * @param {SternAuthSession} [authSession]
   */
  constructor(authSession = new SternAuthSession()) {
    this.authSession = authSession;
  }

  /**
   * Helper to build request headers
   */
  _buildHeaders() {
    const headers = {
      'User-Agent': DEFAULT_USER_AGENT,
      Accept: 'application/json, text/plain, */*',
      'Accept-Language': 'en-US,en;q=0.5',
      Referer: 'https://insider.sternpinball.com/',
      'Content-Type': 'application/json',
      Origin: 'https://insider.sternpinball.com',
    };

    if (this.authSession.cookies) {
      headers['Cookie'] = this.authSession.cookies;
    }

    if (this.authSession.token) {
      headers['Authorization'] = `Bearer ${this.authSession.token}`;
    }

    return headers;
  }

  /**
   * Wrapper for making authenticated HTTP requests with auto-reauth retry logic.
   */
  async _request(url, options = {}, retries = 1) {
    await this.authSession.ensureValidAuth();

    const fetchOptions = {
      ...options,
      headers: {
        ...this._buildHeaders(),
        ...options.headers,
      },
    };

    const res = await fetch(url, fetchOptions);

    if ((res.status === 401 || res.status === 403) && retries > 0) {
      console.warn(`Stern API HTTP ${res.status}. Refreshing auth session...`);
      const refreshed = await this.authSession.refresh();
      if (refreshed.success) {
        return this._request(url, options, retries - 1);
      }
    }

    if (!res.ok) {
      const errorText = await res.text().catch(() => res.statusText);
      throw new Error(`Stern API Error ${res.status}: ${errorText}`);
    }

    return res.json();
  }

  /**
   * Get user registered machines (e.g. home pinball machines)
   * @param {string} [groupType='home']
   */
  getMachines(groupType = 'home') {
    const url = `${API_BASE_URL}/user_registered_machines/?group_type=${groupType}`;
    return this._request(url);
  }

  /**
   * Get specific machine details
   * @param {string|number} machineId
   */
  getMachineDetails(machineId) {
    const cleanId = String(machineId).split('.')[0];
    const url = `${API_BASE_URL}/game_machines/${cleanId}`;
    return this._request(url);
  }

  /**
   * Get machine high scores
   * @param {string|number} machineId
   */
  getHighScores(machineId) {
    const cleanId = String(machineId).split('.')[0];
    const url = `${API_BASE_URL}/game_machine_high_scores/?machine_id=${cleanId}`;
    return this._request(url);
  }

  /**
   * Get game teams/avatars for a location
   * @param {string|number} locationId
   */
  getGameTeams(locationId) {
    const url = `${GAME_TEAMS_API_URL}/game_teams/?location_id=${locationId}`;
    return this._request(url);
  }

  /**
   * Get user title statistics
   * @param {string|number} userId
   * @param {string|number} titleId
   */
  getUserTitleStats(userId, titleId) {
    const url = `${GAME_TEAMS_API_URL}/user_title_stats/?user_id=${userId}&title_id=${titleId}`;
    return this._request(url);
  }

  /**
   * Get game titles metadata list
   */
  getGameTitles() {
    const url = `${GAME_TEAMS_API_URL}/game_titles/`;
    return this._request(url);
  }
}

module.exports = {
  SternApiClient,
};
