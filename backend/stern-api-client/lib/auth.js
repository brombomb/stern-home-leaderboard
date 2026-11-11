const crypto = require('crypto');
const { URL, URLSearchParams } = require('url');

const PROJECT_ID = 'P3HEU9eRz5zrjI8c28n88adIDzyI';
const AUTH_HOST = 'https://auth.sternpinball.com';
const REDIRECT_URI = 'https://insider.sternpinball.com/auth/callback';
const DEFAULT_USER_AGENT =
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36';
const DEFAULT_AUTH_EXPIRY_MS = 30 * 60 * 1000; // 30 minutes

class SternAuthSession {
  /**
   * @param {Object} [options]
   * @param {string} [options.username] - Stern account email address
   * @param {string} [options.password] - Stern account password
   * @param {number} [options.expiryTimeMs]
   */
  constructor(options = {}) {
    this.username = options.username || null;
    this.password = options.password || null;
    this.expiryTimeMs = options.expiryTimeMs || DEFAULT_AUTH_EXPIRY_MS;

    this.token = null;
    this.refreshToken = null;
    this.cookies = null;
    this.lastAuthTime = null;
    this.expiresAt = null;
  }

  /**
   * Perform authentication using pure HTTP Descope OIDC flow with PKCE S256.
   * @param {string} [username]
   * @param {string} [password]
   * @returns {Promise<{ success: boolean, token?: string, refreshToken?: string, cookies?: string, error?: string }>}
   */
  async login(username = this.username, password = this.password) {
    if (!username || !password) {
      return { success: false, error: 'Username (email) and password are required' };
    }

    this.username = username;
    this.password = password;

    try {
      const verifier = crypto.randomBytes(32).toString('base64url');
      const challenge = crypto.createHash('sha256').update(verifier).digest('base64url');
      const state = crypto.randomBytes(16).toString('hex');

      // 1. Authorize (PKCE S256)
      const authUrl = `${AUTH_HOST}/oauth2/v1/${PROJECT_ID}/authorize?client_id=${PROJECT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=openid&state=${state}&code_challenge=${challenge}&code_challenge_method=S256&flow=prd-sign-in-or-up`;
      const resAuth = await fetch(authUrl, {
        headers: { 'User-Agent': DEFAULT_USER_AGENT },
        redirect: 'manual',
      });

      const loc = resAuth.headers.get('location');
      if (!loc) {
        throw new Error('Descope authorize did not return redirect location');
      }
      const stateId = new URL(loc).searchParams.get('state_id');
      if (!stateId) {
        throw new Error('Descope authorize did not return state_id in redirect location');
      }

      let cookies = '';
      if (typeof resAuth.headers.getSetCookie === 'function') {
        cookies = resAuth.headers.getSetCookie().join('; ');
      } else {
        cookies = resAuth.headers.get('set-cookie') || '';
      }

      // 2. Flow Start
      const startRes = await fetch(`${AUTH_HOST}/v1/flow/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${PROJECT_ID}`,
          'x-descope-project-id': PROJECT_ID,
          'x-descope-auth-hosting': '1',
          Referer: loc,
          'User-Agent': DEFAULT_USER_AGENT,
          ...(cookies ? { Cookie: cookies } : {}),
        },
        body: JSON.stringify({
          flowId: 'prd-sign-in-or-up',
          options: {
            baseUrl: AUTH_HOST,
            oidcIdpStateId: stateId,
            ssoAppId: 'descope-default-oidc',
            oidcErrorRedirectUri: REDIRECT_URI,
          },
          flowVersions: {
            'prd-sign-in-or-up': 3,
          },
          componentsVersion: '3.27.2',
          input: { origin: AUTH_HOST },
        }),
      });

      if (!startRes.ok) {
        const errText = await startRes.text();
        throw new Error(`Descope flow start failed (${startRes.status}): ${errText}`);
      }

      const startData = await startRes.json();
      const executionId = startData.executionId;
      const nonce = startRes.headers.get('x-descope-flow-nonce');

      if (typeof startRes.headers.getSetCookie === 'function' && startRes.headers.getSetCookie().length > 0) {
        cookies = startRes.headers.getSetCookie().join('; ');
      } else if (startRes.headers.get('set-cookie')) {
        cookies = startRes.headers.get('set-cookie');
      }

