import express from 'express';
import { getAgents, getMeetingHistory, saveMeetingHistory } from '../store.js';
import { generateAllHandsDiscussion } from '../gemini.js';

const router = express.Router();

let activeMeeting = null;

// GET current or latest meeting
router.get('/', (req, res) => {
  res.json({
    activeMeeting,
    history: getMeetingHistory()
  });
});

// START or CONTINUE All-Hands meeting
router.post('/', async (req, res) => {
  const { topic, message } = req.body;
  const currentTopic = topic || (activeMeeting ? activeMeeting.topic : 'General Sprint Alignment');
  const agents = getAgents();

  if (!activeMeeting) {
    activeMeeting = {
      id: `meeting-${Date.now()}`,
      topic: currentTopic,
      status: 'active',
      startedAt: new Date().toISOString(),
      messages: []
    };
  }

  // If user passed a message in an ongoing meeting
  if (message) {
    activeMeeting.messages.push({
      sender: 'user',
      speaker: 'The Owner (You)',
      text: message,
      timestamp: new Date().toISOString()
    });
  }

  try {
    const responses = await generateAllHandsDiscussion(agents, currentTopic, activeMeeting.messages);
    for (const r of responses) {
      activeMeeting.messages.push({
        sender: r.agentId,
        speaker: r.speaker,
        text: r.text,
        timestamp: new Date().toISOString()
      });
    }

    // Persist to history
    const history = getMeetingHistory();
    const existingIndex = history.findIndex(m => m.id === activeMeeting.id);
    if (existingIndex >= 0) {
      history[existingIndex] = activeMeeting;
    } else {
      history.unshift(activeMeeting);
    }
    saveMeetingHistory(history);

    res.json(activeMeeting);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// END meeting
router.post('/end', (req, res) => {
  if (activeMeeting) {
    activeMeeting.status = 'concluded';
    activeMeeting.endedAt = new Date().toISOString();
    const history = getMeetingHistory();
    const index = history.findIndex(m => m.id === activeMeeting.id);
    if (index >= 0) {
      history[index] = activeMeeting;
      saveMeetingHistory(history);
    }
    const concluded = activeMeeting;
    activeMeeting = null;
    return res.json({ status: 'concluded', meeting: concluded });
  }
  res.json({ status: 'no_active_meeting' });
});

export default router;
