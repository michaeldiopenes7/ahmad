import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import app from './app.js';

const root = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT ?? 4000;

// In production the server also serves the built React app.
if (process.env.NODE_ENV === 'production') {
  const dist = path.join(root, '../../client/dist');
  app.use(express.static(dist));
  app.get('*', (_req, res) => res.sendFile(path.join(dist, 'index.html')));
}

app.listen(PORT, () => console.log(`API on http://localhost:${PORT}`));
