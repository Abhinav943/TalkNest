import dotenv from 'dotenv';
import express from 'express';
import authRoutes from './routes/auth.route.js';
import path from 'path';
import { connectToDB } from './lib/db.js';

dotenv.config();
const app = express();
const __dirname = path.resolve();

const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/api/auth', authRoutes);

if(process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist')));
  
  app.get('*', (_, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html'));
  });
}

(async () => {
  try {
    await connectToDB();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
  }
})();