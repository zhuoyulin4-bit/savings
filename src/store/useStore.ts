import { create } from 'zustand'
import { db } from '../db/db'

interface State {
  status: 'idle' | 'working' | 'settlement'
  startTime: number | null
  lastSettledTime: number | null
  sessionId: number | null
  totalAssets: number
  hourlyRate: number
  unclaimedHours: number
  
  startWork: () => Promise<void>
  stopWork: () => Promise<void>
  checkTime: () => void
  triggerSettlement: () => void
  completeSettlement: (projectTag: string) => Promise<void>
  addAssets: (amount: number) => void
}

const HOUR_MS = 3600 * 1000 // 真实 1 小时
const DEV_HOUR_MS = 10 * 1000 // 10 秒测试模式

// 可以通过环境变量切换测试/正式模式
const TIME_UNIT = import.meta.env.DEV && false ? DEV_HOUR_MS : HOUR_MS 

export const useStore = create<State>((set, get) => ({
  status: 'idle',
  startTime: null,
  lastSettledTime: null,
  sessionId: null,
  totalAssets: 0, // 从 0 开始
  hourlyRate: 350,
  unclaimedHours: 0,

  startWork: async () => {
    const now = Date.now()
    try {
      const id = await db.sessions.add({ startTime: now })
      set({ 
        status: 'working', 
        startTime: now, 
        lastSettledTime: now,
        sessionId: id as number
      })
    } catch (e) {
      console.error('Failed to start session', e)
      set({ 
        status: 'working', 
        startTime: now, 
        lastSettledTime: now,
        sessionId: Date.now()
      })
    }
  },

  stopWork: async () => {
    const { sessionId } = get()
    if (sessionId) {
      try {
        await db.sessions.update(sessionId, { endTime: Date.now() })
      } catch (e) {
        console.error('Failed to update session', e)
      }
    }
    set({ 
      status: 'idle', 
      startTime: null, 
      lastSettledTime: null,
      sessionId: null 
    })
  },

  checkTime: () => {
    const { status, lastSettledTime } = get()
    if (status !== 'working' || !lastSettledTime) return

    const now = Date.now()
    const diff = now - lastSettledTime
    
    if (diff >= TIME_UNIT) {
      const hoursPassed = Math.floor(diff / TIME_UNIT)
      set({ 
        status: 'settlement',
        unclaimedHours: hoursPassed
      })
    }
  },

  triggerSettlement: () => set({ status: 'settlement' }),

  completeSettlement: async (projectTag) => {
    const { totalAssets, hourlyRate, lastSettledTime, unclaimedHours, sessionId } = get()
    
    const newAssets = totalAssets + hourlyRate
    const newLastSettledTime = (lastSettledTime || 0) + TIME_UNIT
    
    if (sessionId) {
      try {
        await db.hourChunks.add({
          sessionId,
          timestamp: Date.now(),
          amount: hourlyRate,
          status: 'collected',
          project: projectTag
        })
      } catch (e) {
        console.error('Failed to save chunk', e)
      }
    }

    set({ 
      status: 'working', 
      totalAssets: newAssets,
      lastSettledTime: newLastSettledTime,
      unclaimedHours: Math.max(0, unclaimedHours - 1)
    })
  },

  addAssets: (amount) => set((state) => ({ totalAssets: state.totalAssets + amount })),
}))
