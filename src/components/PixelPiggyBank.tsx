import { useEffect, useRef, useState } from 'react'
import { useStore } from '../store/useStore'

export function PixelPiggyBank() {
  const { status, totalAssets } = useStore()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [bounce, setBounce] = useState(0)
  
  // 动画状态
  const frameRef = useRef(0)
  const isWorking = status === 'working'
  
  useEffect(() => {
    if (isWorking) {
      // 呼吸动画
      const interval = setInterval(() => {
        setBounce(prev => (prev === 0 ? -4 : 0))
      }, 500)
      return () => clearInterval(interval)
    } else {
      setBounce(0)
    }
  }, [isWorking])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    // 禁用平滑，保留像素颗粒感
    ctx.imageSmoothingEnabled = false
    
    // 绘制函数
    const draw = () => {
      // 清空画布
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      const scale = 5 // 放大倍数
      const cx = canvas.width / 2
      const cy = canvas.height / 2 + 20 + bounce // 加上呼吸跳动
      
      // 调色板 - 更高级的粉色系 + 阴影
      const colors = {
        bg: '#FFF0F5', // Lavender Blush
        bodyBase: '#FFB7C5', // Cherry Blossom
        bodyShadow: '#FF8DA1', // Darker Pink
        bodyHighlight: '#FFD1DC', // Light Pink
        outline: '#4A2530', // Deep Brown Outline (比纯黑更柔和)
        coin: '#FFD700',
        coinShadow: '#DAA520',
        coinHighlight: '#FFFACD'
      }

      // 辅助函数：画像素块
      const p = (x: number, y: number, color: string) => {
        ctx.fillStyle = color
        ctx.fillRect(cx + x * scale, cy + y * scale, scale, scale)
      }
      
      const rect = (x: number, y: number, w: number, h: number, color: string) => {
        ctx.fillStyle = color
        ctx.fillRect(cx + x * scale, cy + y * scale, w * scale, h * scale)
      }

      // --- 绘制像素画 (16x16 grid base, scaled) ---
      
      // 1. 身体轮廓 (Outline)
      // 主体是一个圆润的矩形
      // 顶部
      rect(-12, -10, 24, 1, colors.outline)
      // 底部
      rect(-12, 10, 24, 1, colors.outline)
      // 左侧
      rect(-13, -9, 1, 19, colors.outline)
      // 右侧
      rect(12, -9, 1, 19, colors.outline)
      
      // 耳朵 (左)
      rect(-11, -13, 4, 1, colors.outline) // Top
      rect(-12, -12, 1, 3, colors.outline) // Left
      rect(-7, -12, 1, 3, colors.outline) // Right
      
      // 耳朵 (右)
      rect(7, -13, 4, 1, colors.outline) // Top
      rect(11, -12, 1, 3, colors.outline) // Right
      rect(6, -12, 1, 3, colors.outline) // Left

      // 腿 (左前, 右前, 左后, 右后) - 简化为2个前腿可见
      rect(-9, 11, 4, 3, colors.outline)
      rect(5, 11, 4, 3, colors.outline)

      // 2. 填充身体 (Body Fill)
      rect(-12, -9, 24, 19, colors.bodyBase)
      
      // 3. 阴影 (Shading - Bottom & Right)
      rect(-11, 8, 22, 2, colors.bodyShadow) // 底部阴影
      rect(10, -8, 2, 17, colors.bodyShadow) // 右侧阴影
      rect(-11, -1, 22, 1, colors.bodyShadow) // 肚子折痕/圆润感

      // 4. 高光 (Highlights - Top Left)
      rect(-10, -8, 4, 2, colors.bodyHighlight)
      rect(-11, -6, 2, 4, colors.bodyHighlight)
      
      // 5. 耳朵填充
      rect(-11, -12, 4, 2, colors.bodyBase) // 左
      rect(7, -12, 4, 2, colors.bodyBase) // 右
      
      // 6. 鼻子 (Snout)
      // 轮廓
      rect(-4, 0, 8, 5, colors.outline)
      // 填充
      rect(-3, 1, 6, 3, colors.bodyHighlight)
      // 鼻孔
      p(-2, 2, colors.outline)
      p(1, 2, colors.outline)
      
      // 7. 眼睛 (Eyes)
      // 左眼
      p(-7, -3, colors.outline)
      // 右眼
      p(6, -3, colors.outline)
      
      // 8. 腮红 (Blush)
      p(-9, 1, '#FF69B4')
      p(-8, 1, '#FF69B4')
      p(7, 1, '#FF69B4')
      p(8, 1, '#FF69B4')

      // 9. 投币口 (Coin Slot)
      rect(-5, -11, 10, 2, colors.outline) // 黑洞
      
      // 10. 尾巴 (Tail - Curly)
      if (frameRef.current % 60 < 30) {
        // Frame 1
        p(13, 0, colors.outline)
        p(14, -1, colors.outline)
        p(15, 0, colors.outline)
      } else {
        // Frame 2 (Wiggle)
        p(13, -1, colors.outline)
        p(14, 0, colors.outline)
        p(15, -1, colors.outline)
      }
      
      // 11. 金币 (Coins) - 仅在工作时闪烁或结算时掉落
      if (isWorking) {
        const coinY = -25 + Math.sin(Date.now() / 200) * 5
        // Coin Outer
        rect(-3, coinY, 6, 6, colors.coin)
        // Coin Shine
        rect(-1, coinY + 1, 2, 4, colors.coinHighlight)
        // Coin Border
        rect(-4, coinY + 1, 1, 4, colors.coinShadow)
        rect(3, coinY + 1, 1, 4, colors.coinShadow)
        rect(-3, coinY - 1, 6, 1, colors.coinShadow)
        rect(-3, coinY + 6, 6, 1, colors.coinShadow)
      }

      frameRef.current++
      requestAnimationFrame(draw)
    }
    
    draw()
  }, [bounce, isWorking])
  
  return (
    <div className="relative w-full h-full flex items-center justify-center bg-[#f0f4f8]">
      {/* 像素网格背景装饰 */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />
      
      <canvas 
        ref={canvasRef}
        width={600}
        height={600}
        className="pixelated drop-shadow-2xl"
        style={{ imageRendering: 'pixelated' }}
      />
      
      {/* 像素风数据面板 */}
      <div className="absolute top-[15%] left-1/2 transform -translate-x-1/2">
        <div className="bg-white border-4 border-gray-800 p-4 shadow-[6px_6px_0px_0px_rgba(31,41,55,1)] rounded-sm">
           <div className="text-center">
             <span className="block text-xs font-bold text-gray-400 mb-1 tracking-widest">SAVINGS</span>
             <span className="block text-4xl font-black text-gray-800 font-mono tracking-tighter">
               ¥{totalAssets.toLocaleString()}
             </span>
           </div>
        </div>
      </div>
      
      <style>{`
        .pixelated {
          image-rendering: pixelated;
        }
      `}</style>
    </div>
  )
}
