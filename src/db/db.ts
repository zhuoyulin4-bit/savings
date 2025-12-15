import Dexie from 'dexie';
import type { Session, HourChunk } from './types';

// Re-export types
export type { Session, HourChunk };

class TimeNebulaDB extends Dexie {
  sessions!: Dexie.Table<Session, number>;
  hourChunks!: Dexie.Table<HourChunk, number>;

  constructor() {
    super('TimeNebulaDB');
    this.version(1).stores({
      sessions: '++id, startTime, endTime',
      hourChunks: '++id, sessionId, timestamp, status, project'
    });
  }
}

export const db = new TimeNebulaDB();
