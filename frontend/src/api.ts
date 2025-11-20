import axios from 'axios';
import { CleaningRecord, DashboardSummary, Role, Task, User } from './types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000',
});

export async function fetchUsers(role?: Role) {
  const res = await api.get<User[]>('/api/users', { params: { role } });
  return res.data;
}

export async function createUser(name: string, role: Role) {
  const res = await api.post<User>('/api/users', { name, role });
  return res.data;
}

export async function createCleaningRecord(data: {
  userId: string;
  ppu: string;
  busNumber: string;
  terminal: string;
  cleaningType: string;
  stickersRemoved: boolean;
  graffitiRemoved: boolean;
  imageFront?: File | null;
  imageBack?: File | null;
}) {
  const form = new FormData();
  form.append('userId', data.userId);
  form.append('ppu', data.ppu);
  form.append('busNumber', data.busNumber);
  form.append('terminal', data.terminal);
  form.append('cleaningType', data.cleaningType);
  form.append('stickersRemoved', String(data.stickersRemoved));
  form.append('graffitiRemoved', String(data.graffitiRemoved));
  if (data.imageFront) form.append('imageFront', data.imageFront);
  if (data.imageBack) form.append('imageBack', data.imageBack);
  const res = await api.post('/api/registrations', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data as CleaningRecord;
}

export async function fetchRecords(params: {
  userId?: string;
  startDate?: string;
  endDate?: string;
  terminal?: string;
  cleaningType?: string;
  ppu?: string;
}) {
  const res = await api.get<CleaningRecord[]>('/api/registrations', { params });
  return res.data;
}

export async function fetchRecentPpu(userId: string) {
  const res = await api.get<{ ppu: string; bus_number: string }[]>(
    '/api/registrations/recent/ppu',
    { params: { userId } }
  );
  return res.data;
}

export async function fetchTasks(params: { cleanerId?: string; status?: string }) {
  const res = await api.get<Task[]>('/api/tasks', { params });
  return res.data;
}

export async function createTask(payload: {
  cleanerId: string;
  supervisorId: string;
  content: string;
  title?: string;
}) {
  const res = await api.post<Task>('/api/tasks', payload);
  return res.data;
}

export async function completeTask(id: string) {
  const res = await api.patch<Task>(`/api/tasks/${id}/complete`);
  return res.data;
}

export async function fetchDashboardSummary() {
  const res = await api.get<DashboardSummary>('/api/dashboard/summary');
  return res.data;
}

export async function fetchCleanerReport(userId: string, params: { startDate?: string; endDate?: string } = {}) {
  const res = await api.get('/api/dashboard/cleaner/' + userId, { params });
  return res.data as {
    total: number;
    byType: { cleaning_type: string; total: number }[];
    stickers: { stickers_true: number; stickers_false: number };
    graffiti: { graffiti_true: number; graffiti_false: number };
  };
}

export async function fetchBreak(userId: string) {
  const res = await api.get('/api/breaks', { params: { userId } });
  return res.data as { break_time?: string };
}

export async function fetchBreaks() {
  const res = await api.get('/api/breaks');
  return res.data as any[];
}

export async function saveBreak(userId: string, breakTime: string) {
  const res = await api.post('/api/breaks', { userId, breakTime });
  return res.data;
}

export async function createInspection(payload: {
  cleaningId: string;
  supervisorId: string;
  passed: boolean;
  comments?: string;
}) {
  const res = await api.post('/api/inspections', payload);
  return res.data;
}

export async function fetchInspections(params: { cleanerId?: string; result?: string }) {
  const res = await api.get('/api/inspections', { params });
  return res.data;
}

export default api;
