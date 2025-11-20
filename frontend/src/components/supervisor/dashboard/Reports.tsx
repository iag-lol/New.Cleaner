import { useEffect, useState } from 'react';
import { fetchCleanerReport, fetchUsers } from '../../../api';
import { User } from '../../../types';

export default function Reports() {
  const [cleaners, setCleaners] = useState<User[]>([]);
  const [selected, setSelected] = useState<string>('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [report, setReport] = useState<any>(null);

  useEffect(() => {
    fetchUsers('CLEANER').then((users) => {
      setCleaners(users);
      if (users[0]) setSelected(users[0].id);
    });
  }, []);

  useEffect(() => {
    if (!selected) return;
    fetchCleanerReport(selected, { startDate, endDate }).then(setReport);
  }, [selected, startDate, endDate]);

  return (
    <section className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">Informe de rendimiento</p>
          <h3 className="text-lg font-semibold text-slate-900">Por cleaner</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <select
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
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
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
        />
        <div className="flex items-center text-sm text-slate-500 px-3">Rango de fechas</div>
      </div>

      {report && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-50 rounded-xl p-4">
            <p className="text-sm text-slate-500">Total aseos</p>
            <p className="text-3xl font-semibold text-slate-900">{report.total}</p>
          </div>
          <div className="bg-slate-50 rounded-xl p-4">
            <p className="text-sm text-slate-500">Stickers retirados</p>
            <p className="text-lg font-semibold text-slate-900">
              {report.stickers?.stickers_true ?? 0} sí / {report.stickers?.stickers_false ?? 0} no
            </p>
          </div>
          <div className="bg-slate-50 rounded-xl p-4">
            <p className="text-sm text-slate-500">Grafitis retirados</p>
            <p className="text-lg font-semibold text-slate-900">
              {report.graffiti?.graffiti_true ?? 0} sí / {report.graffiti?.graffiti_false ?? 0} no
            </p>
          </div>
        </div>
      )}

      {report && (
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-slate-800">Distribución por tipo</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {report.byType.map((t: any) => (
              <div key={t.cleaning_type} className="rounded-xl border border-slate-200 p-3">
                <p className="text-xs text-slate-500">{t.cleaning_type}</p>
                <p className="text-2xl font-semibold text-slate-900">{t.total}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
