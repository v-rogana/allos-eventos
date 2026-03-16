import { useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import type { Interacao } from '../types'

export function useInteracoes(instituicaoId: string | null) {
  const [interacoes, setInteracoes] = useState<Interacao[]>([])
  const [loading, setLoading] = useState(false)

  const fetchInteracoes = useCallback(async () => {
    if (!instituicaoId) return
    setLoading(true)
    const { data } = await supabase
      .from('interacoes')
      .select('*')
      .eq('instituicao_id', instituicaoId)
      .order('data', { ascending: false })

    setInteracoes((data as Interacao[]) || [])
    setLoading(false)
  }, [instituicaoId])

  const createInteracao = async (
    interacao: Omit<Interacao, 'id'>
  ) => {
    const { data, error } = await supabase
      .from('interacoes')
      .insert(interacao)
      .select()
      .single()

    if (error) throw error
    setInteracoes((prev) => [data as Interacao, ...prev])
    return data as Interacao
  }

  return { interacoes, loading, fetchInteracoes, createInteracao }
}
