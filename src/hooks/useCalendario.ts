import { useState, useEffect, useMemo } from 'react'
import { supabase } from '../lib/supabase'
import { DATAS_FIXAS_2026 } from '../data/datas-fixas'
import type { DataEstrategica, EventoBriefing } from '../types'

interface CalendarioEvento {
  id: string
  nome: string
  data: string
  tipo: 'evento' | 'data_estrategica' | 'janela_prospeccao'
  categoria?: string
  cor: string
  detalhes?: string
}

function getCorTipo(tipo: DataEstrategica['tipo']): string {
  switch (tipo) {
    case 'campanha_nacional': return 'bg-amber-200 text-amber-900'
    case 'processo_seletivo': return 'bg-teal-light text-teal-dark'
    case 'semana_psicologia': return 'bg-purple-200 text-purple-900'
    case 'data_interna': return 'bg-blue-200 text-blue-900'
    default: return 'bg-gray-200 text-gray-800'
  }
}

function getCorCategoria(cat: string): string {
  switch (cat) {
    case 'promocional': return 'bg-teal-light text-teal-dark'
    case 'comunitario': return 'bg-amber-100 text-amber-800'
    case 'corporativo': return 'bg-purple-100 text-purple-800'
    case 'institucional': return 'bg-blue-100 text-blue-800'
    default: return 'bg-gray-200 text-gray-800'
  }
}

export function useCalendario(ano: number, mes: number) {
  const [eventos, setEventos] = useState<EventoBriefing[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchEventos() {
      setLoading(true)
      setError(null)
      const inicioMes = `${ano}-${String(mes).padStart(2, '0')}-01`
      const fimMes = new Date(ano, mes, 0)
      const fimStr = `${ano}-${String(mes).padStart(2, '0')}-${String(fimMes.getDate()).padStart(2, '0')}`

      const { data, error: err } = await supabase
        .from('eventos')
        .select('*')
        .gte('data_evento', inicioMes)
        .lte('data_evento', fimStr)

      if (err) {
        setError(err.message)
        setEventos([])
      } else {
        setEventos((data as EventoBriefing[]) || [])
      }
      setLoading(false)
    }
    fetchEventos()
  }, [ano, mes])

  const eventosMes = useMemo((): CalendarioEvento[] => {
    const result: CalendarioEvento[] = []
    const inicioMes = new Date(ano, mes - 1, 1)
    const fimMes = new Date(ano, mes, 0)

    // Add datas fixas that overlap with this month
    for (const df of DATAS_FIXAS_2026) {
      const dfInicio = new Date(df.data_inicio + 'T00:00:00')
      const dfFim = df.data_fim ? new Date(df.data_fim + 'T00:00:00') : dfInicio

      if (dfFim >= inicioMes && dfInicio <= fimMes) {
        const startDay = dfInicio < inicioMes ? inicioMes : dfInicio
        const endDay = dfFim > fimMes ? fimMes : dfFim

        for (let d = new Date(startDay); d <= endDay; d.setDate(d.getDate() + 1)) {
          // Only add on start day for ranges (to avoid clutter)
          if (d.getTime() === startDay.getTime()) {
            result.push({
              id: df.id,
              nome: df.nome,
              data: df.data_inicio,
              tipo: 'data_estrategica',
              cor: getCorTipo(df.tipo),
              detalhes: df.notas,
            })
          }
        }
      }
    }

    // Add eventos from Supabase
    for (const ev of eventos) {
      if (ev.data_evento) {
        result.push({
          id: ev.tipo_evento_id || ev.data_evento,
          nome: ev.tipo_evento_nome || 'Evento',
          data: ev.data_evento,
          tipo: 'evento',
          categoria: ev.categoria || undefined,
          cor: getCorCategoria(ev.categoria || ''),
        })

        // Janela de prospecção: 90 dias antes para eventos promocionais/institucionais
        if (ev.categoria === 'promocional' || ev.categoria === 'institucional') {
          const dataEvento = new Date(ev.data_evento + 'T00:00:00')
          const janelaInicio = new Date(dataEvento)
          janelaInicio.setDate(janelaInicio.getDate() - 90)

          if (janelaInicio >= inicioMes && janelaInicio <= fimMes) {
            result.push({
              id: `janela-${ev.tipo_evento_id || ev.data_evento}`,
              nome: `Prospecção: ${ev.tipo_evento_nome || 'Evento'}`,
              data: janelaInicio.toISOString().split('T')[0],
              tipo: 'janela_prospeccao',
              cor: 'bg-rose-100 text-rose-800',
              detalhes: `Início da janela de prospecção (90 dias antes do evento em ${ev.data_evento})`,
            })
          }
        }
      }
    }

    return result
  }, [eventos, ano, mes])

  return { eventosMes, loading, error }
}
