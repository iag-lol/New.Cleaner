import { useEffect, useMemo, useState } from 'react';
import { createCleaningRecord, fetchRecentPpu } from '../../api';
import { User } from '../../types';

interface Props {
  user: User;
  onClose: () => void;
  onSaved?: () => void;
}

const terminals = ['EL ROBLE', 'LA REINA', 'MARIA ANGELICA', 'EL DESCANSO'];
const cleaningTypes = [
  { id: 'BARRIDO', label: 'Barrido' },
  { id: 'BARRIDO + TRAPEADO', label: 'Barrido + Trapeado' },
  {
    id: 'FULL',
    label: 'FULL (Barrido + Trapeado + Cabina + Gomas + Fierros)',
  },
];

export default function CleaningForm({ user, onClose, onSaved }: Props) {
  const [ppu, setPpu] = useState('');
  const [busNumber, setBusNumber] = useState('');
  const [terminal, setTerminal] = useState(terminals[0]);
  const [cleaningType, setCleaningType] = useState(cleaningTypes[1].id);
  const [stickers, setStickers] = useState(false);
  const [graffiti, setGraffiti] = useState(false);
  const [imageFront, setImageFront] = useState<File | null>(null);
  const [imageBack, setImageBack] = useState<File | null>(null);
  const [recent, setRecent] = useState<{ ppu: string; bus_number: string }[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRecentPpu(user.id)
      .then(setRecent)
      .catch(() => setRecent([]));
  }, [user.id]);

  useEffect(() => {
    const match = recent.find((r) => r.ppu.toLowerCase() === ppu.toLowerCase());
    if (match) {
      setBusNumber(match.bus_number);
    }
  }, [ppu, recent]);

  const now = useMemo(() => new Date().toLocaleString(), []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!ppu || !busNumber) {
      setError('PPU y número interno son obligatorios');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await createCleaningRecord({
        userId: user.id,
        ppu,
        busNumber,
        terminal,
        cleaningType,
        stickersRemoved: stickers,
        graffitiRemoved: graffiti,
        imageFront,
        imageBack,
      });
      onSaved?.();
      setSuccess(true);
      setTimeout(onClose, 800);
    } catch (err) {
      setError('Hubo un problema al guardar. Revisa la conexión e intenta nuevamente.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-slate-900/50 z-30 flex items-end md:items-center justify-center">
      <div className="bg-white w-full md:max-w-2xl rounded-t-3xl md:rounded-2xl overflow-y-auto max-h-[95vh]">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div>
            <p className="text-xs uppercase text-brand-600">Nuevo registro</p>
            <h3 className="text-lg font-semibold text-slate-900">Formulario de aseo</h3>
          </div>
          <button className="text-slate-500 hover:text-slate-800" onClick={onClose}>
            Cerrar
          </button>
        </div>
        <form className="px-6 py-4 space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">PPU</label>
              <input
                list="recent-ppu"
                value={ppu}
                onChange={(e) => setPpu(e.target.value.toUpperCase())}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:ring-2 focus:ring-brand-400 focus:outline-none"
              />
              <datalist id="recent-ppu">
                {recent.map((r) => (
                  <option value={r.ppu} key={r.ppu} />
                ))}
              </datalist>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">N° Interno</label>
              <input
                value={busNumber}
                onChange={(e) => setBusNumber(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:ring-2 focus:ring-brand-400 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Terminal</label>
              <select
                value={terminal}
                onChange={(e) => setTerminal(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:ring-2 focus:ring-brand-400 focus:outline-none bg-white"
              >
                {terminals.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Tipo de aseo</label>
              <select
                value={cleaningType}
                onChange={(e) => setCleaningType(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:ring-2 focus:ring-brand-400 focus:outline-none bg-white"
              >
                {cleaningTypes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex items-center gap-3 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={stickers}
                onChange={(e) => setStickers(e.target.checked)}
                className="w-5 h-5 text-brand-600"
              />
              Stickers retirados (Sí/No)
            </label>
            <label className="flex items-center gap-3 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={graffiti}
                onChange={(e) => setGraffiti(e.target.checked)}
                className="w-5 h-5 text-brand-600"
              />
              Grafitis retirados (Sí/No)
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Imagen interior frontal</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFront(e.target.files?.[0] || null)}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 bg-white"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Imagen interior atrás</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageBack(e.target.files?.[0] || null)}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 bg-white"
              />
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl px-4 py-3 text-sm text-slate-700 flex items-center justify-between">
            <div>
              <p className="font-semibold">{user.name}</p>
              <p className="text-xs text-slate-500">Hora actual: {now}</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-semibold">
              CLEANER
            </span>
          </div>

          {error && <div className="text-sm text-red-600">{error}</div>}
          {success && <div className="text-sm text-green-600">Registro enviado con éxito</div>}

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-slate-200 py-3 font-semibold text-slate-700"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 rounded-xl bg-brand-600 text-white py-3 font-semibold shadow-card hover:bg-brand-700 transition disabled:opacity-60"
            >
              {submitting ? 'Enviando...' : 'Enviar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
