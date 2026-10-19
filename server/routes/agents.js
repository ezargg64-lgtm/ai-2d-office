import express from 'express';
import { getAgents, saveAgents } from '../store.js';
import { generateAgentResponse } from '../gemini.js';

const router = express.Router();

// GET all agents
router.get('/', (req, res) => {
  res.json(getAgents());
});

// GET single agent
router.get('/:id', (req, res) => {
  const agents = getAgents();
  const agent = agents.find(a => a.id === req.params.id);
  if (!agent) return res.status(404).json({ error: 'Agent not found' });
  res.json(agent);
});

// UPDATE agent config / system prompt
router.put('/:id', (req, res) => {
  const agents = getAgents();
  const index = agents.findIndex(a => a.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Agent not found' });

  agents[index] = { ...agents[index], ...req.body };
  saveAgents(agents);
  res.json(agents[index]);
});

// 1-on-1 Chat with agent
router.post('/:id/chat', async (req, res) => {
  const agents = getAgents();
  const agent = agents.find(a => a.id === req.params.id);
  if (!agent) return res.status(404).json({ error: 'Agent not found' });

  const { message, history = [] } = req.body;
  if (!message) return res.status(400).json({ error: 'Message is required' });

  try {
    const reply = await generateAgentResponse(agent, history, message);
    res.json({
      sender: agent.id,
      name: agent.name,
      role: agent.role,
      reply,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
