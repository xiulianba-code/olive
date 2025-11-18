import { useState } from 'react'
import './App.css'
import PanoramaGlbRenderer from './component/PanoramaGlbRenderer';


function App() {
  const [count, setCount] = useState(0)

  return (
      <>
        <PanoramaGlbRenderer  />
      </>
  )
}

export default App
