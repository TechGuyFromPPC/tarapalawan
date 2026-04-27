'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from './supabase'; // Ensure this path matches your setup
import { User } from '@supabase/supabase-js';

// 1. Define what our "Brain" remembers
const ThemeContext = createContext({
  darkMode: false,
  toggleDarkMode: () => {},
  user: null as User | null,
  loading: true,
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [darkMode, setDarkMode] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

 useEffect(() => {
  // 1. Get initial session quietly
  supabase.auth.getSession().then(({ data: { session } }) => {
    setUser(session?.user ?? null);
  });

  // 2. Listen for changes (Sign In / Sign Out / Token Refresh)
  const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
    if (_event === 'SIGNED_OUT') {
      setUser(null);
    } else if (session) {
      setUser(session.user);
    }
  });

  return () => subscription.unsubscribe();
}, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode, user, loading }}>
      {children}
    </ThemeContext.Provider>
  );
}

// 3. The "Hook" to use this in any page
export const useTheme = () => useContext(ThemeContext);