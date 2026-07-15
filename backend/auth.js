const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

class SternAuth {
  static authData = null;
  static cookies = null;
  static lastAuthTime = null;
  static AUTH_EXPIRY_TIME = 30 * 60 * 1000; // 30 minutes

  static HASH_CACHE_FILE = path.join(__dirname, 'next_action_hash.txt');
  static DEFAULT_HASH = '608b67b68d769e8f354b1e1998bdd4cc5108667025';
  static cachedHash = null;

  static async getCachedHash() {
    if (this.cachedHash) {
      return this.cachedHash;
    }
    try {
      const hash = (await fs.promises.readFile(this.HASH_CACHE_FILE, 'utf8')).trim();
      if (hash && /^[a-f0-9]{40,}$/.test(hash)) {
        this.cachedHash = hash;
        console.log('Loaded Next-Action hash from persistent cache:', hash);
        return hash;
      }
    } catch (err) {
      if (err.code !== 'ENOENT') {
        console.warn('Failed to read Next-Action hash cache file:', err.message);
      }
    }

    return null;
  }

  static async saveCachedHash(hash) {
    if (!hash || !/^[a-f0-9]{40,}$/.test(hash)) {
      return;
    }
    this.cachedHash = hash;
    try {
      await fs.promises.writeFile(this.HASH_CACHE_FILE, hash, 'utf8');
      console.log('Saved Next-Action hash to persistent cache:', hash);
    } catch (err) {
      console.warn('Failed to write Next-Action hash cache file:', err.message);
    }
  }

