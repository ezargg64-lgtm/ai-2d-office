import express from 'express';
import { getTasks, saveTasks, getDeliverables, saveDeliverables, getAgents } from '../store.js';
import { decomposeTaskBrief } from '../gemini.js';

const router = express.Router();

// GET tasks
router.get('/', (req, res) => {
  res.json(getTasks());
});

// POST new task brief (decomposes and routes to team)
router.post('/', async (req, res) => {
  const { brief } = req.body;
  if (!brief) return res.status(400).json({ error: 'Brief is required' });

  const agents = getAgents();
  const decomposed = await decomposeTaskBrief(brief, agents);

  const tasks = getTasks();
  const newTask = {
    id: `task-${Date.now()}`,
    brief,
    title: decomposed.title,
    department: decomposed.department,
    assignedTo: decomposed.assignedTo,
    status: 'in_progress',
    deliverables: decomposed.deliverables,
    createdAt: new Date().toISOString()
  };

  tasks.unshift(newTask);
  saveTasks(tasks);

  // Auto-schedule simulated deliverables generation after 5-10s
  setTimeout(() => {
    const deliverables = getDeliverables();
    const primaryAgentId = newTask.assignedTo[0] || 'sarah';
    const agent = agents.find(a => a.id === primaryAgentId) || agents[0];
    
    deliverables.unshift({
      id: `deliv-${Date.now()}`,
      taskId: newTask.id,
      author: `${agent.name} (${agent.role})`,
      title: newTask.deliverables[0] || `Deliverable for: ${newTask.title}`,
      summary: `Completed preliminary milestone for "${newTask.title}". All automated checks and specifications documented.`,
      timestamp: new Date().toISOString()
    });
    saveDeliverables(deliverables);
  }, 6000);

  res.status(201).json(newTask);
});

// GET deliverables
router.get('/deliverables', (req, res) => {
  res.json(getDeliverables());
});

export default router;
