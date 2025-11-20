import { useEffect, useState } from 'react';
import { fetchBreak } from '../../api';
import { User } from '../../types';
import CleaningForm from '../forms/CleaningForm';
import RecordsList from './RecordsList';
import TasksView from './TasksView';

interface Props {
  user: User;
  onSwitchUser: () => void;
}

type Tab = 'records' | 'tasks';

export default function CleanerShell({ user, onSwitchUser }: Props) {
  const [tab, setTab] = useState<Tab>('records');
  const [showForm, setShowForm] = useState(false);
  const [breakTime, setBreakTime] = useState<string>('Cargando...');
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    fetchBreak(user.id)
      .then((data) => setBreakTime(data?.break_time || 'No asignada'))
      .catch(() => setBreakTime('No asignada'));
  }, [user.id]);

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <header className="bg-white shadow-sm sticky top-0 z-20">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase text-brand-600 tracking-[0.1em]">Registro de Aseo</p>
            <h2 className="text-lg font-semibold text-slate-900">{user.name}</h2>
            <p className="text-sm text-slate-600">
              Cargo: <span className="font-semibold">CLEANER</span> · Colación:{' '}
              <span className="font-semibold">{breakTime}</span>
            </p>
          </div>
          <button
            className="text-xs text-brand-600 hover:underline"
            onClick={() => {
              localStorage.removeItem('aseo-user');
              onSwitchUser();
            }}
          >
            Cambiar usuario
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-4 space-y-4">
        {tab === 'records' && <RecordsList user={user} refreshKey={refreshKey} />}
        {tab === 'tasks' && <TasksView user={user} />}
      </main>

      <nav className="fixed bottom-0 inset-x-0 bg-white border-t border-slate-200 shadow-lg">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between text-sm font-semibold text-slate-600">
          <button
            className={`flex-1 text-center ${tab === 'records' ? 'text-brand-600' : ''}`}
            onClick={() => setTab('records')}
          >
            Registros
          </button>
          <button
            className="w-14 h-14 rounded-full bg-brand-600 text-white text-2xl -mt-8 shadow-card flex items-center justify-center"
            onClick={() => setShowForm(true)}
            aria-label="Agregar registro"
          >
            +
          </button>
          <button
            className={`flex-1 text-center ${tab === 'tasks' ? 'text-brand-600' : ''}`}
            onClick={() => setTab('tasks')}
          >
            Mensajes/Tareas
          </button>
        </div>
      </nav>

      {showForm && (
        <CleaningForm
          user={user}
          onClose={() => setShowForm(false)}
          onSaved={() => {
            setRefreshKey((k) => k + 1);
            setTab('records');
          }}
        />
      )}
    </div>
  );
}
