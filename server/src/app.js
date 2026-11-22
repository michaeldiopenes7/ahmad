import express from 'express';
import { createRequire } from 'node:module';

const app = express();

app.use(express.json());

// Services: same five groups as the Thirdcore site, served from data/services.json.
const services = createRequire(import.meta.url)('../data/services.json');
app.get('/api/services', (_req, res) => res.json(services));

app.get('/api/health', (_req, res) => res.json({ ok: true }));

export default app;
