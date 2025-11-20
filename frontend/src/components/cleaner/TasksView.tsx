import { useEffect, useState } from 'react';
import { completeTask, fetchTasks } from '../../api';
import { Task, User } from '../../types';

interface Props {
  user: User;
}

export default function TasksView({ user }: Props) {
  const [pending, setPending] = useState<Task[]>([]);
  const [done, setDone] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const [pendingTasks, doneTasks] = await Promise.all([
        fetchTasks({ cleanerId: user.id, status: 'pending' }),
        fetchTasks({ cleanerId: user.id, status: 'done' }),
      ]);
      setPending(pendingTasks);
      setDone(doneTasks);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function markDone(id: string) {
    await completeTask(id);
    const task = pending.find((t) => t.id === id);
    setPending((p) => p.filter((t) => t.id !== id));
    if (task) setDone((d) => [{ ...task, status: 'done' }, ...d]);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">Tienes</p>
          <h3 className="text-3xl font-semibold text-slate-900">{pending.length} pendientes</h3>
        </div>
        <button
          onClick={load}
          className="text-sm text-brand-600 font-semibold hover:underline"
        >
          Actualizar
        </button>
      </div>

      {loading && <p className="text-sm text-slate-500">Cargando...</p>}

      {!loading && (
        <>
          <section className="space-y-3">
            <h4 className="text-sm font-semibold text-slate-700">Tareas pendientes</h4>
            {pending.length === 0 && (
              <p className="text-sm text-slate-500">No tienes tareas pendientes.</p>
            )}
            {pending.map((t) => (
              <article
                key={t.id}
                className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm"
              >
                <div className="flex items-center justify-between gap-2">
                  <div>
                    {t.title && <p className="text-xs uppercase text-brand-600">{t.title}</p>}
                    <p className="text-base font-semibold text-slate-900">{t.content}</p>
                    <p className="text-xs text-slate-500 mt-1">
                      Asignada: {new Date(t.created_at || '').toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={() => markDone(t.id)}
                    className="px-3 py-2 rounded-lg bg-brand-600 text-white text-sm font-semibold"
                  >
                    Marcar realizada
                  </button>
                </div>
              </article>
            ))}
          </section>

          <section className="space-y-3 pt-2">
            <h4 className="text-sm font-semibold text-slate-700">Tareas realizadas</h4>
            {done.length === 0 && (
              <p className="text-sm text-slate-500">Aún no has marcado tareas.</p>
            )}
            {done.map((t) => (
              <article
                key={t.id}
                className="bg-slate-50 border border-slate-100 rounded-2xl p-4"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    {t.title && <p className="text-xs uppercase text-brand-600">{t.title}</p>}
                    <p className="text-base font-semibold text-slate-900">{t.content}</p>
                    <p className="text-xs text-slate-500 mt-1">
                      Creada: {new Date(t.created_at || '').toLocaleString()}
                    </p>
                    <p className="text-xs text-emerald-600 mt-1">
                      Realizada: {new Date(t.completed_at || '').toLocaleString()}
                    </p>
                  </div>
                  <span className="px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">
                    Realizada
                  </span>
                </div>
              </article>
            ))}
          </section>
        </>
      )}
    </div>
  );
}
