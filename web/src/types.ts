export interface Agent {
  id: string;
  name: string;
  role: string;
  color: string;
  avatar: string;
  zone: string;
  desk: { x: number; y: number };
  chair: { x: number; y: number };
  systemPrompt: string;
  status: string;
  energy: number;
}

export interface Task {
  id: string;
  title: string;
  brief: string;
  department: string;
  assignedTo: string[];
  status: 'in_progress' | 'completed' | 'blocked';
  deliverables: string[];
  createdAt: string;
}

export interface Deliverable {
  id: string;
  taskId: string;
  author: string;
  title: string;
  summary: string;
  timestamp: string;
}

export interface MeetingMessage {
  sender: string;
  speaker: string;
  text: string;
  timestamp: string;
}

export interface Meeting {
  id: string;
  topic: string;
  status: 'active' | 'concluded';
  startedAt: string;
  endedAt?: string;
  messages: MeetingMessage[];
}

export interface ChatMessage {
  sender: 'user' | string;
  name: string;
  text: string;
  timestamp: string;
}
