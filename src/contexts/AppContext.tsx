import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  Profile,
  Settings,
  getProfile,
  saveProfile,
  getSettings,
  saveSettings,
  initDatabase,
} from '@/lib/database';

interface AppContextType {
  profile: Profile | null;
  settings: Settings | null;
  isLoading: boolean;
  isOnboarded: boolean;
  updateProfile: (profile: Partial<Profile>) => Promise<void>;
  updateSettings: (settings: Partial<Settings>) => Promise<void>;
  completeOnboarding: (role: 'patient' | 'caregiver' | 'supporter') => Promise<void>;
  acknowledgeAI: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const defaultSettings: Settings = {
  id: 'main',
  theme: 'auto',
  fontSize: 'normal',
  voiceEnabled: true,
  notificationsEnabled: false,
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        await initDatabase();
        
        const [loadedProfile, loadedSettings] = await Promise.all([
          getProfile(),
          getSettings(),
        ]);

        if (loadedProfile) {
          setProfile(loadedProfile);
        }

        if (loadedSettings) {
          setSettings(loadedSettings);
        } else {
          // Initialize default settings
          await saveSettings(defaultSettings);
          setSettings(defaultSettings);
        }
      } catch (error) {
        console.error('Failed to load app data:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  // Apply theme and font size
  useEffect(() => {
    if (!settings) return;

    // Apply theme
    const root = document.documentElement;
    if (settings.theme === 'dark') {
      root.classList.add('dark');
    } else if (settings.theme === 'light') {
      root.classList.remove('dark');
    } else {
      // Auto - follow system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.toggle('dark', prefersDark);
    }

    // Apply font size
    root.classList.remove('text-larger', 'text-largest');
    if (settings.fontSize === 'large') {
      root.classList.add('text-larger');
    } else if (settings.fontSize === 'larger') {
      root.classList.add('text-largest');
    }
  }, [settings]);

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!profile) return;
    const updatedProfile = { ...profile, ...updates };
    await saveProfile(updatedProfile);
    setProfile(updatedProfile);
  };

  const updateSettings = async (updates: Partial<Settings>) => {
    const currentSettings = settings || defaultSettings;
    const updatedSettings = { ...currentSettings, ...updates };
    await saveSettings(updatedSettings);
    setSettings(updatedSettings);
  };

  const completeOnboarding = async (role: 'patient' | 'caregiver' | 'supporter') => {
    const newProfile: Profile = {
      id: 'main',
      role,
      hasSeenWelcome: true,
      hasAcknowledgedAI: false,
      createdAt: new Date().toISOString(),
    };
    await saveProfile(newProfile);
    setProfile(newProfile);
  };

  const acknowledgeAI = async () => {
    if (!profile) return;
    const updatedProfile = { ...profile, hasAcknowledgedAI: true };
    await saveProfile(updatedProfile);
    setProfile(updatedProfile);
  };

  const isOnboarded = profile?.hasSeenWelcome ?? false;

  return (
    <AppContext.Provider
      value={{
        profile,
        settings,
        isLoading,
        isOnboarded,
        updateProfile,
        updateSettings,
        completeOnboarding,
        acknowledgeAI,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
