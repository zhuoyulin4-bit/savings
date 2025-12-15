import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../store/useStore'

export function UI() {
  const { status, startWork, stopWork, completeSettlement } = useStore()
  const [holding, setHolding] = useState(false)
  const isWorking = status === 'working'
  const isSettlement = status === 'settlement'
  
  const timerRef = useRef<any>(null)
  
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
    <div className="absolute inset-0 z-10 pointer-events-none flex flex-col justify-between p-6 pb-safe overflow-hidden">
      <style>{`
        .pb-safe { padding-bottom: max(env(safe-area-inset-bottom, 24px), 40px); }
      `}</style>
      
      {/* 顶部导航 */}
      {!isSettlement && (
        <div className="flex justify-end items-start pointer-events-auto mt-4">
          <Link 
            to="/vault" 
            className="
              bg-white border-4 border-black px-4 py-2 
              font-bold text-black text-sm tracking-wide
              shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] 
              active:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] 
              active:translate-x-1 active:translate-y-1 
              transition-all rounded-lg
              flex items-center gap-2
            "
          >
            <span>📦</span>
            <span>胶囊盒</span>
          </Link>
        </div>
      )}

      {/* 结算弹窗 - 扭蛋风格 */}
      {isSettlement && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-auto bg-black/60 backdrop-blur-sm z-50">
          <div className="bg-yellow-50 border-8 border-red-500 p-6 max-w-xs w-full shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] animate-bounce-in rounded-xl relative overflow-hidden">
            {/* 顶部装饰条 */}
            <div className="absolute top-0 left-0 right-0 h-4 bg-red-400 border-b-4 border-black" />
            
            <div className="flex justify-center mb-6 mt-4">
               {/* 开胶囊动画示意 */}
               <div className="w-20 h-20 rounded-full border-4 border-black bg-blue-400 flex items-center justify-center shadow-lg transform rotate-12">
                  <span className="text-4xl animate-pulse">💊</span>
               </div>
            </div>
            
            <h2 className="text-2xl font-black text-center mb-1 text-gray-900 font-mono">NEW CAPSULE!</h2>
            <p className="text-center text-gray-500 text-xs mb-6 font-bold uppercase tracking-widest">+¥350 EARNED</p>
            
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
                    active:shadow-none active:translate-x-1 active:translate-y-1
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

      {/* 底部控制按钮 - 移到右下角，完全避开机器 */}
      {!isSettlement && (
        <div className="absolute bottom-10 right-6 pointer-events-auto">
          <div className="flex flex-col items-center gap-2">
            
            {/* 状态提示 */}
             <div className="bg-black/80 px-3 py-1 rounded-full text-white text-[10px] font-bold tracking-widest uppercase backdrop-blur-md mb-2">
                {isWorking ? 'Running' : 'Insert Coin'}
             </div>

             {/* 投币按钮 */}
             <button
               className={`
                 relative w-20 h-20 rounded-full border-8 border-gray-800 
                 flex items-center justify-center z-10
                 transition-all duration-200
                 ${holding ? 'scale-90 shadow-none translate-y-2' : 'shadow-[4px_8px_0px_0px_rgba(31,41,55,1)] hover:shadow-[2px_4px_0px_0px_rgba(31,41,55,1)] hover:translate-y-[4px]'}
                 ${isWorking ? 'bg-red-500' : 'bg-green-500'}
               `}
               onMouseDown={handlePressStart}
               onMouseUp={handlePressEnd}
               onMouseLeave={handlePressEnd}
               onTouchStart={handlePressStart}
               onTouchEnd={handlePressEnd}
             >
               <span className="text-3xl filter drop-shadow-md transform hover:scale-110 transition-transform">
                   {isWorking ? '🔌' : '🪙'}
               </span>
               
               {/* 进度环 */}
               {holding && (
                 <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none p-1">
                   <circle
                     cx="50%" cy="50%" r="42%"
                     fill="none"
                     stroke="white"
                     strokeWidth="4"
                     strokeDasharray="200"
                     strokeDashoffset="0"
                     className="animate-[dash_1s_linear_forwards]"
                     style={{ strokeDasharray: 2 * Math.PI * 32 }}
                   />
                 </svg>
               )}
             </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes dash {
          from { stroke-dashoffset: 200; }
          to { stroke-dashoffset: 0; }
        }
        @keyframes bounce-in {
          0% { transform: scale(0.8) translateY(20px); opacity: 0; }
          60% { transform: scale(1.05) translateY(-10px); opacity: 1; }
          100% { transform: scale(1) translateY(0); }
        }
        .animate-bounce-in {
          animation: bounce-in 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
      `}</style>
    </div>
  )
}
