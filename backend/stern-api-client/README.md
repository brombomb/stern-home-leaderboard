# Stern API Client

A robust, standardized Node.js library for handling authentication, API requests, and QR code generation for Stern Pinball Insider Connected.

## Features
- **Pure HTTP Descope OIDC Authentication**: Fully automated OAuth 2.0 PKCE (`S256`) flow via Descope (`auth.sternpinball.com`), zero browser or scraper required.
- **Sub-100ms Token Refresh**: Standard OAuth 2.0 `refresh_token` grant keeps sessions active indefinitely with minimal latency.
- **Stern API Client**: Convenience methods for `/user_registered_machines/`, `/game_machine_high_scores/`, `/game_teams/`, `/user_title_stats/`, etc., with automatic retry on 401.
- **Direct QR Extraction**: Extracts `qr_code_encoded_str` (`WRAP64:...`) directly from the Stern user profile API without scraping `/account` or triggering MFA OTP.

## Usage

```js
const { SternAuthSession, SternApiClient, getQRCode } = require('stern-api-client');

// 1. Authenticate user credentials (requires Stern account email)
const session = new SternAuthSession();
const authResult = await session.login('user@example.com', 'password');

if (authResult.success) {
  // 2. Make API calls using authenticated client
  const client = new SternApiClient(session);
  const machines = await client.getMachines('home');
  console.log('User machines:', machines);

  // 3. Fast token refresh (<100ms)
  await session.refresh();

  // 4. Extract QR code
  const qr = await getQRCode('user@example.com', 'password', { authSession: session });
  console.log('QR Code String:', qr.qrText);
}
```
