export interface Agent {
  id: string;
  name: string;
  model: string;
  description?: string;
}

export interface CronJob {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  schedule: {
    kind: string;
    expr: string;
  };
  payload: {
    kind: string;
    message: string;
    timeoutSeconds: number;
  };
  createdAtMs: number;
}

export interface Task {
  id: string;
  title: string;
  status: 'backlog' | 'in-progress' | 'done';
  agent?: string;
  project?: string;
  created: number;
  updated: number;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'paused' | 'done';
  tasks: string[];
  agent?: string;
}

export interface DailyLog {
  date: string;
  content: string;
}

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  agent: string;
  created: string;
  updated: string;
}

export interface Usage {
  budget: number;
  budget_eur: number;
  month: string;
  currency: string;
  agents: Record<string, {
    spent_eur: number;
    tokens_in: number;
    tokens_out: number;
    sessions: number;
  }>;
  total_spent_eur: number;
  daily_cap_eur: number;
  last_updated: string;
}

export interface Snapshot {
  cronJobs: CronJob[];
  tasks: Task[];
  agents: Agent[];
  sessions: Record<string, any>;
  memory: string;
  usage: Usage;
  projects: Project[];
}