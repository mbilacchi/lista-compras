import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import CriadorLista from './pages/CriadorLista'
import CompradorLista from './pages/CompradorLista'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/criador/:listaId" element={<CriadorLista />} />
        <Route path="/comprador/:listaId" element={<CompradorLista />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
