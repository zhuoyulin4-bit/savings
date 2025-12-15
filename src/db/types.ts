// Database types
export interface Session {
  id?: number;
  startTime: number;
  endTime?: number;
}

export interface HourChunk {
  id?: number;
  sessionId: number;
  timestamp: number;
  amount: number;
  status: 'pending' | 'collected';
  project?: string;
}

