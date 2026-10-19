import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY;
let genAI = null;

if (apiKey && apiKey !== 'your_key_here' && apiKey !== 'your_gemini_api_key_here') {
  try {
    genAI = new GoogleGenerativeAI(apiKey);
  } catch (err) {
    console.warn('[Gemini] Failed to initialize GoogleGenerativeAI client, will use simulation mode:', err.message);
  }
}

/**
 * Generate a response for an individual agent conversation.
 */
export async function generateAgentResponse(agent, conversationHistory, userMessage) {
  if (genAI) {
    try {
      const systemInstruction = `${agent.systemPrompt}\n\nYou are physically speaking to the Owner/CEO inside a 2D pixel RPG office workspace. Keep answers authentic, concise (1-3 paragraphs), actionable, and stay in character as ${agent.name} (${agent.role}).`;
      
      const model = genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
        systemInstruction
      });

      const chat = model.startChat({
        history: conversationHistory.map(msg => ({
          role: msg.sender === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text }]
        }))
      });

      const result = await chat.sendMessage(userMessage);
      const text = result.response.text();
      return text || '(nods thoughtfully)';
    } catch (err) {
      console.error(`[Gemini Error for ${agent.name}]:`, err.message);
      // Fallback to simulated response
    }
  }

  // Simulated in-character response when no API key is provided
  return getSimulatedAgentResponse(agent, userMessage);
}

/**
 * Generate an All-Hands meeting round where multiple agents speak.
 */
export async function generateAllHandsDiscussion(agents, topic, history = []) {
  if (genAI) {
    try {
      const roster = agents.map(a => `${a.name} (${a.role})`).join(', ');
      const systemInstruction = `You are running an All-Hands company meeting in an AI tech office. 
Participants: ${roster}.
Topic: "${topic}".
Generate 2 to 3 distinct contributions from the most relevant agents in the room reacting to the topic and to each other.
Format your output as JSON array with format:
[
  { "agentId": "agent_id", "speaker": "Agent Name", "text": "Their spoken line" }
]
Keep each statement punchy, realistic, and productive. Return ONLY raw JSON.`;

      const model = genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
        systemInstruction,
        generationConfig: {
          responseMimeType: 'application/json'
        }
      });

      const result = await model.generateContent(`Meeting Topic: ${topic}`);
      const text = result.response.text();

      try {
        const parsed = JSON.parse(text.trim());
        if (Array.isArray(parsed)) return parsed;
      } catch (pErr) {
        console.warn('Could not parse JSON from Gemini meeting output:', pErr);
      }
    } catch (err) {
      console.error('[Gemini All-Hands Error]:', err.message);
    }
  }

  // Simulation fallback
  return getSimulatedMeetingResponses(agents, topic);
}

/**
 * Route a brief to appropriate departments and generate subtasks
 */
export async function decomposeTaskBrief(brief, agents) {
  if (genAI) {
    try {
      const prompt = `Project Brief: "${brief}".
Available team members: ${agents.map(a => `${a.id}: ${a.name} (${a.role})`).join(', ')}.
Decompose this brief into 2-3 specific subtasks. Return JSON:
{
  "title": "Short title",
  "department": "e.g. Frontend / Design",
  "assignedTo": ["agent_id1", "agent_id2"],
  "deliverables": ["Deliverable item 1", "Deliverable item 2"]
}`;

      const model = genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
        generationConfig: {
          responseMimeType: 'application/json'
        }
      });

      const result = await model.generateContent(prompt);
      const text = result.response.text();
      return JSON.parse(text.trim());
    } catch (err) {
      console.error('[Gemini Task Decompose Error]:', err.message);
    }
  }

  // Simulated decomposition
  return {
    title: brief.slice(0, 40) + (brief.length > 40 ? '...' : ''),
    department: 'Cross-functional',
    assignedTo: ['sarah', 'dev', 'dana'],
    deliverables: [
      `Architecture & requirements for "${brief}"`,
      'Implementation plan & test matrix'
    ]
  };
}

function getSimulatedAgentResponse(agent, userMessage) {
  switch (agent.id) {
    case 'sarah':
      return `Hey boss! On the sprint front: we have 3 tasks actively progressing, 1 waiting on QA review, and Dana's UI components are tracking ahead of schedule. How do you want to prioritize the next milestone?`;
    case 'maya':
      return `Good timing. The PRD v2.1 document is updated with user journey maps and the monetization telemetry. We need your call on whether the free tier should include multi-turn All-Hands meetings.`;
    case 'uma':
      return `Look at this canvas! I've been experimenting with 16-bit color palettes and high-contrast accessibility tags. Which vibe do you prefer: Nordic minimalist or retro cyberpunk neon?`;
    case 'dana':
      return `Hey! Just shipped the 60fps render loop on the mobile viewport. Touch events are mapped seamlessly to the virtual D-Pad. Zero frame drops recorded!`;
    case 'dev':
      return `Database indexes are holding steady at sub-10ms query latency. We're ready to switch the token session store over to Redis if cluster traffic surges.`;
    case 'owen':
      return `Cluster health is 100% green. Pterodactyl container memory consumption is hovering around 38MB — well under our 512MB limit!`;
    case 'quinn':
      return `I ran 48 automated test cases on Chrome, Firefox, and mobile Safari. Found one tiny bounding box overlap near the coffee machine, already patched.`;
    default:
      return `Hello! Currently focusing on office objectives. Let's make this sprint our best one yet!`;
  }
}

function getSimulatedMeetingResponses(agents, topic) {
  return [
    {
      agentId: 'sarah',
      speaker: 'Sarah (PM)',
      text: `Thanks everyone for assembling. Regarding "${topic}", our priority is delivering user value while protecting our sprint cycle time.`
    },
    {
      agentId: 'dev',
      speaker: 'Dev (BE)',
      text: `From an infrastructure perspective, we should ensure any changes to "${topic}" maintain backward compatibility with our API schema.`
    },
    {
      agentId: 'dana',
      speaker: 'Dana (FE)',
      text: `Agreed! I'll ensure the UI components reflect these updates instantly without causing unnecessary re-renders.`
    }
  ];
}
