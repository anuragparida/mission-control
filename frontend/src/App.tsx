import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Sidebar } from '@/components/Sidebar';
import { TasksPage } from '@/pages/TasksPage';
import { CalendarPage } from '@/pages/CalendarPage';
import { ProjectsPage } from '@/pages/ProjectsPage';
import { MemoryPage } from '@/pages/MemoryPage';
import { DocsPage } from '@/pages/DocsPage';
import { TeamPage } from '@/pages/TeamPage';
import { VisualPage } from '@/pages/VisualPage';
import { default as WsDebug } from '@/pages/WsDebug';

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex h-screen overflow-hidden" style={{ background: '#0a0a0f' }}>
        <Sidebar />
        <main className="flex-1 flex flex-col overflow-hidden">
          <Routes>
            <Route path="/" element={<Navigate to="/team" replace />} />
            <Route path="/tasks" element={<TasksPage />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/memory" element={<MemoryPage />} />
            <Route path="/docs" element={<DocsPage />} />
            <Route path="/team" element={<TeamPage />} />
            <Route path="/visual" element={<VisualPage />} />
            <Route path="/wsdebug" element={<WsDebug />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}