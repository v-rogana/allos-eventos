import { useState, useMemo } from 'react'
import EventoChip from './EventoChip'
import DetalheDia from './DetalheDia'

interface CalendarioEvento {
  id: string
  nome: string
  data: string
  tipo: 'evento' | 'data_estrategica' | 'janela_prospeccao'
  categoria?: string
  cor: string
  detalhes?: string
}

interface MesGridProps {
  ano: number
  mes: number
  eventos: CalendarioEvento[]
}

const DIAS_SEMANA = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

export default function MesGrid({ ano, mes, eventos }: MesGridProps) {
  const [selectedDay, setSelectedDay] = useState<number | null>(null)

  const diasGrid = useMemo(() => {
    const primeiro = new Date(ano, mes - 1, 1).getDay()
    const total = new Date(ano, mes, 0).getDate()
    const grid: (number | null)[] = []

    for (let i = 0; i < primeiro; i++) grid.push(null)
    for (let d = 1; d <= total; d++) grid.push(d)
    while (grid.length % 7 !== 0) grid.push(null)

    return grid
  }, [ano, mes])

  const eventosPorDia = useMemo(() => {
    const map: Record<number, CalendarioEvento[]> = {}
    for (const ev of eventos) {
      const d = new Date(ev.data + 'T00:00:00')
      if (d.getMonth() === mes - 1 && d.getFullYear() === ano) {
        const dia = d.getDate()
        if (!map[dia]) map[dia] = []
        map[dia].push(ev)
      }
    }
    return map
  }, [eventos, ano, mes])

  const hoje = new Date()
  const isHoje = (dia: number) =>
    dia === hoje.getDate() && mes - 1 === hoje.getMonth() && ano === hoje.getFullYear()

  const eventosSelectedDay = selectedDay ? eventosPorDia[selectedDay] || [] : []

  return (
    <>
      <div className="border border-border rounded-lg overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-7 bg-gray-50">
          {DIAS_SEMANA.map((d) => (
            <div key={d} className="text-center text-xs font-semibold text-text-secondary py-2 border-b border-border">
              {d}
            </div>
          ))}
        </div>

        {/* Days */}
        <div className="grid grid-cols-7">
          {diasGrid.map((dia, i) => (
            <div
              key={i}
              className={`min-h-[60px] sm:min-h-[90px] p-1 border-b border-r border-border last:border-r-0 ${
                dia === null ? 'bg-gray-50/50' : 'bg-surface hover:bg-gray-50 cursor-pointer'
              } ${isHoje(dia || 0) ? 'ring-2 ring-inset ring-teal' : ''}`}
              onClick={() => dia && setSelectedDay(dia)}
            >
              {dia !== null && (
                <>
                  <span
                    className={`text-xs sm:text-sm font-medium ${
                      isHoje(dia) ? 'text-teal font-bold' : 'text-text'
                    }`}
                  >
                    {dia}
                  </span>
                  <div className="mt-0.5 space-y-0.5">
                    {(eventosPorDia[dia] || []).slice(0, 3).map((ev, j) => (
                      <EventoChip
                        key={`${ev.id}-${j}`}
                        nome={ev.nome}
                        cor={ev.cor}
                        onClick={() => setSelectedDay(dia)}
                      />
                    ))}
                    {(eventosPorDia[dia] || []).length > 3 && (
                      <span className="text-[10px] text-text-secondary pl-1">
                        +{(eventosPorDia[dia] || []).length - 3} mais
                      </span>
                    )}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {selectedDay !== null && (
        <DetalheDia
          open={true}
          onClose={() => setSelectedDay(null)}
          dia={selectedDay}
          mes={mes}
          ano={ano}
          eventos={eventosSelectedDay}
        />
      )}
    </>
  )
}
