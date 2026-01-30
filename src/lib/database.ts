import { openDB, DBSchema, IDBPDatabase } from 'idb';

// Database schema types
export interface Profile {
  id: string;
  role: 'patient' | 'caregiver' | 'supporter';
  patientName?: string;
  hasSeenWelcome: boolean;
  hasAcknowledgedAI: boolean;
  createdAt: string;
  lastBackup?: string;
}

export interface GoodDayEntry {
  id: string;
  date: string;
  content: string;
  tags?: string[];
  createdAt: string;
}

export interface SymptomEntry {
  id: string;
  date: string;
  symptom: string;
  severity: 1 | 2 | 3 | 4 | 5;
  notes?: string;
  relatedTo?: 'treatment' | 'medication' | 'other';
  createdAt: string;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate?: string;
  notes?: string;
  reminders: boolean;
}

export interface Appointment {
  id: string;
  date: string;
  type: 'oncologist' | 'gp' | 'specialist' | 'treatment' | 'scan' | 'other';
  location?: string;
  questions: string[];
  notes?: string;
  completed: boolean;
}

export interface TimelineEntry {
  id: string;
  date: string;
  type: 'diagnosis' | 'treatment' | 'scan' | 'milestone' | 'note';
  title: string;
  content?: string;
  createdAt: string;
}

export interface Note {
  id: string;
  title?: string;
  content: string;
  category?: 'medical' | 'emotional' | 'practical' | 'other';
  pinned: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Conversation {
  id: string;
  messages: {
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
  }[];
  createdAt: string;
}

export interface Settings {
  id: string;
  theme: 'light' | 'dark' | 'auto';
  fontSize: 'normal' | 'large' | 'larger';
  voiceEnabled: boolean;
  notificationsEnabled: boolean;
  groqApiKey?: string;
}

// IndexedDB Schema
interface BesideYouDB extends DBSchema {
  profile: {
    key: string;
    value: Profile;
  };
  goodDays: {
    key: string;
    value: GoodDayEntry;
    indexes: { 'by-date': string };
  };
  symptoms: {
    key: string;
    value: SymptomEntry;
    indexes: { 'by-date': string };
  };
  medications: {
    key: string;
    value: Medication;
  };
  appointments: {
    key: string;
    value: Appointment;
    indexes: { 'by-date': string };
  };
  timeline: {
    key: string;
    value: TimelineEntry;
    indexes: { 'by-date': string };
  };
  notes: {
    key: string;
    value: Note;
    indexes: { 'by-updated': string };
  };
  conversations: {
    key: string;
    value: Conversation;
  };
  glossaryFavorites: {
    key: string;
    value: { id: string; termId: string };
  };
  settings: {
    key: string;
    value: Settings;
  };
}

const DB_NAME = 'besideyou';
const DB_VERSION = 1;

let dbInstance: IDBPDatabase<BesideYouDB> | null = null;

export async function initDatabase(): Promise<IDBPDatabase<BesideYouDB>> {
  if (dbInstance) return dbInstance;

  dbInstance = await openDB<BesideYouDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Profile store
      if (!db.objectStoreNames.contains('profile')) {
        db.createObjectStore('profile', { keyPath: 'id' });
      }

      // Good Days store with date index
      if (!db.objectStoreNames.contains('goodDays')) {
        const goodDaysStore = db.createObjectStore('goodDays', { keyPath: 'id' });
        goodDaysStore.createIndex('by-date', 'date');
      }

      // Symptoms store with date index
      if (!db.objectStoreNames.contains('symptoms')) {
        const symptomsStore = db.createObjectStore('symptoms', { keyPath: 'id' });
        symptomsStore.createIndex('by-date', 'date');
      }

      // Medications store
      if (!db.objectStoreNames.contains('medications')) {
        db.createObjectStore('medications', { keyPath: 'id' });
      }

      // Appointments store with date index
      if (!db.objectStoreNames.contains('appointments')) {
        const appointmentsStore = db.createObjectStore('appointments', { keyPath: 'id' });
        appointmentsStore.createIndex('by-date', 'date');
      }

      // Timeline store with date index
      if (!db.objectStoreNames.contains('timeline')) {
        const timelineStore = db.createObjectStore('timeline', { keyPath: 'id' });
        timelineStore.createIndex('by-date', 'date');
      }

      // Notes store with updated index
      if (!db.objectStoreNames.contains('notes')) {
        const notesStore = db.createObjectStore('notes', { keyPath: 'id' });
        notesStore.createIndex('by-updated', 'updatedAt');
      }

      // Conversations store
      if (!db.objectStoreNames.contains('conversations')) {
        db.createObjectStore('conversations', { keyPath: 'id' });
      }

      // Glossary favorites store
      if (!db.objectStoreNames.contains('glossaryFavorites')) {
        db.createObjectStore('glossaryFavorites', { keyPath: 'id' });
      }

      // Settings store
      if (!db.objectStoreNames.contains('settings')) {
        db.createObjectStore('settings', { keyPath: 'id' });
      }
    },
  });

  return dbInstance;
}

