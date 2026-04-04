import { useState } from 'react';
import { User } from '../types/User';

export const useUser = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return {
    user,
    setUser,
    loading,
    setLoading,
    error,
    setError,
  };
};
