import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import type { Instituicao, StatusProspeccao } from '../types'

export function useInstituicoes() {
  const [instituicoes, setInstituicoes] = useState<Instituicao[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchInstituicoes = useCallback(async () => {
    setLoading(true)
    setError(null)
    const { data, error: err } = await supabase
      .from('instituicoes')
      .select('*')
      .order('data_ultimo_contato', { ascending: false, nullsFirst: false })

    if (err) {
      setError(err.message)
      setInstituicoes([])
    } else {
      setInstituicoes((data as Instituicao[]) || [])
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchInstituicoes()
  }, [fetchInstituicoes])

  const createInstituicao = async (
    inst: Omit<Instituicao, 'id' | 'data_criacao' | 'data_primeiro_contato' | 'data_ultimo_contato'>
  ) => {
    const { data, error: err } = await supabase
      .from('instituicoes')
      .insert({
        ...inst,
        data_criacao: new Date().toISOString(),
        data_primeiro_contato: null,
        data_ultimo_contato: null,
      })
      .select()
      .single()

    if (err) throw err
    setInstituicoes((prev) => [data as Instituicao, ...prev])
    return data as Instituicao
  }

  const updateStatus = async (id: string, novoStatus: StatusProspeccao) => {
    const now = new Date().toISOString()
    const inst = instituicoes.find((i) => i.id === id)

    const updates: Partial<Instituicao> = {
      status: novoStatus,
      data_ultimo_contato: now,
    }

    if (novoStatus === 'primeiro_contato' && inst && !inst.data_primeiro_contato) {
      updates.data_primeiro_contato = now
    }

    const { error: err } = await supabase
      .from('instituicoes')
      .update(updates)
      .eq('id', id)

    if (err) throw err

    setInstituicoes((prev) =>
      prev.map((i) => (i.id === id ? { ...i, ...updates } : i))
    )
  }

  const deleteInstituicao = async (id: string) => {
    const { error: err } = await supabase.from('instituicoes').delete().eq('id', id)
    if (err) throw err
    setInstituicoes((prev) => prev.filter((i) => i.id !== id))
  }

  return { instituicoes, loading, error, fetchInstituicoes, createInstituicao, updateStatus, deleteInstituicao }
}
