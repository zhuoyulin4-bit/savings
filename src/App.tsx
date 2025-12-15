import { useEffect } from 'react'
import { PixelGachapon } from './components/PixelGachapon'
import { UI } from './components/UI'
import { useStore } from './store/useStore'

function App() {
  // Timer loop
  useEffect(() => {
    const interval = setInterval(() => {
      useStore.getState().checkTime()
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <PixelGachapon />
      <UI />
    </div>
  )
}

export default App
