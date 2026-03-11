# Creatorverse

Creatorverse is a single-page web app for creators to:

- Upload content entries to a local library
- Schedule posts
- View simple dashboard stats
- Connect platform accounts and verify connection status
- Sign up, verify email, and securely log in before protected tool access

The public site is served from [index.html](index.html) using GitHub Pages.

## Live URL

[https://aleenandrews7-cmd.github.io/creatorverse/](https://aleenandrews7-cmd.github.io/creatorverse/)

## Project Structure

- [index.html](index.html): Website source (HTML, CSS, and JavaScript)
- [README.md](README.md): Project documentation
- [.github/workflows/jekyll-gh-pages.yml](.github/workflows/jekyll-gh-pages.yml): GitHub Pages deployment workflow

## Local Preview

Open [index.html](index.html) directly in your browser, or run a simple local server:

```bash
python3 -m http.server 8080
```

Then visit:

```text
http://localhost:8080
```

## Platform Connection Status

## Authentication and Security

Creatorverse now includes a secure authentication system for protected tools:

- Sign Up with email and password
- Login and Logout with cookie-based sessions
- Password hashing (PBKDF2 with random salt)
- Email verification flow
- Forgot/Reset password flow
- Optional social login (`Google`, `GitHub`) in demo mode
- Optional 2FA step for account login
- Persistent account and user-content storage in `backend/data/store.json`
- Rate limiting and temporary login lockout after repeated failed attempts

Protected sections:

- Dashboard
- Upload
- Scheduler
- Library
- CreatorCast collaboration

The header now shows `Login` and `Sign Up` actions for guests, then a signed-in profile state with `Notifications`, `Settings`, and `Logout`.

After successful login, users are redirected to the Dashboard.

In the Connections tab:

- Each platform has a status pill: Connected or Not connected
- Source shows whether the state came from API verification, OAuth callback, or manual/demo mode
- Last check shows when status was last confirmed
- Verify checks `GET /oauth/{platformSlug}/status` on your backend (expects JSON like `{ "connected": true }`)

If Backend base URL is empty, the site stays in demo/manual mode.

In the Dashboard tab:

- Click Load Analytics to fetch content metrics from connected platforms
- You will see per-content views, likes, comments, shares, and engagement rate
- The dashboard also shows a quick analysis summary: best platform and top content

When you upload content from Creatorverse while a platform is connected, the app also syncs that content to backend platform records so analytics can report metrics for those exact uploaded items.

## Run OAuth Demo Backend (Included)

This repo now includes a local backend at [backend/server.js](backend/server.js) with:

- `POST /auth/signup`
- `POST /auth/login`
- `POST /auth/login/2fa`
- `POST /auth/logout`
- `POST /auth/logout-all`
- `GET /auth/me`
- `POST /auth/verify-email`
- `POST /auth/resend-verification`
- `POST /auth/forgot-password`
- `POST /auth/reset-password`
- `POST /auth/2fa/enable`
- `POST /auth/2fa/disable`
- `GET /auth/csrf`
- `GET /auth/social/:provider/start`
- `GET /auth/social/:provider/callback`

- `GET /oauth/:platformSlug/start`
- `GET /oauth/:platformSlug/status`
- `POST /oauth/:platformSlug/disconnect`
- `POST /content/:platformSlug`
- `GET /analytics/:platformSlug/content`
- `GET /admin/audit?limit=100` (admin only)

Notes:

- `oauth`, `content`, and `analytics` endpoints now require authenticated, verified users.
- In local/demo mode, verification/reset/2FA codes can be returned in API responses.

Security defaults:

- Auth burst limiter is enabled for signup/login/reset endpoints.
- Login lockout triggers after repeated failed attempts for the same email + IP pair.
- Security headers are enabled (`X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`).
- CSRF protection is enabled for mutating endpoints (double-submit cookie + `X-CSRF-Token` header).
- Backend writes structured auth/security audit events to `backend/logs/audit.log` (auto-rotates at ~1MB).
- In production (`NODE_ENV=production`), session and CSRF cookies are set with `Secure=true`.

Email delivery:

- If SMTP is configured, verification/reset emails are sent through SMTP.
- Without SMTP config, backend falls back to console logging and (outside strict production) token previews.

### Start backend

```bash
cd backend
npm install
npm start
```

Defaults:

- Backend URL: `http://localhost:8787`
- Allowed frontend origin (CORS credentials): `http://localhost:8080`

Optional environment variables:

```bash
PORT=8787 FRONTEND_ORIGIN=http://localhost:8080 npm start
```

Additional auth/security environment variables:

```bash
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-user
SMTP_PASS=your-password
SMTP_FROM=no-reply@creatorverse.ai
ALLOW_TOKEN_PREVIEW=true
NODE_ENV=production
TRUST_PROXY=true
ADMIN_EMAILS=admin1@example.com,admin2@example.com
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_CALLBACK_URL=http://localhost:8787/auth/social/google/callback
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...
GITHUB_CALLBACK_URL=http://localhost:8787/auth/social/github/callback
```

Social login behavior:

- If provider credentials are configured, Creatorverse uses real OAuth callback exchanges for Google/GitHub.
- If provider credentials are not configured, it falls back to demo social login mode.

### Connect website to backend

1. Run the website locally on `http://localhost:8080`
2. Open Connections in the UI
3. Set Backend base URL to `http://localhost:8787`
4. Click Save OAuth Settings
5. Use Connect via OAuth, Verify, and Disconnect

The dashboard now includes a Connected Platforms card that updates live.

## Deploy to GitHub Pages

This repository is configured to deploy automatically on pushes to `main` via GitHub Actions.

1. Commit your changes:

```bash
git add .
git commit -m "Update site"
```

2. Push to GitHub:

```bash
git push origin main
```

3. Confirm deployment in the Actions tab and open the live URL.

## Notes

- For project Pages sites, the homepage file should be named `index.html` at the published root.
- A bare request to `/creatorverse` may redirect to `/creatorverse/`; this is expected.
- Only use a `CNAME` file if the custom domain is valid and DNS is configured for GitHub Pages; otherwise remove `CNAME` to keep the default GitHub Pages URL working.