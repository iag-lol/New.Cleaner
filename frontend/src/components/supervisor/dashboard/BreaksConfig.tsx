import { useEffect, useState } from 'react';
import { fetchBreaks, fetchUsers, saveBreak } from '../../../api';
import { User } from '../../../types';

export default function BreaksConfig() {
  const [cleaners, setCleaners] = useState<User[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [form, setForm] = useState({ userId: '', breakTime: '' });
  const [message, setMessage] = useState<string | null>(null);

  async function load() {
    const [users, breaks] = await Promise.all([fetchUsers('CLEANER'), fetchBreaks()]);
    setCleaners(users);
    setAssignments(breaks);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.userId) return;
    await saveBreak(form.userId, form.breakTime);
    setMessage('Colación guardada');
    setForm({ userId: '', breakTime: '' });
    load();
    setTimeout(() => setMessage(null), 1200);
  }

  return (
    <section className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">Configura horarios de colación</p>
          <h3 className="text-lg font-semibold text-slate-900">Colaciones</h3>
        </div>
      </div>

      <form className="grid grid-cols-1 md:grid-cols-3 gap-3" onSubmit={handleSubmit}>
        <select
          value={form.userId}
          onChange={(e) => setForm((f) => ({ ...f, userId: e.target.value }))}
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
          placeholder="Ej: 13:00 - 13:30"
          value={form.breakTime}
          onChange={(e) => setForm((f) => ({ ...f, breakTime: e.target.value }))}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
        />
        <button type="submit" className="rounded-lg bg-brand-600 text-white font-semibold px-4 py-2">
          Guardar
        </button>
        {message && <p className="md:col-span-3 text-sm text-emerald-600">{message}</p>}
      </form>

      <div className="overflow-auto rounded-xl border border-slate-100">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              {['Cleaner', 'Hora de colación', 'Actualizado'].map((h) => (
                <th key={h} className="text-left px-3 py-2 font-semibold">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {assignments.map((a) => (
              <tr key={a.user_id} className="border-t border-slate-100">
                <td className="px-3 py-2">{a.name || a.user_id}</td>
                <td className="px-3 py-2">{a.break_time || 'No asignada'}</td>
                <td className="px-3 py-2">
                  {a.updated_at ? new Date(a.updated_at).toLocaleString() : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
