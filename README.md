# Creatorverse

Creatorverse is a single-page web app for creators to:

- Upload content entries to a local library
- Schedule posts
- View simple dashboard stats
- Connect platform accounts and verify connection status

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

- `GET /oauth/:platformSlug/start`
- `GET /oauth/:platformSlug/status`
- `POST /oauth/:platformSlug/disconnect`
- `POST /content/:platformSlug`
- `GET /analytics/:platformSlug/content`

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
