import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../store/useStore'

export function UI() {
  const { status, totalAssets, startTime, startWork, stopWork, completeSettlement } = useStore()
  const [holding, setHolding] = useState(false)
  const [timeLeft, setTimeLeft] = useState('00:00')
  const [progress, setProgress] = useState(0)
  
  const isWorking = status === 'working'
  const isSettlement = status === 'settlement'
  const timerRef = useRef<any>(null)
  
  // 倒计时逻辑
  useEffect(() => {
    if (!isWorking || !startTime) {
      setTimeLeft('IDLE')
      setProgress(0)
      return
    }

    const timer = setInterval(() => {
      const now = Date.now()
      const { lastSettledTime } = useStore.getState()
      const UNIT = import.meta.env.DEV && false ? 10000 : 3600000
      
      if (!lastSettledTime) return

      const elapsed = now - lastSettledTime
      const remaining = Math.max(0, UNIT - elapsed)
      
      const totalSeconds = Math.floor(remaining / 1000)
      const m = Math.floor(totalSeconds / 60)
      const s = totalSeconds % 60
      setTimeLeft(`${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`)
      setProgress(Math.min(1, elapsed / UNIT))
    }, 100)

    return () => clearInterval(timer)
  }, [isWorking, startTime])
  
  const handlePressStart = () => {
    if (isSettlement) return
    setHolding(true)
    
    timerRef.current = setTimeout(() => {
      if (isWorking) {
        stopWork()
      } else {
        startWork()
      }
      setHolding(false)
      if (navigator.vibrate) navigator.vibrate(50)
    }, 1000)
  }

  const handlePressEnd = () => {
    setHolding(false)
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }

  const handleProjectSelect = (tag: string) => {
    completeSettlement(tag)
    if (navigator.vibrate) navigator.vibrate([30, 50, 30])
  }

  return (
    <div className="absolute inset-0 z-10 pointer-events-none flex items-center justify-end p-6 pb-safe">
      <style>{`
        .pb-safe { padding-bottom: max(env(safe-area-inset-bottom, 24px), 40px); }
      `}</style>

      {/* 右侧控制面板 */}
      {!isSettlement && (
        <div className="pointer-events-auto flex flex-col gap-4 items-center">
          
          {/* 1. 倒计时显示 */}
          <div className="bg-white border-4 border-black px-6 py-3 rounded-lg shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] min-w-[160px]">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className={`w-2 h-2 rounded-full ${isWorking ? 'bg-red-500 animate-pulse' : 'bg-gray-300'}`} />
              <span className="text-[10px] font-bold text-gray-500 tracking-widest uppercase">
                {isWorking ? 'Next Drop' : 'Timer'}
              </span>
            </div>
            <div className="font-mono text-3xl font-black text-center text-gray-900 tracking-wider">
              {timeLeft}
            </div>
            {isWorking && (
              <div className="mt-2 w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-400 to-purple-500 transition-all duration-300"
                  style={{ width: `${progress * 100}%` }}
                />
              </div>
            )}
          </div>

          {/* 2. 资产显示 */}
          <div className="bg-yellow-100 border-4 border-black px-6 py-3 rounded-lg shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] min-w-[160px]">
            <p className="text-[10px] font-bold text-gray-500 tracking-widest text-center mb-1 uppercase">Total Savings</p>
            <p className="text-3xl font-black text-center text-gray-900 font-mono">
              ¥{totalAssets.toLocaleString()}
            </p>
          </div>

          {/* 3. 胶囊盒按钮 */}
          <Link 
            to="/vault" 
            className="
              w-full bg-white border-4 border-black px-6 py-3 
              font-bold text-black text-center tracking-wide
              shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] 
              hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
              hover:translate-x-[2px] hover:translate-y-[2px]
              active:shadow-none active:translate-x-[6px] active:translate-y-[6px]
              transition-all rounded-lg
              flex items-center justify-center gap-2
            "
          >
            <span>📦</span>
            <span>胶囊盒</span>
          </Link>

          {/* 4. 启动/停止按钮 */}
          <button
            className={`
              relative w-24 h-24 rounded-full border-8 border-gray-900 
              flex items-center justify-center
              transition-all duration-200
              ${holding ? 'scale-95 shadow-none translate-y-2' : 'shadow-[0px_8px_0px_0px_rgba(31,41,55,1)] hover:shadow-[0px_4px_0px_0px_rgba(31,41,55,1)] hover:translate-y-[4px]'}
              ${isWorking ? 'bg-red-500' : 'bg-green-500'}
            `}
            onMouseDown={handlePressStart}
            onMouseUp={handlePressEnd}
            onMouseLeave={handlePressEnd}
            onTouchStart={handlePressStart}
            onTouchEnd={handlePressEnd}
          >
            <span className="text-4xl filter drop-shadow-lg">
              {isWorking ? '🔌' : '🪙'}
            </span>
            
            {/* 长按进度环 */}
            {holding && (
              <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none p-1">
                <circle
                  cx="50%" cy="50%" r="44%"
                  fill="none"
                  stroke="white"
                  strokeWidth="4"
                  strokeDasharray="220"
                  className="animate-[dash_1s_linear_forwards]"
                />
              </svg>
            )}
          </button>

          <div className="bg-black/80 px-3 py-1 rounded-full text-white text-[10px] font-bold tracking-widest uppercase backdrop-blur-sm">
            {isWorking ? 'Running' : 'Hold to Start'}
          </div>
        </div>
      )}

      {/* 结算弹窗 */}
      {isSettlement && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-auto bg-black/60 backdrop-blur-sm z-50">
          <div className="bg-yellow-50 border-8 border-red-500 p-6 max-w-xs w-full mx-4 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] animate-bounce-in rounded-xl relative overflow-hidden">
            {/* 装饰条 */}
            <div className="absolute top-0 left-0 right-0 h-4 bg-red-400 border-b-4 border-black" />
            
            <div className="flex justify-center mb-6 mt-4">
              <div className="w-20 h-20 rounded-full border-4 border-black bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center shadow-lg transform rotate-12 animate-pulse">
                <span className="text-4xl">💊</span>
              </div>
            </div>
            
            <h2 className="text-2xl font-black text-center mb-1 text-gray-900 font-mono">NEW CAPSULE!</h2>
            <p className="text-center text-green-600 font-black text-lg mb-6">+¥350 EARNED</p>
            
            <p className="text-center text-black font-bold mb-3 text-sm">标记本小时内容:</p>

            <div className="grid grid-cols-2 gap-3">
              {['Design', 'Code', 'Meeting', 'Debug', 'Plan', 'Relax'].map(tag => (
                <button 
                  key={tag}
                  onClick={() => handleProjectSelect(tag)}
                  className="
                    bg-white border-4 border-black py-3 
                    font-bold text-black text-sm
                    hover:bg-yellow-200 active:bg-yellow-300
                    shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                    hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]
                    active:shadow-none active:translate-x-[2px] active:translate-y-[2px]
                    transition-all rounded-lg
                  "
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes dash {
          from { stroke-dashoffset: 220; }
          to { stroke-dashoffset: 0; }
        }
        @keyframes bounce-in {
          0% { transform: scale(0.8) translateY(30px); opacity: 0; }
          60% { transform: scale(1.05); opacity: 1; }
          100% { transform: scale(1); }
        }
        .animate-bounce-in {
          animation: bounce-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
      `}</style>
    </div>
  )
}
