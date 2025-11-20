import { useState } from 'react';
import Dashboard from './dashboard/Dashboard';
import RecordsTable from './dashboard/RecordsTable';
import Reports from './dashboard/Reports';
import TasksAdmin from './dashboard/TasksAdmin';
import BreaksConfig from './dashboard/BreaksConfig';
import InspectionsPanel from './dashboard/InspectionsPanel';
import { User } from '../../types';

interface Props {
  user: User;
  onSwitchUser: () => void;
}

type Section = 'dashboard' | 'records' | 'reports' | 'inspections' | 'tasks' | 'breaks';

export default function SupervisorShell({ user, onSwitchUser }: Props) {
  const [section, setSection] = useState<Section>('dashboard');

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <aside className="hidden md:flex w-64 bg-white border-r border-slate-200 flex-col p-4 space-y-4">
        <div>
          <p className="text-xs uppercase text-brand-600">Supervisor</p>
          <h2 className="text-xl font-semibold text-slate-900">{user.name}</h2>
          <p className="text-sm text-slate-500">Panel de control</p>
        </div>
        <nav className="space-y-2">
          {[
            { id: 'dashboard', label: 'Dashboard' },
            { id: 'records', label: 'Registros de aseo' },
            { id: 'reports', label: 'Rendimiento por cleaner' },
            { id: 'inspections', label: 'Fiscalizaciones' },
            { id: 'tasks', label: 'Tareas y mensajes' },
            { id: 'breaks', label: 'Configuración de colaciones' },
          ].map((item) => (
            <button
              key={item.id}
              className={`w-full text-left px-3 py-2 rounded-lg font-semibold ${
                section === item.id
                  ? 'bg-brand-50 text-brand-700'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
              onClick={() => setSection(item.id as Section)}
            >
              {item.label}
            </button>
          ))}
        </nav>
        <button
          onClick={() => {
            localStorage.removeItem('aseo-user');
            onSwitchUser();
          }}
          className="text-sm text-slate-500 hover:text-slate-900"
        >
          Cerrar sesión
        </button>
      </aside>

      <div className="flex-1 p-4 md:p-8 space-y-6">
        {section === 'dashboard' && <Dashboard />}
        {section === 'records' && <RecordsTable />}
        {section === 'reports' && <Reports />}
        {section === 'inspections' && <InspectionsPanel supervisor={user} />}
        {section === 'tasks' && <TasksAdmin supervisor={user} />}
        {section === 'breaks' && <BreaksConfig />}
      </div>
    </div>
  );
}