// Helper to generate unique IDs
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Profile operations
export async function getProfile(): Promise<Profile | undefined> {
  const db = await initDatabase();
  return db.get('profile', 'main');
}

export async function saveProfile(profile: Profile): Promise<void> {
  const db = await initDatabase();
  await db.put('profile', profile);
}

// Good Days operations
export async function getGoodDays(): Promise<GoodDayEntry[]> {
  const db = await initDatabase();
  return db.getAllFromIndex('goodDays', 'by-date');
}

export async function addGoodDay(entry: Omit<GoodDayEntry, 'id' | 'createdAt'>): Promise<GoodDayEntry> {
  const db = await initDatabase();
  const newEntry: GoodDayEntry = {
    ...entry,
    id: generateId(),
    createdAt: new Date().toISOString(),
  };
  await db.add('goodDays', newEntry);
  return newEntry;
}

export async function deleteGoodDay(id: string): Promise<void> {
  const db = await initDatabase();
  await db.delete('goodDays', id);
}

// Symptom operations
export async function getSymptoms(): Promise<SymptomEntry[]> {
  const db = await initDatabase();
  return db.getAllFromIndex('symptoms', 'by-date');
}

export async function addSymptom(entry: Omit<SymptomEntry, 'id' | 'createdAt'>): Promise<SymptomEntry> {
  const db = await initDatabase();
  const newEntry: SymptomEntry = {
    ...entry,
    id: generateId(),
    createdAt: new Date().toISOString(),
  };
  await db.add('symptoms', newEntry);
  return newEntry;
}

export async function deleteSymptom(id: string): Promise<void> {
  const db = await initDatabase();
  await db.delete('symptoms', id);
}

// Settings operations
export async function getSettings(): Promise<Settings | undefined> {
  const db = await initDatabase();
  return db.get('settings', 'main');
}

export async function saveSettings(settings: Settings): Promise<void> {
  const db = await initDatabase();
  await db.put('settings', settings);
}

// Notes operations
export async function getNotes(): Promise<Note[]> {
  const db = await initDatabase();
  const notes = await db.getAllFromIndex('notes', 'by-updated');
  return notes.reverse(); // Most recent first
}

export async function addNote(note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>): Promise<Note> {
  const db = await initDatabase();
  const now = new Date().toISOString();
  const newNote: Note = {
    ...note,
    id: generateId(),
    createdAt: now,
    updatedAt: now,
  };
  await db.add('notes', newNote);
  return newNote;
}

export async function updateNote(note: Note): Promise<void> {
  const db = await initDatabase();
  await db.put('notes', { ...note, updatedAt: new Date().toISOString() });
}

export async function deleteNote(id: string): Promise<void> {
  const db = await initDatabase();
  await db.delete('notes', id);
}

// Export all data for backup
export async function exportAllData(): Promise<object> {
  const db = await initDatabase();
  
  const data = {
    profile: await db.get('profile', 'main'),
    goodDays: await db.getAll('goodDays'),
    symptoms: await db.getAll('symptoms'),
    medications: await db.getAll('medications'),
    appointments: await db.getAll('appointments'),
    timeline: await db.getAll('timeline'),
    notes: await db.getAll('notes'),
    glossaryFavorites: await db.getAll('glossaryFavorites'),
    settings: await db.get('settings', 'main'),
    exportedAt: new Date().toISOString(),
  };
  
  return data;
}
