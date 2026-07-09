import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div style={{ padding: '4rem', textAlign: 'center' }}>
      <h1>Eternal Invite</h1>
      <button className="btn btn-primary">Primary Button</button>
    </div>
  )
}

export default App
