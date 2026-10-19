import fs from 'fs';
import path from 'path';

// Automatically detect Pterodactyl container vs local dev
const DATA_DIR = process.env.DATA_DIR || (
  fs.existsSync('/home/container')
    ? '/home/container/data'
    : path.resolve(process.cwd(), 'data')
);

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

export function getStorePath(filename) {
  return path.join(DATA_DIR, filename);
}

export { DATA_DIR };

// Default initial agents setup
const DEFAULT_AGENTS = [
  {
    id: 'sarah',
    name: 'Sarah',
    role: 'Product Manager (PM)',
    color: '#F59E0B',
    avatar: 'sarah',
    zone: 'PM Corner',
    desk: { x: 7, y: 15 },
    chair: { x: 7, y: 16 },
    systemPrompt: 'You are Sarah, an energetic and decisive Agile Product Manager. You track sprint velocity, blockers, and team alignments.',
    status: 'Tracking sprint metrics (3 active, 1 blocked)',
    energy: 95
  },
  {
    id: 'maya',
    name: 'Maya',
    role: 'Head of Product',
    color: '#EC4899',
    avatar: 'maya',
    zone: 'CEO / Product Office',
    desk: { x: 6, y: 6 },
    chair: { x: 6, y: 7 },
    systemPrompt: 'You are Maya, Head of Product. You care about long-term product vision, user needs, market fit, and PRD clarity.',
    status: 'Finalizing PRD v2.1 for executive review',
    energy: 90
  },
  {
    id: 'uma',
    name: 'Uma',
    role: 'Lead UX/UI Designer',
    color: '#8B5CF6',
    avatar: 'uma',
    zone: 'Design Studio',
    desk: { x: 33, y: 6 },
    chair: { x: 33, y: 7 },
    systemPrompt: 'You are Uma, a passionate visual and UX designer. You speak in color palettes, micro-interactions, accessibility, and design vibes.',
    status: 'Drafting 3 aesthetic options for main dashboard',
    energy: 88
  },
  {
    id: 'dana',
    name: 'Dana',
    role: 'Frontend Engineer',
    color: '#06B6D4',
    avatar: 'dana',
    zone: 'Focus Pods',
    desk: { x: 23, y: 6 },
    chair: { x: 23, y: 7 },
    systemPrompt: 'You are Dana, a high-velocity Frontend developer. You build responsive, 60fps UI in React, TypeScript, and Phaser.',
    status: 'Component library at 80% completion',
    energy: 92
  },
  {
    id: 'dev',
    name: 'Dev',
    role: 'Backend Architect',
    color: '#10B981',
    avatar: 'dev',
    zone: 'Focus Pods',
    desk: { x: 27, y: 6 },
    chair: { x: 27, y: 7 },
    systemPrompt: 'You are Dev, senior backend engineer. You live for clean REST/WebSocket architectures, database indexes, and bulletproof APIs.',
    status: 'Stabilizing auth gateway and data pipelines',
    energy: 85
  },
  {
    id: 'owen',
    name: 'Owen',
    role: 'DevOps & Site Reliability',
    color: '#EF4444',
    avatar: 'owen',
    zone: 'DevOps Center',
    desk: { x: 33, y: 22 },
    chair: { x: 33, y: 23 },
    systemPrompt: 'You are Owen, DevOps engineer. You monitor server loads, CI/CD pipelines, container orchestration, and uptime logs.',
    status: 'CI/CD pipeline green; staging build healthy',
    energy: 94
  },
  {
    id: 'quinn',
    name: 'Quinn',
    role: 'QA & Test Automation',
    color: '#3B82F6',
    avatar: 'quinn',
    zone: 'QA Lab',
    desk: { x: 33, y: 15 },
    chair: { x: 33, y: 16 },
    systemPrompt: 'You are Quinn, precise QA engineer. You find boundary conditions, race bugs, edge cases, and cross-browser quirks.',
    status: 'Verifying mobile Safari touch gesture matrix',
    energy: 89
  }
];

function readJsonFile(filename, fallback) {
  try {
    const filePath = getStorePath(filename);
    if (!fs.existsSync(filePath)) {
      writeJsonFile(filename, fallback);
      return fallback;
    }
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error(`Error reading ${filename}:`, err);
    return fallback;
  }
}

function writeJsonFile(filename, data) {
  try {
    const filePath = getStorePath(filename);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error(`Error writing ${filename}:`, err);
  }
}

export function getAgents() {
  return readJsonFile('agents.json', DEFAULT_AGENTS);
}

export function saveAgents(agents) {
  writeJsonFile('agents.json', agents);
}

export function getTasks() {
  return readJsonFile('tasks.json', [
    {
      id: 'task-1',
      title: 'Sprint 14: Mobile Optimization',
      brief: 'Ensure 60 FPS on low-end devices and verify touch controls',
      department: 'Frontend / QA',
      assignedTo: ['dana', 'quinn'],
      status: 'in_progress',
      deliverables: ['Performance audit report', 'Virtual joystick patch'],
      createdAt: new Date().toISOString()
    }
  ]);
}

export function saveTasks(tasks) {
  writeJsonFile('tasks.json', tasks);
}

export function getDeliverables() {
  return readJsonFile('deliverables.json', [
    {
      id: 'deliv-1',
      taskId: 'task-1',
      author: 'Dana (Frontend)',
      title: 'Virtual Joystick & Phaser Canvas Setup',
      summary: 'Implemented canvas rendering at 1x DPR with touch-event mapping for mobile web browsers.',
      timestamp: new Date().toISOString()
    }
  ]);
}

export function saveDeliverables(deliverables) {
  writeJsonFile('deliverables.json', deliverables);
}

export function getMeetingHistory() {
  return readJsonFile('meetings.json', []);
}

export function saveMeetingHistory(meetings) {
  writeJsonFile('meetings.json', meetings);
}
