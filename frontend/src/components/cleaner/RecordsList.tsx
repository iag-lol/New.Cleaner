import { useEffect, useState } from 'react';
import { fetchRecords } from '../../api';
import { CleaningRecord, User } from '../../types';

interface Props {
  user: User;
  refreshKey: number;
}

export default function RecordsList({ user, refreshKey }: Props) {
  const [records, setRecords] = useState<CleaningRecord[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const data = await fetchRecords({ userId: user.id });
      setRecords(data);
    } catch {
      setRecords([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [refreshKey]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">Total aseos realizados</p>
          <h3 className="text-3xl font-semibold text-slate-900">{records.length}</h3>
        </div>
        <button
          onClick={load}
          className="text-sm text-brand-600 font-semibold hover:underline"
        >
          Actualizar
        </button>
      </div>
      <div className="space-y-3">
        {loading && <div className="text-sm text-slate-500">Cargando registros...</div>}
        {!loading && records.length === 0 && (
          <div className="text-sm text-slate-500">Aún no hay registros.</div>
        )}
        {records.map((r) => (
          <article
            key={r.id}
            className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase text-brand-600 tracking-wide">{r.cleaning_type}</p>
                <h4 className="text-lg font-semibold text-slate-900">{r.ppu}</h4>
              </div>
              <div className="text-right text-sm text-slate-500">
                <p>{new Date(r.created_at || '').toLocaleDateString()}</p>
                <p>{new Date(r.created_at || '').toLocaleTimeString()}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm text-slate-600 mt-2">
              <p>Interno: <span className="font-semibold text-slate-800">{r.bus_number}</span></p>
              <p>Terminal: <span className="font-semibold text-slate-800">{r.terminal}</span></p>
              <p>Stickers: <span className="font-semibold">{r.stickers_removed ? 'Sí' : 'No'}</span></p>
              <p>Grafitis: <span className="font-semibold">{r.graffiti_removed ? 'Sí' : 'No'}</span></p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
