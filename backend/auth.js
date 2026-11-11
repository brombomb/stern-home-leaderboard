const { SternAuthSession } = require('./stern-api-client');

class SternAuth {
  static session = new SternAuthSession();

  static get authData() {
    return { token: SternAuth.session.token };
  }

  static get cookies() {
    return SternAuth.session.cookies;
  }

  static isAuthExpired() {
    return SternAuth.session.isExpired();
  }

  static async login(username, password) {
    const result = await SternAuth.session.login(username, password);
    if (result.success) {
      return {
        success: true,
        authData: { token: SternAuth.session.token },
        cookies: SternAuth.session.cookies,
      };
    }
    return result;
  }

  static async initializeAuth() {
    const username = process.env.STERN_USERNAME;
    const password = process.env.STERN_PASSWORD;

    if (!username || !password) {
      console.error(
        'STERN_USERNAME and STERN_PASSWORD environment variables are required',
      );
      // eslint-disable-next-line no-process-exit
      process.exit(1);
    }

    const result = await SternAuth.login(username, password);

    if (!result.success) {
      console.warn('Failed to authenticate on startup:', result.error);
      console.warn(
        'Server will continue but API calls may fail until authentication succeeds',
      );
      return { success: false, error: result.error };
    }

    console.log('Successfully authenticated with Stern Insider Connected via Descope OIDC');
    return result;
  }

  static async refreshAuth() {
    console.log('Attempting authentication refresh...');
    const result = await SternAuth.session.refresh();

    if (result.success) {
      console.log('Authentication refresh successful');
      return true;
    } else {
      console.error('Failed to refresh authentication:', result.error);
      return false;
    }
  }

  static async requireAuth(req, res, next) {
    if (
      !SternAuth.session.token ||
      SternAuth.isAuthExpired()
    ) {
      const refreshed = await SternAuth.refreshAuth();
      if (!refreshed) {
        return res
          .status(401)
          .json({ error: 'Authentication failed and could not be refreshed' });
      }
    }

    req.authData = SternAuth.authData;
    req.cookies = SternAuth.cookies;
    next();
  }
}

module.exports = SternAuth;
