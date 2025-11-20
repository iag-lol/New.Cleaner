import { useEffect, useState } from 'react';
import { createInspection, fetchInspections, fetchRecords } from '../../../api';
import { CleaningRecord, User } from '../../../types';

interface Props {
  supervisor: User;
}

export default function InspectionsPanel({ supervisor }: Props) {
  const [records, setRecords] = useState<CleaningRecord[]>([]);
  const [inspections, setInspections] = useState<any[]>([]);
  const [form, setForm] = useState({ cleaningId: '', passed: true, comments: '' });

  async function load() {
    const recs = await fetchRecords({});
    setRecords(recs.slice(0, 100));
    setInspections(await fetchInspections({}));
  }

  useEffect(() => {
    load();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.cleaningId) return;
    await createInspection({
      cleaningId: form.cleaningId,
      supervisorId: supervisor.id,
      passed: form.passed,
      comments: form.comments,
    });
    setForm({ cleaningId: '', passed: true, comments: '' });
    load();
  }

  return (
    <section className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">Fiscalización</p>
          <h3 className="text-lg font-semibold text-slate-900">Registrar fiscalización</h3>
        </div>
      </div>

      <form className="grid grid-cols-1 md:grid-cols-3 gap-3" onSubmit={handleSubmit}>
        <select
          value={form.cleaningId}
          onChange={(e) => setForm((f) => ({ ...f, cleaningId: e.target.value }))}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm bg-white"
        >
          <option value="">Seleccionar registro</option>
          {records.map((r) => (
            <option key={r.id} value={r.id}>
              {r.ppu} · {r.terminal} · {new Date(r.created_at || '').toLocaleDateString()}
            </option>
          ))}
        </select>
        <select
          value={form.passed ? 'true' : 'false'}
          onChange={(e) => setForm((f) => ({ ...f, passed: e.target.value === 'true' }))}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm bg-white"
        >
          <option value="true">Pasa</option>
          <option value="false">No pasa</option>
        </select>
        <input
          placeholder="Comentarios"
          value={form.comments}
          onChange={(e) => setForm((f) => ({ ...f, comments: e.target.value }))}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
        />
        <button type="submit" className="md:col-span-3 rounded-lg bg-brand-600 text-white font-semibold px-4 py-2">
          Guardar fiscalización
        </button>
      </form>

      <div className="overflow-auto rounded-xl border border-slate-100">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              {['Registro', 'Resultado', 'Supervisor', 'Fecha', 'Comentarios'].map((h) => (
                <th key={h} className="text-left px-3 py-2 font-semibold">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {inspections.map((i) => (
              <tr key={i.id} className="border-t border-slate-100">
                <td className="px-3 py-2">{i.ppu}</td>
                <td className="px-3 py-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      i.passed ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                    }`}
                  >
                    {i.passed ? 'Pasa' : 'No pasa'}
                  </span>
                </td>
                <td className="px-3 py-2">{i.supervisor_name || i.supervisor_id}</td>
                <td className="px-3 py-2">{new Date(i.created_at || '').toLocaleString()}</td>
                <td className="px-3 py-2">{i.comments || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
