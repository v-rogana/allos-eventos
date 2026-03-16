import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

interface EventoResumo {
  id: string
  categoria: string
  tipo: string
  status: string
  objetivo: string
  data_evento: string | null
  criado_por: string
  pessoas: string[]
  tags: string[]
  created_at: string
}

interface EventoCompleto extends EventoResumo {
  tema_id: string | null
  tema_custom: string | null
  publico_alvo: string | null
  conteudo: string | null
  formato_modalidade: string | null
  formato_periodo: string | null
  formato_duracao_horas: number | null
  parceiros: string | null
  recursos: string[]
  metas_inscritos: number | null
  metas_presenca: number | null
  metas_conversoes: number | null
  metas_qualitativas: string | null
  cronograma: unknown[]
  orcamento: Record<string, unknown[]>
  plano_divulgacao: unknown[]
  checklist_pre: unknown[]
  checklist_dia: unknown[]
  checklist_pos: unknown[]
}

export function useEventos() {
  const [eventos, setEventos] = useState<EventoResumo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchEventos = useCallback(async () => {
    setLoading(true)
    setError(null)
    const { data, error: err } = await supabase
      .from('eventos')
      .select('id, categoria, tipo, status, objetivo, data_evento, criado_por, pessoas, tags, created_at')
      .order('created_at', { ascending: false })

    if (err) {
      setError(err.message)
      setEventos([])
    } else {
      setEventos((data as EventoResumo[]) || [])
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchEventos()
  }, [fetchEventos])

  const fetchEvento = async (id: string): Promise<EventoCompleto | null> => {
    const { data, error: err } = await supabase
      .from('eventos')
      .select('*')
      .eq('id', id)
      .single()

    if (err) return null
    return data as EventoCompleto
  }

  const updateEvento = async (id: string, updates: Record<string, unknown>) => {
    const { error: err } = await supabase
      .from('eventos')
      .update(updates)
      .eq('id', id)

    if (err) throw err

    setEventos((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...updates } as EventoResumo : e))
    )
  }

  return { eventos, loading, error, fetchEventos, fetchEvento, updateEvento }
}
