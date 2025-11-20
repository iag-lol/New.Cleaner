import { useEffect, useMemo, useState } from 'react';
import { createUser, fetchUsers } from '../api';
import { Role, User } from '../types';

interface Props {
  onUserReady: (user: User) => void;
}

export default function UserGate({ onUserReady }: Props) {
  const [role, setRole] = useState<Role>('CLEANER');
  const [name, setName] = useState('');
  const [knownUsers, setKnownUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers()
      .then(setKnownUsers)
      .catch(() => setKnownUsers([]));
  }, []);

  const namesByRole = useMemo(
    () => knownUsers.filter((u) => u.role === role).map((u) => u.name),
    [knownUsers, role]
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setError('Debe ingresar un nombre');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const user = await createUser(name.trim(), role);
      localStorage.setItem('aseo-user', JSON.stringify(user));
      onUserReady(user);
    } catch (err) {
      setError('No pudimos guardar el usuario. Intente de nuevo.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 px-4">
      <div className="bg-white shadow-card rounded-2xl p-8 w-full max-w-lg border border-slate-100 space-y-6">
        <div>
          <p className="text-sm text-slate-500">Sistema de</p>
          <h1 className="text-2xl font-semibold text-slate-900">Registro de Aseo de Buses</h1>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setRole('CLEANER')}
              className={`flex-1 rounded-xl border px-4 py-3 text-sm font-semibold shadow-sm transition ${
                role === 'CLEANER'
                  ? 'bg-brand-600 text-white border-brand-600'
                  : 'bg-slate-50 text-slate-700 border-slate-200'
              }`}
            >
              Soy CLEANER
            </button>
            <button
              type="button"
              onClick={() => setRole('SUPERVISOR')}
              className={`flex-1 rounded-xl border px-4 py-3 text-sm font-semibold shadow-sm transition ${
                role === 'SUPERVISOR'
                  ? 'bg-brand-600 text-white border-brand-600'
                  : 'bg-slate-50 text-slate-700 border-slate-200'
              }`}
            >
              Soy SUPERVISOR
            </button>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-600">Nombre</label>
            <input
              list="user-names"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Juan Pérez"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-brand-400"
            />
            <datalist id="user-names">
              {namesByRole.map((n) => (
                <option value={n} key={n} />
              ))}
            </datalist>
            <p className="text-xs text-slate-500">
              Se guardan los nombres usados para reutilizarlos rápidamente.
            </p>
          </div>
          {error && <div className="text-sm text-red-600">{error}</div>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-brand-600 text-white font-semibold py-3 shadow-card hover:bg-brand-700 transition disabled:opacity-60"
          >
            {loading ? 'Guardando...' : 'Ingresar'}
          </button>
        </form>
      </div>
    </div>
  );
}
