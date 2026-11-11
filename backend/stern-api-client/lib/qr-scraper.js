const { SternAuthSession } = require('./auth');

const USER_AGENT =
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36';

/**
 * Retrieve the Stern Insider Connected QR code string and optional Data URL
 * using pure HTTP Descope OIDC authentication and direct profile extraction.
 *
 * @param {string} username - Stern account email address
 * @param {string} password - Stern account password
 * @param {Object} [options]
 * @param {SternAuthSession} [options.authSession]
 * @param {number} [options.width=512]
 * @param {number} [options.margin=1]
 * @returns {Promise<{ success: boolean, qrText?: string, src?: string, profile?: Object, error?: string }>}
 */
async function getQRCode(username, password, options = {}) {
  if (!username || !password) {
    return { success: false, error: 'Username (email) and password are required' };
  }

  try {
    const session = options.authSession || new SternAuthSession();
    if (!session.token || session.isExpired()) {
      const loginRes = await session.login(username, password);
      if (!loginRes.success) {
        return { success: false, error: loginRes.error };
      }
    }

    const res = await fetch('https://api.prd.sternpinball.io/api/v2/portal/user_detail/', {
      headers: {
        Authorization: `Bearer ${session.token}`,
        'User-Agent': USER_AGENT,
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch user details (Status ${res.status})`);
    }

    const userData = await res.json();
    const qrText = userData.user?.profile?.qr_code_encoded_str;
    if (!qrText) {
      throw new Error('No qr_code_encoded_str found in user profile');
    }

    let dataUri = null;
    try {
      const qrcode = require('qrcode');
      dataUri = await qrcode.toDataURL(qrText, {
        width: options.width || 512,
        margin: options.margin !== undefined ? options.margin : 1,
      });
    } catch {
      // qrcode package is optional
    }

    return {
      success: true,
      qrText,
      src: dataUri,
      profile: {
        username: userData.user?.username,
        initials: userData.user?.profile?.initials,
        avatarUrl: userData.user?.profile?.avatar_url,
        backgroundColorHex: userData.user?.profile?.background_color_hex,
      },
    };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

module.exports = {
  getQRCode,
};
