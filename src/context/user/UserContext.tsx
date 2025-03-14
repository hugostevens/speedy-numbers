
import React, { createContext } from 'react';
import { UserContextType } from './types';
import { Badge } from '@/types';

// Create the context with default values
const UserContext = createContext<UserContextType>({
  user: null,
  session: null,
  isLoading: true,
  updateStreak: () => {},
  updateDailyGoal: () => {},
  addBadge: () => {},
  updateTheme: () => {},
  signOut: async () => {},
});

export default UserContext;
