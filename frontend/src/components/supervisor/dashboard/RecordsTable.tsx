import { useEffect, useState } from 'react';
import { fetchRecords, fetchUsers } from '../../../api';
import { CleaningRecord, User } from '../../../types';

export default function RecordsTable() {
  const [records, setRecords] = useState<CleaningRecord[]>([]);
  const [filters, setFilters] = useState({
    terminal: '',
    cleaningType: '',
    cleanerId: '',
    ppu: '',
  });
  const [cleaners, setCleaners] = useState<User[]>([]);
  const [selected, setSelected] = useState<CleaningRecord | null>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const data = await fetchRecords({
        terminal: filters.terminal || undefined,
        cleaningType: filters.cleaningType || undefined,
        userId: filters.cleanerId || undefined,
        ppu: filters.ppu || undefined,
      });
      setRecords(data);
    } catch {
      setRecords([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUsers('CLEANER').then(setCleaners);
  }, []);

  useEffect(() => {
    load();
  }, [filters]);

  return (
    <section className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Registros de aseo</h3>
          <p className="text-sm text-slate-500">Filtra por terminal, cleaner o tipo</p>
        </div>
        <span className="text-sm text-slate-500">Total: {records.length}</span>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <input
          placeholder="Filtrar por PPU"
          value={filters.ppu}
          onChange={(e) => setFilters((f) => ({ ...f, ppu: e.target.value }))}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
        />
        <select
          value={filters.cleanerId}
          onChange={(e) => setFilters((f) => ({ ...f, cleanerId: e.target.value }))}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm bg-white"
        >
          <option value="">Cleaner</option>
          {cleaners.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <select
          value={filters.terminal}
          onChange={(e) => setFilters((f) => ({ ...f, terminal: e.target.value }))}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm bg-white"
        >
          <option value="">Terminal</option>
          {['EL ROBLE', 'LA REINA', 'MARIA ANGELICA', 'EL DESCANSO'].map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
        <select
          value={filters.cleaningType}
          onChange={(e) => setFilters((f) => ({ ...f, cleaningType: e.target.value }))}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm bg-white"
        >
          <option value="">Tipo de aseo</option>
          {['BARRIDO', 'BARRIDO + TRAPEADO', 'FULL'].map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </div>

      {loading && <p className="text-sm text-slate-500">Cargando...</p>}

      <div className="overflow-auto rounded-xl border border-slate-100">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              {['Fecha/Hora', 'PPU', 'Interno', 'Terminal', 'Tipo', 'Stickers', 'Grafiti', ''].map(
                (h) => (
                  <th key={h} className="text-left px-3 py-2 font-semibold">
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {records.map((r) => (
              <tr key={r.id} className="border-t border-slate-100">
                <td className="px-3 py-2 text-slate-600">
                  {new Date(r.created_at || '').toLocaleString()}
                </td>
                <td className="px-3 py-2 font-semibold text-slate-900">{r.ppu}</td>
                <td className="px-3 py-2 text-slate-700">{r.bus_number}</td>
                <td className="px-3 py-2 text-slate-700">{r.terminal}</td>
                <td className="px-3 py-2 text-slate-700">{r.cleaning_type}</td>
                <td className="px-3 py-2">{r.stickers_removed ? 'Sí' : 'No'}</td>
                <td className="px-3 py-2">{r.graffiti_removed ? 'Sí' : 'No'}</td>
                <td className="px-3 py-2">
                  <button
                    className="text-brand-600 font-semibold"
                    onClick={() => setSelected(r)}
                  >
                    Ver detalle
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected && (
        <div className="fixed inset-0 bg-slate-900/50 z-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-3xl w-full overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <div>
                <p className="text-xs uppercase text-brand-600">Detalle de registro</p>
                <h4 className="text-lg font-semibold text-slate-900">{selected.ppu}</h4>
              </div>
              <button onClick={() => setSelected(null)} className="text-slate-500">
                Cerrar
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 text-sm text-slate-700">
              <div className="space-y-1">
                <p><span className="font-semibold">Interno:</span> {selected.bus_number}</p>
                <p><span className="font-semibold">Terminal:</span> {selected.terminal}</p>
                <p><span className="font-semibold">Tipo:</span> {selected.cleaning_type}</p>
                <p><span className="font-semibold">Fecha:</span> {new Date(selected.created_at || '').toLocaleString()}</p>
                <p><span className="font-semibold">Stickers:</span> {selected.stickers_removed ? 'Sí' : 'No'}</p>
                <p><span className="font-semibold">Grafitis:</span> {selected.graffiti_removed ? 'Sí' : 'No'}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {selected.image_front_url && (
                  <img src={selected.image_front_url} alt="Interior frontal" className="rounded-xl border" />
                )}
                {selected.image_back_url && (
                  <img src={selected.image_back_url} alt="Interior atrás" className="rounded-xl border" />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
