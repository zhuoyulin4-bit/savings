import { useEffect, useRef } from 'react'
import { useStore } from '../store/useStore'

export function PixelGachapon() {
  const { status } = useStore()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const frameRef = useRef(0)
  
  const isWorking = status === 'working'
  const isSettlement = status === 'settlement'

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    ctx.imageSmoothingEnabled = false
    
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      const scale = 6.5  // 从 5 增加到 6.5 (30% 放大)
      const cx = canvas.width / 2 - 80
      const cy = canvas.height / 2
      
      // 精致调色板
      const colors = {
        base: '#e63946',
        highlight: '#ff6b6b',
        highlightBright: '#ff9999',
        shadow: '#9e2a2b',
        shadowDark: '#6d1f21',
        glass: '#a8dadc',
        glassLight: '#d4f1f4',
        glassDark: '#73c2ca',
        metal: '#ced4da',
        metalLight: '#e9ecef',
        metalDark: '#8b95a1',
        knob: '#fca311',
        knobLight: '#ffd60a',
        knobDark: '#c77f00',
        outline: '#1d3557',
        white: '#ffffff',
        black: '#000000',
      }

      const rect = (x: number, y: number, w: number, h: number, color: string) => {
        ctx.fillStyle = color
        ctx.fillRect(cx + x * scale, cy + y * scale, w * scale, h * scale)
      }
      
      // === 绘制扭蛋机（精致版）===
      
      // 0. 底座支架
      rect(-22, 40, 44, 4, colors.shadowDark)
      rect(-20, 44, 40, 2, colors.black)
      
      // 1. 顶部红色盖子 + 增强立体感
      rect(-18, -38, 36, 12, colors.base)
      rect(-16, -39, 32, 1, colors.base)
      rect(-14, -40, 28, 1, colors.base)
      // 顶部高光（更细腻）
      rect(-10, -38, 8, 2, colors.highlight)
      rect(-8, -39, 4, 1, colors.highlightBright)
      // 顶部阴影
      rect(-16, -28, 32, 2, colors.shadow)
      // 顶部装饰纹路
      rect(-12, -36, 2, 1, colors.highlightBright)
      rect(-6, -36, 2, 1, colors.highlightBright)
      rect(0, -36, 2, 1, colors.highlightBright)
      rect(6, -36, 2, 1, colors.highlightBright)
      
      // 1.5 顶部Logo/文字装饰
      // "LUCKY" 像素字体（简化版）
      rect(-10, -33, 2, 1, colors.knob)
      rect(-10, -32, 2, 3, colors.knob)
      rect(-8, -30, 2, 1, colors.knob)
      // ¥350
      rect(4, -33, 6, 1, colors.knob)
      rect(4, -31, 6, 1, colors.knob)
      rect(6, -32, 2, 1, colors.knob)
      
      // 2. 玻璃仓 + 精细光影
      rect(-18, -26, 36, 30, colors.glass)
      // 主光泽（左上）
      rect(-16, -24, 6, 14, colors.glassLight)
      rect(-14, -22, 4, 10, 'rgba(255, 255, 255, 0.4)')
      rect(-12, -20, 2, 6, 'rgba(255, 255, 255, 0.6)')
      // 次级高光（右下小点缀）
      rect(12, -8, 3, 6, 'rgba(255, 255, 255, 0.15)')
      // 玻璃暗部（底部和右侧）
      rect(-16, -2, 32, 2, colors.glassDark)
      rect(16, -24, 2, 26, colors.glassDark)
      
      // 2.5 玻璃边框金属扣（增强质感）
      // 四角螺丝/铆钉
      rect(-17, -25, 1, 1, colors.metalDark)
      rect(16, -25, 1, 1, colors.metalDark)
      rect(-17, 2, 1, 1, colors.metalDark)
      rect(16, 2, 1, 1, colors.metalDark)
      
      // 3. 仓内扭蛋（增加阴影和高光）
      const capsules = [
        { x: -10, y: -15, c: '#ffbe0b' },
        { x: 5, y: -20, c: '#fb5607' },
        { x: -5, y: -5, c: '#3a86ff' },
        { x: 8, y: -8, c: '#8338ec' },
        { x: 0, y: -22, c: '#ff006e' },
      ]
      
      const shakeX = isWorking ? Math.sin(Date.now() / 100) * 1 : 0
      const shakeY = isWorking ? Math.cos(Date.now() / 100) * 1 : 0

      capsules.forEach((cap, i) => {
        const dx = cap.x + (i % 2 === 0 ? shakeX : -shakeX)
        const dy = cap.y + (i % 2 === 0 ? shakeY : -shakeY)
        
        // 胶囊阴影
        rect(dx + 1, dy + 5, 4, 1, 'rgba(0, 0, 0, 0.2)')
        // 胶囊下半部（白色）
        rect(dx, dy + 2, 6, 2, colors.white)
        rect(dx + 1, dy + 4, 4, 1, '#f0f0f0')
        // 胶囊上半部（彩色）
        rect(dx, dy - 2, 6, 4, cap.c)
        rect(dx + 1, dy - 3, 4, 1, cap.c)
        // 胶囊高光
        rect(dx + 1, dy - 1, 2, 1, 'rgba(255, 255, 255, 0.5)')
      })

      // 4. 红色机身 + 细节
      rect(-20, 4, 40, 2, colors.shadow)
      rect(-20, 6, 40, 34, colors.base)
      // 机身高光（左侧）
      rect(-19, 8, 3, 28, colors.highlight)
      rect(-18, 10, 2, 24, colors.highlightBright)
      // 机身阴影（右侧和底部）
      rect(17, 8, 3, 30, colors.shadow)
      rect(-18, 36, 36, 4, colors.shadowDark)
      
      // 4.5 机身装饰贴纸/标签
      // 左侧星星贴纸
      rect(-15, 14, 3, 1, '#ffd60a')
      rect(-16, 15, 1, 1, '#ffd60a')
      rect(-14, 15, 1, 1, '#ffd60a')
      rect(-15, 16, 3, 1, '#ffd60a')
      rect(-16, 15, 1, 3, '#ffd60a')
      rect(-14, 15, 1, 3, '#ffd60a')
      
      // 右侧"¥"标志
      rect(2, 24, 8, 1, colors.white)
      rect(2, 26, 8, 1, colors.white)
      rect(5, 23, 2, 5, colors.white)
      
      // 螺丝装饰（四角）
      rect(-18, 8, 1, 1, colors.metalDark)
      rect(17, 8, 1, 1, colors.metalDark)
      rect(-18, 36, 1, 1, colors.metalDark)
      rect(17, 36, 1, 1, colors.metalDark)
      
      // 5. 投币口（右侧）+ 立体感
      rect(8, 12, 6, 12, colors.metal)
      // 投币口边框高光
      rect(8, 12, 6, 1, colors.metalLight)
      rect(8, 12, 1, 12, colors.metalLight)
      // 投币口阴影
      rect(13, 13, 1, 10, colors.metalDark)
      rect(9, 23, 4, 1, colors.metalDark)
      // 投币口黑洞
      rect(10, 14, 2, 8, colors.black)
      // "COIN" 标签
      rect(8, 10, 6, 1, colors.knob)
      
      // 6. 旋钮（左侧）- 精致立体版
      // 旋钮底盘
      rect(-12, 12, 12, 12, colors.metal)
      rect(-11, 13, 10, 10, colors.metalLight)
      rect(-10, 14, 8, 8, colors.metal)
      // 底盘阴影
      rect(-9, 21, 6, 2, colors.metalDark)
      rect(-7, 22, 2, 1, '#333')
      
      // 旋钮把手（结算时旋转，增强动画）
      if (isSettlement) {
        const frame = Math.floor(Date.now() / 100) % 4
        // 旋转动画优化
        if (frame === 0) {
          rect(-10, 16, 8, 4, colors.knob)
          rect(-9, 17, 6, 2, colors.knobLight)
        }
        if (frame === 1) {
          rect(-8, 14, 4, 8, colors.knob)
          rect(-7, 15, 2, 6, colors.knobLight)
        }
        if (frame === 2) {
          rect(-10, 16, 8, 4, colors.knob)
          rect(-9, 17, 6, 2, colors.knobLight)
        }
        if (frame === 3) {
          rect(-8, 14, 4, 8, colors.knob)
          rect(-7, 15, 2, 6, colors.knobLight)
        }
      } else {
        rect(-10, 16, 8, 4, colors.knob)
        rect(-9, 17, 6, 2, colors.knobLight)
        rect(-8, 19, 4, 1, colors.knobDark)
      }
      
      // "TURN" 标签
      rect(-12, 10, 6, 1, colors.knobDark)

      // 7. 出货口 + 深度感
      rect(-14, 30, 28, 8, '#333')
      rect(-12, 32, 24, 1, colors.black)
      // 出货口内壁高光
      rect(-13, 31, 1, 6, '#555')
      // 出货口边框
      rect(-15, 30, 1, 8, colors.shadowDark)
      rect(-14, 29, 28, 1, colors.shadowDark)
      
      // 8. 掉落的胶囊（结算时）+ 拖尾效果
      if (isSettlement) {
        const fallY = 32 + (Date.now() % 500) / 20
        if (fallY < 42) {
          // 拖尾
          rect(-3, fallY - 2, 6, 2, 'rgba(0, 245, 212, 0.3)')
          // 胶囊主体
          rect(-3, fallY, 6, 6, '#00f5d4')
          rect(-2, fallY + 1, 4, 4, '#5ffbf1')
          // 高光
          rect(-2, fallY + 1, 2, 2, 'rgba(255, 255, 255, 0.6)')
        }
      }

      // 9. 加强轮廓描边
      rect(-21, 6, 1, 34, colors.outline)
      rect(20, 6, 1, 34, colors.outline)
      rect(-19, -26, 1, 30, colors.outline)
      rect(18, -26, 1, 30, colors.outline)
      rect(-16, -41, 32, 1, colors.outline)
      rect(-20, 40, 40, 1, colors.outline)
      
      // 10. 环境装饰 - 飘浮的小星星（工作时闪烁）
      if (isWorking && Math.floor(Date.now() / 500) % 2 === 0) {
        const starPositions = [
          { x: -25, y: -20 },
          { x: 25, y: -10 },
          { x: -28, y: 5 },
        ]
        starPositions.forEach(star => {
          rect(star.x, star.y, 1, 1, colors.knob)
          rect(star.x - 1, star.y, 1, 1, colors.knobLight)
          rect(star.x + 1, star.y, 1, 1, colors.knobLight)
          rect(star.x, star.y - 1, 1, 1, colors.knobLight)
          rect(star.x, star.y + 1, 1, 1, colors.knobLight)
        })
      }

      frameRef.current++
      requestAnimationFrame(draw)
    }
    
    draw()
  }, [isWorking, isSettlement])

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-br from-[#fff8dc] via-[#FFFAF0] to-[#ffefd5]">
      {/* 升级背景 - 更有层次感 */}
      <div 
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 30%, #e63946 2px, transparent 2px),
            radial-gradient(circle at 80% 70%, #fca311 2px, transparent 2px)
          `,
          backgroundSize: '20px 20px, 30px 30px',
          backgroundPosition: '0 0, 10px 10px'
        }}
      />
      
      {/* 扭蛋机阴影 */}
      <div className="absolute w-[400px] h-[80px] bg-black/10 rounded-full blur-xl" 
           style={{ bottom: '25%', left: '20%' }} 
      />
      
      {/* 扭蛋机 Canvas */}
      <canvas 
        ref={canvasRef}
        width={600}
        height={600}
        className="pixelated drop-shadow-2xl relative z-10"
        style={{ imageRendering: 'pixelated' }}
      />

      <style>{`
        .pixelated {
          image-rendering: pixelated;
          image-rendering: -moz-crisp-edges;
          image-rendering: crisp-edges;
        }
      `}</style>
    </div>
  )
}
