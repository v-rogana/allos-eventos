import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Sidebar from './components/layout/Sidebar'
import Header from './components/layout/Header'
import Dashboard from './pages/Dashboard'
import NovoEvento from './pages/NovoEvento'
import Eventos from './pages/Eventos'
import Prospeccao from './pages/Prospeccao'
import Temas from './pages/Temas'
import Calendario from './pages/Calendario'

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen flex">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/novo-evento" element={<NovoEvento />} />
            <Route path="/eventos" element={<Eventos />} />
            <Route path="/prospeccao" element={<Prospeccao />} />
            <Route path="/temas" element={<Temas />} />
            <Route path="/calendario" element={<Calendario />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}
