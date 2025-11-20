import { useEffect, useState } from 'react';
import { fetchDashboardSummary } from '../../../api';
import { DashboardSummary } from '../../../types';

export default function Dashboard() {
  const [data, setData] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const res = await fetchDashboardSummary();
      setData(res);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">Visión general</p>
          <h2 className="text-2xl font-semibold text-slate-900">Dashboard</h2>
        </div>
        <button onClick={load} className="text-sm text-brand-600 font-semibold">
          Actualizar
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {['today', 'week', 'month'].map((k) => (
          <div key={k} className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
            <p className="text-xs uppercase text-slate-500">
              {k === 'today' ? 'Hoy' : k === 'week' ? 'Semana' : 'Mes'}
            </p>
            <p className="text-3xl font-semibold text-slate-900">
              {data ? data.totals[k as keyof typeof data.totals] : '-'}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card title="Top cleaners">
          {loading && <p className="text-sm text-slate-500">Cargando...</p>}
          {!loading && data && (
            <div className="space-y-2">
              {data.topCleaners.map((c) => (
                <div key={c.user_id} className="flex items-center gap-3">
                  <div className="w-2 rounded-full bg-brand-500 h-8" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-900">{c.name}</p>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-2 bg-brand-500"
                        style={{
                          width: `${Math.min(100, Number(c.total) * 10)}%`,
                        }}
                      />
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-slate-700">{c.total}</span>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card title="Aseos por terminal">
          {loading && <p className="text-sm text-slate-500">Cargando...</p>}
          {!loading && data && (
            <div className="space-y-2">
              {data.byTerminal.map((t) => (
                <div key={t.terminal} className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-800">{t.terminal}</span>
                  <span className="text-sm text-slate-600">{t.total}</span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <Card title="Distribución por tipo de aseo">
        {loading && <p className="text-sm text-slate-500">Cargando...</p>}
        {!loading && data && (
          <div className="flex gap-3">
            {data.byType.map((t) => (
              <div
                key={t.cleaning_type}
                className="flex-1 bg-white border border-slate-100 rounded-xl p-3 shadow-sm"
              >
                <p className="text-xs text-slate-500">{t.cleaning_type}</p>
                <p className="text-2xl font-semibold text-slate-900">{t.total}</p>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-800">{title}</h3>
      </div>
      {children}
    </section>
  );
}