      // 3. Flow Next (Submit Credentials)
      const nextRes = await fetch(`${AUTH_HOST}/v1/flow/next`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${PROJECT_ID}`,
          'x-descope-project-id': PROJECT_ID,
          'x-descope-auth-hosting': '1',
          Referer: loc,
          'User-Agent': DEFAULT_USER_AGENT,
          ...(nonce ? { 'x-descope-flow-nonce': nonce } : {}),
          ...(cookies ? { Cookie: cookies } : {}),
        },
        body: JSON.stringify({
          executionId,
          stepId: '1',
          interactionId: 'AMeyg_7npF',
          version: 3,
          componentsVersion: '3.27.2',
          input: {
            email: username,
            password,
            origin: AUTH_HOST,
          },
        }),
      });

      const nextData = await nextRes.json();
      if (nextData.error || !nextRes.ok) {
        const errorMsg =
          nextData.screen?.state?.errorText ||
          nextData.error?.message ||
          nextData.error?.description ||
          'Login failed';
        if (!username.includes('@')) {
          throw new Error(`Stern Insider login requires your account email address instead of username. (${errorMsg})`);
        }
        throw new Error(errorMsg);
      }

      const redirectUrl = nextData?.redirect?.url;
      if (!redirectUrl) {
        throw new Error('Descope flow did not return redirect URL');
      }

      const code = new URL(redirectUrl).searchParams.get('code');
      if (!code) {
        throw new Error('No authorization code found in Descope redirect URL');
      }

      // 4. Token Exchange
      const tokenRes = await fetch(`${AUTH_HOST}/oauth2/v1/${PROJECT_ID}/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': DEFAULT_USER_AGENT,
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          client_id: PROJECT_ID,
          redirect_uri: REDIRECT_URI,
          code,
          code_verifier: verifier,
        }),
      });

      if (!tokenRes.ok) {
        const tokenErr = await tokenRes.text();
        throw new Error(`Token exchange failed (${tokenRes.status}): ${tokenErr}`);
      }

      const tokenData = await tokenRes.json();
      if (!tokenData.access_token) {
        throw new Error('No access token returned from Descope token endpoint');
      }

      this.token = tokenData.access_token;
      this.refreshToken = tokenData.refresh_token || null;
      this.cookies = `spb-insider-token=${this.token}`;
      this.lastAuthTime = Date.now();
      const expiresInSec = tokenData.expires_in || 3600;
      this.expiresAt = Date.now() + (expiresInSec - 60) * 1000;

      return {
        success: true,
        token: this.token,
        refreshToken: this.refreshToken,
        cookies: this.cookies,
      };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  /**
   * Fast refresh using OAuth 2.0 refresh_token grant (~100ms).
   * Falls back to full login if refresh fails or no refresh token exists.
   */
  async refresh() {
    if (!this.refreshToken) {
      return this.login();
    }

    try {
      const tokenUrl = `${AUTH_HOST}/oauth2/v1/${PROJECT_ID}/token`;
      const rep = await fetch(tokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': DEFAULT_USER_AGENT,
        },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          client_id: PROJECT_ID,
          refresh_token: this.refreshToken,
        }),
      });

      if (!rep.ok) {
        return this.login();
      }

      const data = await rep.json();
      if (!data.access_token) {
        return this.login();
      }

      this.token = data.access_token;
      if (data.refresh_token) {
        this.refreshToken = data.refresh_token;
      }
      this.cookies = `spb-insider-token=${this.token}`;
      this.lastAuthTime = Date.now();
      const expiresInSec = data.expires_in || 3600;
      this.expiresAt = Date.now() + (expiresInSec - 60) * 1000;

      return {
        success: true,
        token: this.token,
        refreshToken: this.refreshToken,
        cookies: this.cookies,
      };
    } catch {
      return this.login();
    }
  }

  /**
   * Check if current session has expired
   * @returns {boolean}
   */
  isExpired() {
    if (!this.token) {
      return true;
    }
    if (this.expiresAt && Date.now() >= this.expiresAt) {
      return true;
    }
    if (!this.lastAuthTime) {
      return true;
    }
    return Date.now() - this.lastAuthTime > this.expiryTimeMs;
  }

  /**
   * Ensure auth session is valid, refreshing if expired
   * @param {string} [username]
   * @param {string} [password]
   * @returns {Promise<boolean>}
   */
  async ensureValidAuth(username = this.username, password = this.password) {
    if (this.isExpired()) {
      if (this.refreshToken) {
        const res = await this.refresh();
        if (res.success) {
          return true;
        }
      }
      const res = await this.login(username, password);
      return res.success;
    }
    return true;
  }
}

module.exports = {
  SternAuthSession,
  PROJECT_ID,
  AUTH_HOST,
  REDIRECT_URI,
};
