import express from 'express';
import { createServer } from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to normalize and hash data
const hashSHA256 = (value: string) => {
  return crypto.createHash('sha256').update(value.trim().toLowerCase()).digest('hex');
};

async function startServer() {
  const app = express();
  const server = createServer(app);

  app.use(express.json()); // Middleware to parse JSON bodies
  app.enable('trust proxy'); // Needed to get the real IP address

  // CAPI Endpoint
  app.post('/api/meta-capi', async (req, res) => {
    const { eventName, eventData, eventId, userData, eventSourceUrl, fbc, fbp } = req.body;
    const PIXEL_ID = process.env.META_PIXEL_ID || '1684145446350033'; // Fallback for testing
    const ACCESS_TOKEN = process.env.META_ACCESS_TOKEN;

    if (!ACCESS_TOKEN) {
      console.error('Meta CAPI Access Token is not configured.');
      return res.status(500).json({ error: 'Server configuration error.' });
    }

    // Construct the user_data payload for CAPI
    const capiUserData: Record<string, any> = {
      client_ip_address: req.ip,
      client_user_agent: req.headers['user-agent'],
      fbc: fbc,
      fbp: fbp,
    };

    // Hash user data fields if they exist
    if (userData.em) capiUserData.em = [hashSHA256(userData.em)];
    if (userData.ph) capiUserData.ph = [hashSHA256(userData.ph)];
    if (userData.fn) capiUserData.fn = [hashSHA256(userData.fn)];
    if (userData.ln) capiUserData.ln = [hashSHA256(userData.ln)];
    if (userData.ct) capiUserData.ct = [hashSHA256(userData.ct)];
    if (userData.st) capiUserData.st = [hashSHA256(userData.st)];
    if (userData.zp) capiUserData.zp = [hashSHA256(userData.zp)];

    const payload = {
      data: [
        {
          event_name: eventName,
          event_time: Math.floor(Date.now() / 1000),
          event_id: eventId,
          action_source: 'website',
          event_source_url: eventSourceUrl,
          user_data: capiUserData,
          custom_data: eventData,
          data_processing_options: [], // Add DPO if needed for CCPA/GDPR
        },
      ],
      access_token: ACCESS_TOKEN,
    };

    try {
      const response = await fetch(`https://graph.facebook.com/v19.0/${PIXEL_ID}/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      console.log(`[CAPI Server] Sent ${eventName}. Response:`, result);
      res.status(response.status).json(result);
    } catch (err) {
      console.error(`[CAPI Server] Failed to send ${eventName}:`, err);
      res.status(500).json({ error: 'Failed to send CAPI event' });
    }
  });

  // Serve static files from dist/public in production
  const staticPath =
    process.env.NODE_ENV === 'production'
      ? path.resolve(__dirname, 'public')
      : path.resolve(__dirname, '..', 'dist', 'public');

  app.use(express.static(staticPath));

  // Handle client-side routing - serve index.html for all routes
  app.get('*', (_req, res) => {
    res.sendFile(path.join(staticPath, 'index.html'));
  });

  const port = process.env.PORT || 3000;

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
