import express from 'express';
import { createServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import cors from 'cors';
import { readFileSync, existsSync, readdirSync, statSync } from 'fs';
import { watch } from 'chokidar';
import Database from 'better-sqlite3';

const PORT = parseInt(process.env.PORT ?? '18792');
const OCLIW_BASE = '/home/ody/.openclaw';

const app = express();
app.use(cors());
app.use(express.json());

// ─── Data Fetchers ────────────────────────────────────────────────────────────

function readJSON(path: string) {
  try {
    return existsSync(path) ? JSON.parse(readFileSync(path, 'utf-8')) : null;
  } catch {
    return null;
  }
}

function getCronJobs() {
  const data = readJSON(`${OCLIW_BASE}/cron/jobs.json`);
  return data?.jobs ?? [];
}

function getTasks() {
  try {
    const db = new Database(`${OCLIW_BASE}/tasks/runs.sqlite`, { readonly: true });
    const runs = db.prepare(`
      SELECT id, title, status, agent, project, created_at as created, updated_at as updated
      FROM runs WHERE deleted = 0 ORDER BY updated_at DESC
    `).all();
    db.close();
    return runs;
  } catch {
    return [];
  }
}

function getAgents() {
  const agents: Record<string, any>[] = [];
  const dirs = ['main', 'code-agent', 'planner-agent', 'creative-agent', 'reviewer-agent', 'orchestrator'];
  for (const dir of dirs) {
    const configPath = `${OCLIW_BASE}/agents/${dir}/config.json`;
    const config = readJSON(configPath);
    if (config) {
      agents.push({ id: dir, ...config });
    }
  }
  return agents;
}

function getSessions() {
  const sessionsPath = `${OCLIW_BASE}/agents/main/sessions/sessions.json`;
  return readJSON(sessionsPath) ?? {};
}

function getMemory() {
  const memPath = `${OCLIW_BASE}/workspace/MEMORY.md`;
  try {
    return existsSync(memPath) ? readFileSync(memPath, 'utf-8') : '';
  } catch {
    return '';
  }
}

function getDailyLogs() {
  const logsDir = `${OCLIW_BASE}/workspace/memory`;
  const logs: { date: string; content: string }[] = [];
  if (existsSync(logsDir)) {
    // Read all *.md files in memory/
  }
  return logs;
}

function getBlogPosts() {
  const blogDir = `${OCLIW_BASE}/obsidian/07 Blogposts`;
  const posts: { name: string; content: string; updated: string }[] = [];
  if (existsSync(blogDir)) {
    try {
      const { readdirSync, readFileSync, statSync } = require('fs');
      const files = readdirSync(blogDir).filter((f: string) => f.endsWith('.md'));
      for (const file of files) {
        const filePath = `${blogDir}/${file}`;
        try {
          const stat = statSync(filePath);
          const content = readFileSync(filePath, 'utf-8');
          posts.push({
            name: file,
            content,
            updated: stat.mtime.toISOString(),
          });
        } catch {
          // skip unreadable files
        }
      }
    } catch {
      // directory not readable
    }
  }
  return posts;
}

function getProjects() {
  const projectsDir = `${OCLIW_BASE}/projects`;
  const projects: any[] = [];
  if (existsSync(projectsDir)) {
    // Read *.json files
  }
  // Always include built-in projects
  projects.push(
    { id: 'mission-control', name: 'Project Olympus', description: 'Mission Control dashboard', status: 'active', tasks: [] },
    { id: 'odyclaw-system', name: 'OdyClaw System', description: 'Multi-agent homelab system', status: 'active', tasks: [] }
  );
  return projects;
}

function getUsage() {
  return readJSON(`${OCLIW_BASE}/agents/cost-tracker/usage.json`) ?? {};
}

function getTopics() {
  const data = readJSON(`${OCLIW_BASE}/topics.json`);
  return data?.topics ?? [];
}

function saveTopics(topics: any[]) {
  try {
    require('fs').writeFileSync(`${OCLIW_BASE}/topics.json`, JSON.stringify({ version: 1, topics }, null, 2));
    return true;
  } catch {
    return false;
  }
}

// ─── WebSocket Client Management ───────────────────────────────────────────────

const clients = new Set<WebSocket>();

function broadcast(data: object) {
  const msg = JSON.stringify(data);
  clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(msg);
    }
  });
}