  static async getNextActionHash() {
    try {
      console.log('Scraping Next-Action hash from login page...');
      const pageResponse = await fetch(
        'https://insider.sternpinball.com/login',
        {
          headers: {
            'User-Agent':
              'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:142.0) Gecko/20100101 Firefox/142.0',
          },
        },
      );

      if (!pageResponse.ok) {
        throw new Error(`Failed to fetch login page: status ${pageResponse.status}`);
      }

      const html = await pageResponse.text();
      const $ = cheerio.load(html);

      const scriptUrls = [];

      // Extract script tags
      $('script[src]').each((i, el) => {
        const src = $(el).attr('src');
        if (src) {
          scriptUrls.push(src.startsWith('http') ? src : `https://insider.sternpinball.com${src}`);
        }
      });

      // Extract preloaded script links
      $('link[rel="preload"][as="script"]').each((i, el) => {
        const href = $(el).attr('href');
        if (href) {
          scriptUrls.push(href.startsWith('http') ? href : `https://insider.sternpinball.com${href}`);
        }
      });

      if (scriptUrls.length === 0) {
        throw new Error('No script URLs found on the login page');
      }

      // Fetch scripts and search for performLogin
      const uniqueScriptUrls = [...new Set(scriptUrls)];
      const promises = uniqueScriptUrls.map(async (url) => {
        try {
          const jsResponse = await fetch(url);
          if (!jsResponse.ok) {
            return null;
          }
          const js = await jsResponse.text();

          const target = 'performLogin';
          const idx = js.indexOf(target);
          if (idx !== -1) {
            // Get a wider window around the target
            const start = Math.max(0, idx - 500);
            const end = Math.min(js.length, idx + 500);
            const windowText = js.substring(start, end);

            // Search for 40+ hex characters in single or double quotes
            const hashMatch = windowText.match(/["']([a-f0-9]{40,})["']/);
            if (hashMatch) {
              return hashMatch[1];
            }

            // Loose fallback match
            const looseMatch = windowText.match(/\b([a-f0-9]{40,})\b/);
            if (looseMatch) {
              return looseMatch[1];
            }
          }
        } catch {
          // Ignore individual fetch errors
        }
        return null;
      });

      const results = await Promise.all(promises);
      const hash = results.find((h) => h !== null);

      if (hash) {
        console.log('Discovered Next-Action hash:', hash);
        this.saveCachedHash(hash);
        return hash;
      }

      throw new Error('Could not find performLogin Next-Action hash in any JS bundles');
    } catch (err) {
      console.error('Hash discovery failed:', err.message);
      throw err;
    }
  }

  static async login(username, password, forceRefreshHash = false) {
    try {
      let nextActionHash;

      if (forceRefreshHash) {
        // Force dynamic fetch
        nextActionHash = await this.getNextActionHash();
      } else {
        // Try getting cached hash first
        nextActionHash = await this.getCachedHash();
      }

      // Send login data as JSON array like the browser does
      const loginData = [username, password];

      // Submit login form with exact headers from HAR file
      const loginResponse = await fetch(
        'https://insider.sternpinball.com/login',
        {
          method: 'POST',
          headers: {
            'User-Agent':
              'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:142.0) Gecko/20100101 Firefox/142.0',
            Accept: 'text/x-component',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate, br, zstd',
            Referer: 'https://insider.sternpinball.com/login',
            'Next-Action': nextActionHash,
            'Next-Router-State-Tree':
              '%5B%22%22%2C%7B%22children%22%3A%5B%22login%22%2C%7B%22children%22%3A%5B%22__PAGE__%22%2C%7B%7D%2C%22%2Flogin%22%2C%22refresh%22%5D%7D%5D%7D%2Cnull%2Cnull%2Ctrue%5D',
            'Content-Type': 'text/plain;charset=UTF-8',
            Origin: 'https://insider.sternpinball.com',
            DNT: '1',
            'Sec-GPC': '1',
            Connection: 'keep-alive',
            'Sec-Fetch-Dest': 'empty',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Site': 'same-origin',
            Pragma: 'no-cache',
            'Cache-Control': 'no-cache',
          },
          body: JSON.stringify(loginData),
          redirect: 'manual',
        },
      );

      // Extract cookies and check for JWT token
      const cookies = loginResponse.headers.get('set-cookie');

      // Look for spb-insider-token in cookies
      let token = null;
      if (cookies) {
        const tokenMatch = cookies.match(/spb-insider-token=([^;]+)/);
        if (tokenMatch) {
          token = tokenMatch[1];
        }
      }

      // Get response body
      const responseText = await loginResponse.text();

      const authData = {};
      if (token) {
        authData.token = token;
      }

      // Parse the response to check authentication status
      let authenticationSuccessful = false;
      try {
        // The response seems to be in a special format, let's try to extract JSON
        const lines = responseText.split('\n');
        for (const line of lines) {
          if (line.includes('"authenticated"')) {
            const jsonMatch = line.match(/\{.*\}/);
            if (jsonMatch) {
              const authResult = JSON.parse(jsonMatch[0]);
              authenticationSuccessful = authResult.authenticated === true;
              break;
            }
          }
        }
      } catch {
        // Could not parse authentication result, continue with token check
      }

      // Check login success
      if (loginResponse.status === 200 && (authenticationSuccessful || token)) {
        // Store auth data globally
        SternAuth.authData = authData;
        SternAuth.cookies = cookies || '';
        SternAuth.lastAuthTime = Date.now();

        // Save the successful hash to the persistent cache
        await this.saveCachedHash(nextActionHash);

        return { success: true, authData, cookies };
      } else {
        if (!forceRefreshHash) {
          console.warn('Login failed with cached Next-Action hash. Attempting autoheal by fetching latest hash...');
          try {
            return await this.login(username, password, true);
          } catch (retryErr) {
            console.error('Autoheal login retry failed:', retryErr.message);
          }
        }
        return {
          success: false,
          error: 'Login failed - authentication unsuccessful',
        };
      }
    } catch (err) {
      console.error('Login error:', err);
      if (!forceRefreshHash) {
        console.warn('Login encountered error with cached hash. Attempting autoheal by fetching latest hash...');
        try {
          return await this.login(username, password, true);
        } catch (retryErr) {
          console.error('Autoheal login retry failed:', retryErr.message);
        }
      }
      return { success: false, error: err.message };
    }
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

    const result = await this.login(username, password);

    if (!result.success) {
      console.warn('Failed to authenticate on startup:', result.error);
      console.warn(
        'Server will continue but API calls may fail until authentication succeeds',
      );
      // Don't exit, just continue - authentication will be retried on first API call
      return { success: false, error: result.error };
    }

    return result;
  }

  static isAuthExpired() {
    if (!SternAuth.lastAuthTime) {
      return true;
    }
    return Date.now() - SternAuth.lastAuthTime > SternAuth.AUTH_EXPIRY_TIME;
  }

  static async refreshAuth() {
    console.log('Attempting authentication refresh...');
    const username = process.env.STERN_USERNAME;
    const password = process.env.STERN_PASSWORD;

    const result = await this.login(username, password);

    if (result.success) {
      console.log('Authentication refresh successful');
      return true;
    } else {
      console.error('Failed to refresh authentication:', result.error);
      return false;
    }
  }

  static async requireAuth(req, res, next) {
    // Check if we have auth data and if it's still valid
    if (
      !SternAuth.authData ||
      !SternAuth.cookies ||
      SternAuth.isAuthExpired()
    ) {
      const refreshed = await SternAuth.refreshAuth();
      if (!refreshed) {
        return res
          .status(401)
          .json({ error: 'Authentication failed and could not be refreshed' });
      }
    }

    // Set auth data for this request
    req.authData = SternAuth.authData;
    req.cookies = SternAuth.cookies;
    next();
  }
}

module.exports = SternAuth;
