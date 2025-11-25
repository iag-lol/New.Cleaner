import { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import UserGate from './components/UserGate';
import CleanerShell from './components/cleaner/CleanerShell';
import SupervisorShell from './components/supervisor/SupervisorShell';
import { User } from './types';

export default function App() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const cached = localStorage.getItem('aseo-user');
    if (cached) {
      try {
        setUser(JSON.parse(cached));
      } catch {
        setUser(null);
      }
    }
  }, []);

  if (!user) {
    return (
      <>
        <UserGate onUserReady={setUser} />
        <Toaster position="top-right" />
      </>
    );
  }

  return (
    <>
      {user.role === 'CLEANER' ? (
        <CleanerShell user={user} onSwitchUser={() => setUser(null)} />
      ) : (
        <SupervisorShell user={user} onSwitchUser={() => setUser(null)} />
      )}
      <Toaster position="top-right" />
    </>
  );
}
