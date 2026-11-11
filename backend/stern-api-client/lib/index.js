const { SternAuthSession, PROJECT_ID, AUTH_HOST, REDIRECT_URI } = require('./auth');
const { SternApiClient } = require('./api-client');
const { getQRCode } = require('./qr-scraper');

// Deprecated stub for backwards compatibility
function getNextActionHash() {
  return Promise.reject(
    new Error('Next-Action hash is deprecated: Stern Pinball migrated to Descope OIDC authentication.'),
  );
}

module.exports = {
  SternAuthSession,
  SternApiClient,
  getQRCode,
  getNextActionHash,
  PROJECT_ID,
  AUTH_HOST,
  REDIRECT_URI,
};
