import 'dotenv/config';
import express from 'express';
import http from 'http';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';

import agentsRouter from './routes/agents.js';
import tasksRouter from './routes/tasks.js';
import meetingsRouter from './routes/meetings.js';
import stateRouter from './routes/state.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);

// Pterodactyl sets SERVER_PORT; local default is 8080
const PORT = process.env.SERVER_PORT || process.env.PORT || 8080;
const HOST = '0.0.0.0';

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/agents', agentsRouter);
app.use('/api/tasks', tasksRouter);
app.use('/api/meetings', meetingsRouter);
app.use('/api/state', stateRouter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    mode: 'pixel-rpg-v4',
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString()
  });
});

// Serve Phaser web distribution statically
const distPath = path.resolve(__dirname, '../web/dist');
app.use(express.static(distPath));

// Single Page Application Fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

server.listen(PORT, HOST, () => {
  console.log(`[Server] Listening on http://${HOST}:${PORT}`);
});
