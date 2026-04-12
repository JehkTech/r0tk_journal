import { createContext, useContext, useMemo, useState } from 'react';

const DEFAULT_EMOTIONS = [
  { id: 1, name: 'Fear' },
  { id: 2, name: 'Greed' },
  { id: 3, name: 'Joy' },
  { id: 4, name: 'Neutral' },
];

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [accountId] = useState(1);
  const [emotions] = useState(DEFAULT_EMOTIONS);

  const value = useMemo(
    () => ({
      accountId,
      emotions,
    }),
    [accountId, emotions]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used inside UserProvider');
  }
  return context;
}
