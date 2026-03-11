const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = process.env.PORT || 8787;
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:8080';

const allowedSlugs = new Set([
  'youtube',
  'instagram',
  'tiktok',
  'facebook',
  'x',
  'twitch',
  'kick',
  'youtube-gaming'
]);

const contentStore = {};

app.use(cors({
  origin: FRONTEND_ORIGIN,
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

function cookieKey(slug) {
  return `creatorverse_${slug}_connected`;
}

function isKnownSlug(slug) {
  return allowedSlugs.has(slug);
}

function isConnected(req, slug) {
  return req.cookies[cookieKey(slug)] === '1';
}

function getContentList(slug) {
  if (!contentStore[slug]) {
    contentStore[slug] = [];
  }
  return contentStore[slug];
}

function buildMetricsFromTitle(title, seedOffset) {
  const seed = title.length * 97 + seedOffset;
  const views = 500 + (seed % 4500);
  const likes = Math.max(20, Math.floor(views * (0.04 + (seed % 7) / 100)));
  const comments = Math.max(5, Math.floor(views * (0.01 + (seed % 3) / 100)));
  const shares = Math.max(2, Math.floor(views * (0.005 + (seed % 2) / 100)));
  return { views, likes, comments, shares };
}

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

app.get('/oauth/:platformSlug/start', (req, res) => {
  const { platformSlug } = req.params;
  const redirectUri = req.query.redirect_uri;

  if (!isKnownSlug(platformSlug)) {
    res.status(404).json({ error: 'Unsupported platform slug' });
    return;
  }

  if (!redirectUri || typeof redirectUri !== 'string') {
    res.status(400).json({ error: 'Missing redirect_uri query parameter' });
    return;
  }

  res.cookie(cookieKey(platformSlug), '1', {
    httpOnly: true,
    sameSite: 'lax',
    secure: false,
    path: '/'
  });

  const separator = redirectUri.includes('?') ? '&' : '?';
  const destination = `${redirectUri}${separator}connected=${encodeURIComponent(platformSlug)}&oauth=success`;
  res.redirect(destination);
});

app.get('/oauth/:platformSlug/status', (req, res) => {
  const { platformSlug } = req.params;

  if (!isKnownSlug(platformSlug)) {
    res.status(404).json({ error: 'Unsupported platform slug' });
    return;
  }

  res.json({
    platform: platformSlug,
    connected: isConnected(req, platformSlug)
  });
});

app.post('/oauth/:platformSlug/disconnect', (req, res) => {
  const { platformSlug } = req.params;

  if (!isKnownSlug(platformSlug)) {
    res.status(404).json({ error: 'Unsupported platform slug' });
    return;
  }

  res.clearCookie(cookieKey(platformSlug), {
    httpOnly: true,
    sameSite: 'lax',
    secure: false,
    path: '/'
  });

  res.json({
    platform: platformSlug,
    connected: false
  });
});

app.post('/content/:platformSlug', (req, res) => {
  const { platformSlug } = req.params;
  const title = typeof req.body?.title === 'string' ? req.body.title.trim() : '';
  const description = typeof req.body?.description === 'string' ? req.body.description.trim() : '';

  if (!isKnownSlug(platformSlug)) {
    res.status(404).json({ error: 'Unsupported platform slug' });
    return;
  }

  if (!isConnected(req, platformSlug)) {
    res.status(403).json({ error: 'Platform is not connected' });
    return;
  }

  if (!title) {
    res.status(400).json({ error: 'Missing content title' });
    return;
  }

  const list = getContentList(platformSlug);
  const id = `${platformSlug}-${Date.now()}-${list.length + 1}`;
  const item = {
    id,
    title,
    description,
    createdAt: new Date().toISOString()
  };

  list.push(item);
  res.status(201).json({
    platform: platformSlug,
    item
  });
});

app.get('/analytics/:platformSlug/content', (req, res) => {
  const { platformSlug } = req.params;

  if (!isKnownSlug(platformSlug)) {
    res.status(404).json({ error: 'Unsupported platform slug' });
    return;
  }

  if (!isConnected(req, platformSlug)) {
    res.status(403).json({ error: 'Platform is not connected' });
    return;
  }

  const items = getContentList(platformSlug).map((item, index) => ({
    id: item.id,
    title: item.title,
    description: item.description,
    createdAt: item.createdAt,
    ...buildMetricsFromTitle(item.title, index * 223)
  }));

  res.json({
    platform: platformSlug,
    items
  });
});

app.listen(PORT, () => {
  console.log(`Creatorverse OAuth demo backend listening on http://localhost:${PORT}`);
  console.log(`CORS origin: ${FRONTEND_ORIGIN}`);
});
