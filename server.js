import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { handleContactRequest } from './dist-server/contact/handler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ?? 80;

app.use(express.json({ limit: '64kb' }));
app.use(express.urlencoded({ extended: true, limit: '64kb' }));

// ── Static files (Astro build) ──────────────────────────────
// extensions: ['html'] — позволяет запросам /about отдавать /about.html
app.use(express.static(path.join(__dirname, 'dist'), { extensions: ['html'] }));

// ── Contact form API ────────────────────────────────────────
app.post('/api/contact', async (req, res) => {
  let payload;
  try {
    payload = typeof req.body === 'object' ? req.body : JSON.parse(req.body);
  } catch {
    res.status(400).json({ ok: false, message: 'Неверный формат запроса' });
    return;
  }

  const result = await handleContactRequest(payload);
  const status = result.ok ? 200 : (result.statusCode ?? 500);
  res.status(status).json(result);
});

// ── 404 — отдаём страницу 404.html если Astro её сгенерировал ──
app.use((_req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'dist', '404.html'), (err) => {
    if (err) res.status(404).send('Not found');
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
