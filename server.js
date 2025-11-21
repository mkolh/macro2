import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const FRED_API_KEY = process.env.VITE_FRED_API_KEY ?? process.env.FRED_API_KEY;

if (!FRED_API_KEY) {
  console.warn('Warning: VITE_FRED_API_KEY (or FRED_API_KEY) is not set in your environment.');
}

app.get('/api/fred/series', async (req, res) => {
  try {
    const { series_id: seriesId, frequency = 'm' } = req.query;

    if (!seriesId || typeof seriesId !== 'string') {
      return res.status(400).json({ error: 'Missing series_id' });
    }

    const url = new URL('https://api.stlouisfed.org/fred/series/observations');
    url.searchParams.set('series_id', seriesId);
    if (FRED_API_KEY) url.searchParams.set('api_key', FRED_API_KEY);
    url.searchParams.set('file_type', 'json');
    url.searchParams.set('sort_order', 'asc');
    url.searchParams.set('frequency', typeof frequency === 'string' ? frequency : 'm');

    const response = await fetch(url.toString());
    if (!response.ok) {
      const text = await response.text();
      return res.status(response.status).json({
        error: 'FRED API error',
        status: response.status,
        body: text,
      });
    }

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error('Backend error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`);
});
