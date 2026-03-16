import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import type { TemaCompleto, Palestrante } from '../types'
import { TEMAS_COMPLETOS, PALESTRANTES } from '../data/temas'

export function useTemas() {
  const [temas, setTemas] = useState<TemaCompleto[]>(TEMAS_COMPLETOS)
  const [palestrantes, setPalestrantes] = useState<Palestrante[]>(PALESTRANTES)
  const [loading, setLoading] = useState(true)
  const [usingSupabase, setUsingSupabase] = useState(false)

  const fetchTemas = useCallback(async () => {
    setLoading(true)

    // Try to load from Supabase; fall back to static data
    const { data: temasData, error: temasErr } = await supabase
      .from('temas')
      .select('*')
      .order('created_at', { ascending: true })

    const { data: palData, error: palErr } = await supabase
      .from('palestrantes')
      .select('*')
      .order('nome', { ascending: true })

    if (temasErr || palErr) {
      // Supabase tables don't exist or error — use static data
      setTemas(TEMAS_COMPLETOS)
      setPalestrantes(PALESTRANTES)
      setUsingSupabase(false)
      setLoading(false)
      return
    }

    const dbPalestrantes: Palestrante[] = (palData || []).map((p: Record<string, unknown>) => ({
      id: p.id as string,
      nome: p.nome as string,
      bio: (p.bio as string) || '',
      macro_temas: (p.macro_temas as string[]) || [],
      disponivel: p.disponivel !== false,
    }))

    // Load tema-palestrante relations
    const { data: relData } = await supabase.from('tema_palestrante').select('*')
    const relations = (relData || []) as { tema_id: string; palestrante_id: string }[]

    const dbTemas: TemaCompleto[] = (temasData || []).map((t: Record<string, unknown>) => {
      const temaRelations = relations.filter((r) => r.tema_id === t.id)
      const responsaveis = temaRelations
        .map((r) => dbPalestrantes.find((p) => p.id === r.palestrante_id))
        .filter((p): p is Palestrante => p !== undefined)

      return {
        id: t.id as string,
        nome: t.nome as string,
        descricao: (t.descricao as string) || '',
        tags: (t.tags as string[]) || [],
        responsaveis,
      }
    })

    if (dbTemas.length > 0) {
      setTemas(dbTemas)
      setPalestrantes(dbPalestrantes)
      setUsingSupabase(true)
    } else {
      // Tables exist but empty — use static + mark as supabase mode
      setTemas(TEMAS_COMPLETOS)
      setPalestrantes(PALESTRANTES)
      setUsingSupabase(true)
    }

    setLoading(false)
  }, [])

  useEffect(() => {
    fetchTemas()
  }, [fetchTemas])

  const createTema = async (nome: string, descricao: string, tags: string[], palestranteIds: string[]) => {
    const { data, error } = await supabase
      .from('temas')
      .insert({ nome, descricao, tags })
      .select()
      .single()

    if (error) throw error

    // Add palestrante relations
    if (palestranteIds.length > 0) {
      await supabase.from('tema_palestrante').insert(
        palestranteIds.map((pid) => ({ tema_id: data.id, palestrante_id: pid }))
      )
    }

    await fetchTemas()
    return data
  }

  const updateTema = async (id: string, nome: string, descricao: string, tags: string[], palestranteIds: string[]) => {
    const { error } = await supabase
      .from('temas')
      .update({ nome, descricao, tags })
      .eq('id', id)

    if (error) throw error

    // Replace relations
    await supabase.from('tema_palestrante').delete().eq('tema_id', id)
    if (palestranteIds.length > 0) {
      await supabase.from('tema_palestrante').insert(
        palestranteIds.map((pid) => ({ tema_id: id, palestrante_id: pid }))
      )
    }

    await fetchTemas()
  }

  const deleteTema = async (id: string) => {
    const { error } = await supabase.from('temas').delete().eq('id', id)
    if (error) throw error
    await fetchTemas()
  }

  const createPalestrante = async (nome: string, bio: string, macroTemas: string[]) => {
    const { data, error } = await supabase
      .from('palestrantes')
      .insert({ nome, bio, macro_temas: macroTemas, disponivel: true })
      .select()
      .single()

    if (error) throw error
    await fetchTemas()
    return data as Palestrante
  }

  return {
    temas, palestrantes, loading, usingSupabase,
    fetchTemas, createTema, updateTema, deleteTema, createPalestrante,
  }
}
