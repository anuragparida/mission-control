# Project Olympus — Mission Control

## Overview

Full-stack locally-hosted ops dashboard for Anurag's 5-agent homelab system. Single pane of glass over all agents, tasks, memory, and docs — pulling live from OpenClaw workspace files.

**Aesthetic:** Bloomberg Terminal meets Greek antiquity. Obsidian surfaces, aged gold and deep violet accents, cold white type. Pixel-art agent sprites with classical motifs. Feels expensive and purposeful, not playful.

## Architecture

```
Browser (React/Vite)
    ↕ WebSocket (ws://localhost:3001)
Backend (Node.js/Express + ws)
    ↕ reads directly from:
~/.openclaw/
  ├── cron/jobs.json          → Calendar
  ├── tasks/runs.sqlite       → Tasks (via sqlite3)
  ├── agents/*/config.json    → Team
  ├── workspace/
  │   ├── MEMORY.md           → Memory
  │   ├── memory/             → Daily logs
  │   └── docs/               → Blog drafts, LinkedIn posts
  ├── projects/               → Project definitions (JSON)
  └── agents/main/sessions/   → Live session status
```

## Frontend Stack

- Vite + React 18 + TypeScript
- React Router v7 for routing
- Tailwind CSS v4 for styling
- shadcn/ui components (dark theme, customized to obsidian/gold/violet palette)
- WebSocket client for real-time updates

## Backend Stack

- Node.js + Express
- `ws` library for WebSocket server
- `better-sqlite3` for task DB reads
- File system watchers via `chokidar` for real-time refresh
- Polling fallback every 5s for files that don't emit change events

## Screens (7 total)

### 1. Tasks
Live kanban: Backlog / In-Progress / Done
Data: SQLite at `~/.openclaw/tasks/runs.sqlite`
Task schema: id, title, status, agent, project, created, updated

### 2. Calendar
Human-readable schedule of all cron jobs
Data: `~/.openclaw/cron/jobs.json`
Shows: job name, schedule, next run, enabled/disabled state

### 3. Projects
Active projects with linked tasks and progress
Data: `~/.openclaw/projects/*.json` (user-created)
Built-in: "Mission Control" (this project), "OdyClaw System"
Progress derived from linked task counts

### 4. Memory
Chronological journal + long-term memory
Data: `memory/YYYY-MM-DD.md` (daily logs) + `MEMORY.md`
Fully searchable, date-sorted

### 5. Docs
All agent-produced documents indexed
Data: obsidian vault `07 Blogposts/` + Discord channel logs
Authorship by agent, searchable

### 6. Team
Full org chart with agent details
Data: `~/.openclaw/agents/*/config.json` + `SYSTEM.md`
Shows: roles, models, schedules, current online status

### 7. Visual Office
2D pixel-art workspace with agent sprites
CSS pixel art (grid-based divs, no external images)
Scrolling status ticker at bottom
Each agent: active (at desk) / idle (away) / offline

## Visual Spec

**Palette:**
- Background: `#0a0a0f` (near-black obsidian)
- Card surface: `#12121a` (slightly elevated)
- Card border: `#1e1e2e`
- Left-border accent: varies by card type (gold `#c9a84c`, violet `#7c5cbf`, teal `#3ecfcf`)
- Primary text: `#e8e8f0`
- Secondary text: `#6b6b80`
- Status online: `#3ecf8e`
- Status warning: `#c9a84c`
- Status error: `#cf3e5c`

**Typography:**
- Headings: Inter (sharp sans-serif), 600 weight
- Data/mono: JetBrains Mono or IBM Plex Mono
- Body: Inter, 400 weight

**Components:**
- Cards with 2px left-border accent (color-coded by type)
- Pulsing status indicators (CSS keyframe animation)
- Cards: subtle border `#1e1e2e`, no heavy shadows
- Navigation sidebar: fixed, `#0e0e14` background, active item highlighted with gold dot

**Pixel Art Sprites (CSS grid-based, 16x16 or 32x32 logical pixels):**
- OdyClaw: command motif — laurel wreath or shield silhouette
- Perseus: sword motif
- Apollo: sun rays
- Athena: owl silhouette
- Helena: flame

## Agent Crew

| Agent | Role | Model | Schedule |
|-------|------|-------|----------|
| OdyClaw | Orchestrator | MiniMax M2.7 | Always on |
| Perseus | Code Agent | MiniMax M2.7 | Nightly 23:00 UTC |
| Apollo | Planner | Qwen 3.6 Plus | Weekly Sun 20:00 UTC |
| Athena | Creative | Kimi K2.6 | Mon/Thu 08:00, Wed 09:00, Tue/Fri 10:00 UTC |
| Helena | Reviewer | MiniMax M2.7 | On-demand |

## Deferred (post-project)

- Google/Apple Calendar integration — note added to calendar screen
- File system watcher for obsidian vault (bidirectional)

## Docker

- `docker-compose.yml` at project root
- Two services: `frontend` (Vite dev server on 5173), `backend` (Node on 3001)
- WebSocket upgrades handled by backend
- Volume mounts: read `~/.openclaw` from host into both containers

## Mission Statement

*"Run a lean, always-on AI crew on home infrastructure that autonomously builds software, produces publishable content, and ships products — so Anurag can focus on vision while the agents handle execution within budget."*