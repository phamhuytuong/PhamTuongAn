import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { querySchoolMapsGrounding } from './src/server/geminiService.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// API endpoints
app.post('/api/school-info', async (req: Request, res: Response) => {
  try {
    const { query = 'Giới thiệu tổng quan về vị trí, khuôn viên và lịch sử Trường THPT Hàn Thuyên Phú Nhuận TP.HCM' } = req.body || {};
    const result = await querySchoolMapsGrounding(query);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err?.message || 'Server error' });
  }
});

app.post('/api/gemini/grounding', async (req: Request, res: Response) => {
  try {
    const { prompt = 'Trường THPT Hàn Thuyên Phú Nhuận TP.HCM' } = req.body || {};
    const result = await querySchoolMapsGrounding(prompt);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err?.message || 'Server error' });
  }
});

// Serve static assets in production
const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath));

app.get('*', (_req: Request, res: Response) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
