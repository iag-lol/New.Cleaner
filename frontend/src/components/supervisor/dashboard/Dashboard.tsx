import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, Bus } from 'lucide-react';
import { fetchDashboardSummary } from '../../../api';
import { DashboardSummary } from '../../../types';
import { useRealTimeEvents } from '../../../hooks/useRealTimeEvents';
import Card from '../../ui/Card';
import Badge from '../../ui/Badge';
import LiveIndicator from '../../ui/LiveIndicator';

export default function Dashboard() {
  const [data, setData] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const { subscribe } = useRealTimeEvents();

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

  useEffect(() => {
    const unsubscribe = subscribe('NEW_RECORD', () => {
      load();
    });
    return () => unsubscribe();
  }, [subscribe]);

  const stats = [
    { key: 'today', label: 'Hoy', icon: TrendingUp, gradient: 'primary' as const },
    { key: 'week', label: 'Semana', icon: Users, gradient: 'success' as const },
    { key: 'month', label: 'Mes', icon: Bus, gradient: 'info' as const },
  ];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <p className="text-sm text-slate-500">Visión general</p>
          <h2 className="text-2xl font-semibold text-slate-900">Dashboard</h2>
        </div>
        <div className="flex items-center gap-4">
          <LiveIndicator />
          <button
            onClick={load}
            className="text-sm bg-gradient-primary text-white px-4 py-2 rounded-lg font-semibold hover:shadow-glow-primary transition-all"
          >
            Actualizar
          </button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map(({ key, label, icon: Icon, gradient }, index) => (
          <Card key={key} gradient={gradient} hover glow>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between"
            >
              <div>
                <p className="text-sm font-semibold opacity-90">{label}</p>
                <motion.p
                  className="text-4xl font-bold mt-1"
                  key={data?.totals[key as keyof typeof data.totals]}
                  initial={{ scale: 1.2 }}
                  animate={{ scale: 1 }}
                >
                  {data ? data.totals[key as keyof typeof data.totals] : '-'}
                </motion.p>
              </div>
              <Icon className="w-12 h-12 opacity-80" />
            </motion.div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card hover>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-800">Top Cleaners</h3>
            <Badge variant="primary" pulse>
              {data?.topCleaners.length || 0}
            </Badge>
          </div>
          {loading && <p className="text-sm text-slate-500">Cargando...</p>}
          {!loading && data && (
            <div className="space-y-3">
              {data.topCleaners.map((c, index) => (
                <motion.div
                  key={c.user_id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 transition-all"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-900">{c.name}</p>
                    <div className="h-2 bg-slate-200 rounded-full overflow-hidden mt-1">
                      <motion.div
                        className="h-2 bg-gradient-primary"
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(100, Number(c.total) * 10)}%` }}
                        transition={{ duration: 0.8, delay: index * 0.1 }}
                      />
                    </div>
                  </div>
                  <Badge variant="primary">{c.total}</Badge>
                </motion.div>
              ))}
            </div>
          )}
        </Card>

        <Card hover>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-800">Aseos por Terminal</h3>
            <Badge variant="success">{data?.byTerminal.length || 0}</Badge>
          </div>
          {loading && <p className="text-sm text-slate-500">Cargando...</p>}
          {!loading && data && (
            <div className="space-y-2">
              {data.byTerminal.map((t, index) => (
                <motion.div
                  key={t.terminal}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-emerald-50 to-teal-50 hover:from-emerald-100 hover:to-teal-100 transition-all"
                >
                  <span className="text-sm font-semibold text-slate-800">{t.terminal}</span>
                  <Badge variant="success">{t.total}</Badge>
                </motion.div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <Card hover>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-800">Distribución por Tipo de Aseo</h3>
        </div>
        {loading && <p className="text-sm text-slate-500">Cargando...</p>}
        {!loading && data && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {data.byType.map((t, index) => (
              <motion.div
                key={t.cleaning_type}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl p-4 border border-cyan-100 hover:shadow-lg transition-all"
              >
                <p className="text-xs font-semibold text-cyan-700 uppercase">{t.cleaning_type}</p>
                <motion.p
                  className="text-3xl font-bold text-cyan-900 mt-1"
                  key={t.total}
                  initial={{ scale: 1.2 }}
                  animate={{ scale: 1 }}
                >
                  {t.total}
                </motion.p>
              </motion.div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
