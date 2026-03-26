import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import routes from '@/routes';
import { initDatabase } from '@/models/database';
import { apiLimiter } from '@/middleware/rateLimiter';

const app = express();
const PORT = parseInt(process.env.PORT || '3000');

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(apiLimiter);

initDatabase();

app.get('/health', (_req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

app.use('/api', routes);

app.use((_req, res) => res.status(404).json({ success: false, error: 'Endpoint not found' }));

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ success: false, error: 'Internal server error' });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
