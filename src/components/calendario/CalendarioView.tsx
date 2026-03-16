import { useState } from 'react'
import MesGrid from './MesGrid'
import Badge from '../ui/Badge'
import { useCalendario } from '../../hooks/useCalendario'

const MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]

export default function CalendarioView() {
  const hoje = new Date()
  const [ano, setAno] = useState(hoje.getFullYear())
  const [mes, setMes] = useState(hoje.getMonth() + 1)
  const [showSidebar, setShowSidebar] = useState(false)

  const { eventosMes, loading } = useCalendario(ano, mes)

  const prev = () => {
    if (mes === 1) { setMes(12); setAno(ano - 1) }
    else setMes(mes - 1)
  }

  const next = () => {
    if (mes === 12) { setMes(1); setAno(ano + 1) }
    else setMes(mes + 1)
  }

  const proximosEventos = eventosMes
    .filter((e) => {
      const d = new Date(e.data + 'T00:00:00')
      return d >= hoje
    })
    .sort((a, b) => a.data.localeCompare(b.data))
    .slice(0, 8)

  return (
    <div className="flex gap-6">
      {/* Main calendar */}
      <div className="flex-1 min-w-0">
        {/* Navigation */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={prev}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-text cursor-pointer"
            aria-label="Mês anterior"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </button>

          <h2 className="text-lg sm:text-xl font-semibold font-[family-name:var(--font-heading)] text-text">
            {MESES[mes - 1]} {ano}
          </h2>

          <div className="flex items-center gap-2">
            <button
              onClick={next}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-text cursor-pointer"
              aria-label="Próximo mês"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>

            {/* Mobile sidebar toggle */}
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors text-text cursor-pointer"
              aria-label="Próximos eventos"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <p className="text-text-secondary">Carregando calendário...</p>
          </div>
        ) : (
          <MesGrid ano={ano} mes={mes} eventos={eventosMes} />
        )}

        {/* Legend */}
        <div className="flex flex-wrap gap-3 mt-4 text-xs">
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 rounded bg-amber-200" /> Campanha Nacional
          </div>
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 rounded bg-teal-light" /> Processo Seletivo / Evento
          </div>
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 rounded bg-rose-100" /> Janela de Prospecção
          </div>
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 rounded bg-purple-200" /> Semana de Psicologia
          </div>
        </div>
      </div>

      {/* Sidebar - desktop always visible, mobile toggle */}
      <div className={`${showSidebar ? 'block' : 'hidden'} lg:block w-full lg:w-64 flex-shrink-0`}>
        <div className="bg-surface rounded-xl border border-border p-4 sticky top-4">
          <h3 className="text-sm font-semibold text-text mb-3">Próximos eventos</h3>
          {proximosEventos.length === 0 ? (
            <p className="text-xs text-text-secondary">Nenhum evento próximo neste mês.</p>
          ) : (
            <div className="space-y-2">
              {proximosEventos.map((ev, i) => (
                <div key={`${ev.id}-${i}`} className="flex items-start gap-2">
                  <span className="text-xs text-text-secondary font-mono whitespace-nowrap mt-0.5">
                    {new Date(ev.data + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-text truncate">{ev.nome}</p>
                    <Badge variant={ev.tipo === 'evento' ? 'teal' : ev.tipo === 'data_estrategica' ? 'amber' : 'rose'}>
                      {ev.tipo === 'evento' ? 'Evento' : ev.tipo === 'data_estrategica' ? 'Data Estratégica' : 'Prospecção'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
