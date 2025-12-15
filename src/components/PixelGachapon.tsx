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
      
      // 扭蛋机在左侧，所以调整中心点
      const scale = 5
      const cx = canvas.width / 2 - 80 // 向左偏移
      const cy = canvas.height / 2
      
      // 调色板
      const colors = {
        base: '#e63946',
        highlight: '#ff6b6b',
        shadow: '#9e2a2b',
        glass: '#a8dadc',
        metal: '#ced4da',
        knob: '#fca311',
        outline: '#1d3557',
      }

      const rect = (x: number, y: number, w: number, h: number, color: string) => {
        ctx.fillStyle = color
        ctx.fillRect(cx + x * scale, cy + y * scale, w * scale, h * scale)
      }
      
      // === 绘制扭蛋机 ===
      
      // 1. 顶部红色盖子
      rect(-18, -38, 36, 12, colors.base)
      rect(-16, -39, 32, 1, colors.base)
      rect(-14, -40, 28, 1, colors.base)
      rect(-10, -38, 6, 2, colors.highlight)
      
      // 2. 透明玻璃仓
      rect(-18, -26, 36, 30, colors.glass)
      rect(-14, -22, 4, 12, 'rgba(255, 255, 255, 0.3)')
      rect(-12, -20, 2, 6, 'rgba(255, 255, 255, 0.5)')
      
      // 3. 仓内扭蛋（工作时会晃动）
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
        
        // 胶囊下半部（白色）
        rect(dx, dy + 2, 6, 2, 'white')
        rect(dx + 1, dy + 4, 4, 1, 'white')
        // 胶囊上半部（彩色）
        rect(dx, dy - 2, 6, 4, cap.c)
        rect(dx + 1, dy - 3, 4, 1, cap.c)
      })

      // 4. 红色机身
      rect(-20, 4, 40, 2, colors.shadow)
      rect(-20, 6, 40, 34, colors.base)
      
      // 5. 投币口（右侧）
      rect(8, 12, 6, 12, colors.metal)
      rect(10, 14, 2, 8, '#333')
      
      // 6. 旋钮（左侧）- 结算时旋转
      rect(-12, 12, 12, 12, colors.metal)
      if (isSettlement) {
        const frame = Math.floor(Date.now() / 100) % 4
        if (frame === 0) rect(-10, 16, 8, 4, colors.knob)
        if (frame === 1) rect(-8, 14, 4, 8, colors.knob)
        if (frame === 2) rect(-10, 16, 8, 4, colors.knob)
        if (frame === 3) rect(-8, 14, 4, 8, colors.knob)
      } else {
        rect(-10, 16, 8, 4, colors.knob)
      }

      // 7. 出货口
      rect(-14, 30, 28, 8, '#333')
      rect(-12, 32, 24, 1, '#111')
      
      // 8. 掉落的胶囊（结算时）
      if (isSettlement) {
        const fallY = 32 + (Date.now() % 500) / 20
        if (fallY < 40) {
          rect(-3, fallY, 6, 6, '#00f5d4')
        }
      }

      // 9. 轮廓描边
      rect(-21, 6, 1, 34, colors.outline)
      rect(20, 6, 1, 34, colors.outline)
      rect(-19, -26, 1, 30, colors.outline)
      rect(18, -26, 1, 30, colors.outline)
      rect(-16, -41, 32, 1, colors.outline)
      rect(-20, 40, 40, 1, colors.outline)

      frameRef.current++
      requestAnimationFrame(draw)
    }
    
    draw()
  }, [isWorking, isSettlement])

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-[#FFFAF0]">
      {/* 像素背景 */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#e63946 2px, transparent 2px)`,
          backgroundSize: '20px 20px'
        }}
      />
      
      {/* 扭蛋机 Canvas */}
      <canvas 
        ref={canvasRef}
        width={600}
        height={600}
        className="pixelated drop-shadow-2xl"
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

