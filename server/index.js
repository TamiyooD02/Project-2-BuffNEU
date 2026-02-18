import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import exercisesRouter from './routes/exercises.js';
import routinesRouter from './routes/routines.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicPath = path.join(__dirname, '..', 'public');
const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use(express.static(publicPath));

app.use('/api/exercises', exercisesRouter);
app.use('/api/routines', routinesRouter);

app.get('*', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
