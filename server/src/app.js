import express from 'express';
import { appendFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import nodemailer from 'nodemailer';

const root = path.dirname(fileURLToPath(import.meta.url));

// Load server/.env if present (SMTP credentials live there, never in git).
try { process.loadEnvFile(path.join(root, '../.env')); } catch {}
const app = express();

app.use(express.json());

// Services: same five groups as the Thirdcore site, served from data/services.json.
const services = createRequire(import.meta.url)('../data/services.json');
app.get('/api/services', (_req, res) => res.json(services));

// Contact form: emails each message to CONTACT_TO and keeps a copy in data/inbox.jsonl (gitignored).
const CONTACT_TO = process.env.CONTACT_TO || 'ahmadsalihuddin96@gmail.com';
const mailer = process.env.SMTP_USER && process.env.SMTP_PASS
  ? nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: Number(process.env.SMTP_PORT || 465),
      secure: Number(process.env.SMTP_PORT || 465) === 465,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    })
  : null;
if (!mailer) console.warn('SMTP_USER/SMTP_PASS not set: contact messages are saved to data/inbox.jsonl only.');

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
app.post('/api/contact', async (req, res) => {
  const { name = '', email = '', message = '' } = req.body ?? {};
  const clean = (v, max) => String(v).trim().slice(0, max);
  const entry = { name: clean(name, 120), email: clean(email, 200), message: clean(message, 5000) };
  if (!entry.name || !entry.message) return res.status(400).json({ error: 'Please add your name and a message.' });
  if (!EMAIL_RE.test(entry.email)) return res.status(400).json({ error: 'Please enter a valid email.' });

  // Local backup copy. Serverless hosts (Vercel) have a read-only disk, so this may fail there.
  await appendFile(
    path.join(root, '../data/inbox.jsonl'),
    JSON.stringify({ ...entry, at: new Date().toISOString() }) + '\n',
  ).catch(() => {});
  if (!mailer) console.log('Contact message (no SMTP configured):', JSON.stringify(entry));

  if (mailer) {
    try {
      await mailer.sendMail({
        from: `"Portfolio contact" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
        to: CONTACT_TO,
        replyTo: `"${entry.name.replace(/"/g, '')}" <${entry.email}>`,
        subject: `New enquiry from ${entry.name.replace(/[\r\n]/g, ' ')}`,
        text: `${entry.message}\n\n—\n${entry.name}\n${entry.email}`,
      });
    } catch (err) {
      console.error('Contact email failed:', err.message);
      return res.status(502).json({ error: 'Message saved, but email delivery failed. Please try again later.' });
    }
  }
  res.status(201).json({ ok: true });
});

app.get('/api/health', (_req, res) => res.json({ ok: true }));

export default app;
