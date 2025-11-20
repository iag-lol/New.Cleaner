import { useEffect, useState } from 'react';
import { createTask, fetchTasks, fetchUsers } from '../../../api';
import { Task, User } from '../../../types';

interface Props {
  supervisor: User;
}

export default function TasksAdmin({ supervisor }: Props) {
  const [cleaners, setCleaners] = useState<User[]>([]);
  const [form, setForm] = useState({ cleanerId: '', title: '', content: '' });
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState('all');
  const [message, setMessage] = useState<string | null>(null);

  async function load() {
    const data = await fetchTasks({});
    setTasks(data);
  }

  useEffect(() => {
    fetchUsers('CLEANER').then(setCleaners);
    load();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.cleanerId || !form.content) return;
    await createTask({
      cleanerId: form.cleanerId,
      supervisorId: supervisor.id,
      title: form.title,
      content: form.content,
    });
    setMessage('Tarea creada y enviada');
    setForm({ cleanerId: '', title: '', content: '' });
    load();
    setTimeout(() => setMessage(null), 1500);
  }

  const filtered = tasks.filter((t) => (filter === 'all' ? true : t.status === filter));
  const cleanerMap = Object.fromEntries(cleaners.map((c) => [c.id, c.name]));

  return (
    <section className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">Crear y gestionar tareas</p>
          <h3 className="text-lg font-semibold text-slate-900">Tareas y mensajes</h3>
        </div>
      </div>

      <form className="grid grid-cols-1 md:grid-cols-3 gap-3" onSubmit={handleSubmit}>
        <select
          value={form.cleanerId}
          onChange={(e) => setForm((f) => ({ ...f, cleanerId: e.target.value }))}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm bg-white"
        >
          <option value="">Seleccionar cleaner</option>
          {cleaners.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <input
          placeholder="Título/categoría (opcional)"
          value={form.title}
          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
        />
        <input
          placeholder="Texto de la tarea o mensaje"
          value={form.content}
          onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
        />
        <div className="md:col-span-3 flex items-center gap-2">
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-brand-600 text-white font-semibold"
          >
            Enviar
          </button>
          {message && <span className="text-sm text-emerald-600">{message}</span>}
        </div>
      </form>

      <div className="flex items-center gap-3 text-sm">
        <span className="text-slate-600">Filtrar:</span>
        {['all', 'pending', 'done'].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1 rounded-full border ${
              filter === s ? 'border-brand-500 text-brand-700' : 'border-slate-200 text-slate-600'
            }`}
          >
            {s === 'all' ? 'Todos' : s === 'pending' ? 'Pendientes' : 'Realizadas'}
          </button>
        ))}
      </div>

      <div className="overflow-auto rounded-xl border border-slate-100">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              {['Cleaner', 'Supervisor', 'Título', 'Texto', 'Estado', 'Creación', 'Realizada'].map(
                (h) => (
                  <th key={h} className="text-left px-3 py-2 font-semibold">
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {filtered.map((t) => (
              <tr key={t.id} className="border-t border-slate-100">
                <td className="px-3 py-2">{cleanerMap[t.cleaner_id] || t.cleaner_id}</td>
                <td className="px-3 py-2">{t.supervisor_id === supervisor.id ? supervisor.name : t.supervisor_id}</td>
                <td className="px-3 py-2">{t.title || '-'}</td>
                <td className="px-3 py-2">{t.content}</td>
                <td className="px-3 py-2">{t.status}</td>
                <td className="px-3 py-2">{new Date(t.created_at || '').toLocaleString()}</td>
                <td className="px-3 py-2">
                  {t.completed_at ? new Date(t.completed_at).toLocaleString() : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
