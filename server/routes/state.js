import express from 'express';
import { getAgents, getTasks, getDeliverables } from '../store.js';

const router = express.Router();

// GET unified simulation state
router.get('/', (req, res) => {
  const agents = getAgents();
  const tasks = getTasks();
  const deliverables = getDeliverables();

  res.json({
    timestamp: Date.now(),
    agents: agents.map(a => ({
      id: a.id,
      name: a.name,
      role: a.role,
      status: a.status,
      energy: a.energy
    })),
    activeTasksCount: tasks.filter(t => t.status === 'in_progress').length,
    deliverablesCount: deliverables.length,
    latestDeliverable: deliverables[0] || null
  });
});

export default router;
