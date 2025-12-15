import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { db, type HourChunk } from '../db/db'

export function Vault() {
  const [chunks, setChunks] = useState<HourChunk[]>([])

  useEffect(() => {
    db.hourChunks.orderBy('timestamp').reverse().toArray().then(setChunks)
  }, [])

  const formatDate = (ts: number) => {
    return new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }
  
  const formatTime = (ts: number) => {
    return new Date(ts).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  }

  // 胶囊颜色映射
  const getCapsuleColor = (tag: string = 'Other') => {
    const map: Record<string, string> = {
      'Design': 'bg-pink-400',
      'Code': 'bg-blue-400',
      'Meeting': 'bg-purple-400',
      'Debug': 'bg-red-400',
      'Plan': 'bg-yellow-400',
      'Relax': 'bg-green-400',
      'Other': 'bg-gray-400'
    }
    return map[tag] || map['Other']
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col items-center py-8 px-4 pb-safe">
      <style>{`
        .pb-safe { padding-bottom: env(safe-area-inset-bottom, 24px); }
      `}</style>

      {/* Header */}
      <div className="w-full max-w-md flex items-center justify-between mb-8">
        <Link to="/" className="text-2xl hover:scale-110 transition-transform">
          ⬅️
        </Link>
        <h1 className="text-2xl font-black text-gray-800 font-mono border-b-4 border-black pb-1">CAPSULE LOG</h1>
        <div className="w-8" /> {/* Placeholder */}
      </div>

      {/* List */}
      <div className="w-full max-w-md space-y-4">
        {chunks.length === 0 ? (
          <div className="text-center py-20 opacity-50">
            <p className="text-4xl mb-4">📭</p>
            <p className="font-bold">No capsules yet.</p>
          </div>
        ) : (
          chunks.map((chunk) => (
            <div 
              key={chunk.id} 
              className="bg-white border-4 border-black p-4 rounded-xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center gap-4"
            >
              {/* 胶囊图标 */}
              <div className={`w-12 h-12 rounded-full border-4 border-black flex items-center justify-center text-xl shrink-0 ${getCapsuleColor(chunk.project)}`}>
                 💊
              </div>
              
              {/* 信息 */}
              <div className="flex-1">
                <div className="flex justify-between items-start">
                   <h3 className="font-black text-lg text-gray-800">{chunk.project || 'Unknown'}</h3>
                   <span className="font-mono font-bold text-green-600">+¥{chunk.amount}</span>
                </div>
                <div className="flex justify-between items-center mt-1">
                   <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                     {formatDate(chunk.timestamp)} • {formatTime(chunk.timestamp)}
                   </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      
      {/* 底部汇总 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t-4 border-black p-4 pb-8 flex justify-center shadow-[0_-4px_10px_rgba(0,0,0,0.1)]">
         <p className="font-mono text-sm font-bold text-gray-500">
            TOTAL COLLECTED: <span className="text-black text-lg">¥{chunks.reduce((acc, c) => acc + c.amount, 0).toLocaleString()}</span>
         </p>
      </div>
    </div>
  )
}