function refreshAll() {
  broadcast({ type: 'refresh', payload: getSnapshot() });
}

function getSnapshot() {
  return {
    cronJobs: getCronJobs(),
    tasks: getTasks(),
    agents: getAgents(),
    sessions: getSessions(),
    memory: getMemory(),
    usage: getUsage(),
    projects: getProjects(),
    topics: getTopics(),
  };
}

// ─── API Routes ───────────────────────────────────────────────────────────────

app.get('/api/status', (_req, res) => {
  res.json({ ok: true, timestamp: Date.now() });
});

app.get('/api/snapshot', (_req, res) => {
  res.json(getSnapshot());
});

app.get('/api/cron-jobs', (_req, res) => {
  res.json(getCronJobs());
});

app.get('/api/tasks', (_req, res) => {
  res.json(getTasks());
});

app.get('/api/agents', (_req, res) => {
  res.json(getAgents());
});

app.get('/api/sessions', (_req, res) => {
  res.json(getSessions());
});

app.get('/api/memory', (_req, res) => {
  res.json({ content: getMemory() });
});

app.get('/api/projects', (_req, res) => {
  res.json(getProjects());
});

app.get('/api/usage', (_req, res) => {
  res.json(getUsage());
});

app.get('/api/blogposts', (_req, res) => {
  res.json(getBlogPosts());
});

// Topics
app.get('/api/topics', (_req, res) => {
  res.json(getTopics());
});

app.post('/api/topics', (req, res) => {
  const topics = getTopics();
  const newTopic = {
    id: `topic_${Date.now()}`,
    name: req.body.name ?? 'Untitled',
    score: Math.min(100, Math.max(0, parseInt(req.body.score) || 50)),
    trackedWeeks: parseInt(req.body.trackedWeeks) || 1,
    tags: Array.isArray(req.body.tags) ? req.body.tags : [],
    notes: req.body.notes ?? '',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  topics.push(newTopic);
  saveTopics(topics);
  refreshAll();
  res.status(201).json(newTopic);
});

app.delete('/api/topics/:id', (req, res) => {
  const topics = getTopics().filter((t: any) => t.id !== req.params.id);
  saveTopics(topics);
  refreshAll();
  res.json({ ok: true });
});

// ─── File Watchers ─────────────────────────────────────────────────────────────

const watchTargets = [
  `${OCLIW_BASE}/cron/jobs.json`,
  `${OCLIW_BASE}/tasks/runs.sqlite`,
  `${OCLIW_BASE}/agents`,
  `${OCLIW_BASE}/workspace/MEMORY.md`,
  `${OCLIW_BASE}/workspace/memory`,
  `${OCLIW_BASE}/projects`,
  `/home/ody/obsidian/07 Blogposts`,
];

// Watch obsidian vault for blog post changes
watch(['/home/ody/obsidian/07 Blogposts'], { persistent: true, ignoreInitial: true })
  .on('all', () => refreshAll());

// Fallback polling every 10s
setInterval(refreshAll, 10_000);

// ─── Server Boot ────────────────────────────────────────────────────────────────

const server = createServer(app);
const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
  clients.add(ws);
  console.log(`[ws] client connected (${clients.size} total)`);

  // Send initial snapshot
  ws.send(JSON.stringify({ type: 'snapshot', payload: getSnapshot() }));

  ws.on('close', () => {
    clients.delete(ws);
    console.log(`[ws] client disconnected (${clients.size} total)`);
  });

  ws.on('error', (err) => {
    console.error('[ws] error:', err.message);
    clients.delete(ws);
  });
});

server.listen(PORT, () => {
  console.log(`[mission-control] backend running on ws://localhost:${PORT}`);
});