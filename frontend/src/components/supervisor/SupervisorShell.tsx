import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import Dashboard from './dashboard/Dashboard';
import RecordsTable from './dashboard/RecordsTable';
import Reports from './dashboard/Reports';
import TasksAdmin from './dashboard/TasksAdmin';
import BreaksConfig from './dashboard/BreaksConfig';
import InspectionsPanel from './dashboard/InspectionsPanel';
import { User } from '../../types';
import { useRealTimeEvents } from '../../hooks/useRealTimeEvents';

interface Props {
  user: User;
  onSwitchUser: () => void;
}

type Section = 'dashboard' | 'records' | 'reports' | 'inspections' | 'tasks' | 'breaks';

export default function SupervisorShell({ user, onSwitchUser }: Props) {
  const [section, setSection] = useState<Section>('dashboard');
  const { subscribe } = useRealTimeEvents();

  useEffect(() => {
    const unsubscribe = subscribe('NEW_RECORD', (event) => {
      const data = event.data;
      const userName = data.user_name || 'Unknown';
      const ppu = data.ppu || '';
      const cleaningType = data.cleaning_type || '';
      const terminal = data.terminal || '';

      toast.success(
        `Nuevo registro de ${userName}: ${cleaningType} en ${ppu} - Terminal: ${terminal}`,
        {
          duration: 5000,
          icon: '🚌',
          style: {
            background: '#10b981',
            color: '#fff',
            fontWeight: 'bold',
          },
        }
      );

      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTUIGGm98OWhTQ0PUKnn77RiGwU7k9r0yXkpBSF1xPDekzoKElyw6OyrWBUIRp/i8r1rHwUrgs/y2Ik1CBhqvPDnoU0OD0+p5++zYRsFOpPZ9Ml5KAUidMPw3pM5ChJcr+jrq1cVCEef4vK8ax4FIHrG8tmJNQgYarzu56FODg9Oqejvs2EbBTmS2fTJeCgFI3TC8N6SOQoSXK7o66tXFQhGn+Lyv2seBS+BzvLZiTUIGWu87uelThAPTqnn7rRhGgU4ktj0yHcmBSJ0wfDekjkKEluu6OyqVxUIRZ/h8r1rHQUtg87y2Yk1CBlrvO7no04QD06o5++zYRoFOJLY9Mh3JgUhdL/w3ZI5ChNbr+jsqlYVCEWe4PK9ahwFK4HO8tmJNAganO7npk4QD06n5u+zYRoFN5HY9Mh2JgUgdL7w3JI4ChNar+jsqVUUCESe3/K8aRwFKoDP8tiINAgZa7zu56RODw9Op+bvs2AZBTeR2PPHdiUFH3S98NyRNwsTWq/o7KlVFAhFnt7yvWkbBSqAz/LYiDQIGWu77uilTQ4PTqfl77NgGQU3kNfzx3YlBR90vPDblzcLE1mw6OupVBQIRJ7f8rxpGwUpgM/y14g0CBpru+7no0wOD06n5e+yXxkGN5DX88d2JAYfdbrv25E2ChJYr+jrqVQVB0Oe3vK7aRoGKIDP8teJNAgaarzu56NMDw5Op+Xvsm0YBjeP1/PHdSMGB3S68NyRNQoSWa/n66hUFQdDnt3yu2kaBSiBzvHXiDQIGmu78OejSw4OTqfm77FsGAU3jNfzx3QjBgd0ufDckTQLEliv5+uoVBYHQ5zd8r1rGgQngs/x2Ig0Bxpru+7ookwPDU2m5u+waxgGOIzW88d0IgUIdLrw25A1ChNYrufsqVQVB0Oc3fK9axoEJ4HP8diINAcabLvv56JLDA1Npubs8GgYBjiM1vPGcyEFCHS58NuQNQoTV67n66hUFQdDnN3yvGsaBCaBz/HYhzQHGWy77+ehawoMTaal7O9nGQY5jdXywHEdBAl0uO/bjjQLFFev5+qnUxYGRJze8r1sGgQngc/x2Ig0Bxhruuvno0wODU2l5e+waxgGOIzX88dzIwcHc7js25E2ChRWrebrp1QWBUKZ3vK9bBoEJ4DP8tiINAcabLvv56JMDg1NpeXvsGsYBTiL1/PHcyMGB3S48NuRNgoTV67n66lVFgZDnNzyvWsZBCaAz/HXiTQHGWy67uejTA4NTaXl768ZGAE5+JN0');
      audio.play().catch(() => console.log('Unable to play sound'));
    });

    return () => unsubscribe();
  }, [subscribe]);

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
