import { useState, useEffect } from 'react'
import Modal from '../ui/Modal'
import Badge from '../ui/Badge'
import Button from '../ui/Button'
import { supabase } from '../../lib/supabase'

interface EventoModalProps {
  open: boolean
  onClose: () => void
  eventoId: string
}

const STATUS_OPTIONS = [
  { value: 'rascunho', label: 'Rascunho' },
  { value: 'planejamento', label: 'Planejamento' },
  { value: 'divulgacao', label: 'Divulgação' },
  { value: 'execucao', label: 'Execução' },
  { value: 'pos_evento', label: 'Pós-evento' },
  { value: 'concluido', label: 'Concluído' },
  { value: 'cancelado', label: 'Cancelado' },
]

const CATEGORIA_OPTIONS = [
  { value: 'promocional', label: 'Promocional' },
  { value: 'comunitario', label: 'Comunitário' },
  { value: 'corporativo', label: 'Corporativo' },
  { value: 'institucional', label: 'Institucional' },
]

const MODALIDADE_OPTIONS = [
  { value: '', label: 'Selecione...' },
  { value: 'presencial', label: 'Presencial' },
  { value: 'online', label: 'Online' },
  { value: 'hibrido', label: 'Híbrido' },
]

const PERIODO_OPTIONS = [
  { value: '', label: 'Selecione...' },
  { value: 'manha', label: 'Manhã' },
  { value: 'tarde', label: 'Tarde' },
  { value: 'noite', label: 'Noite' },
  { value: 'dia_inteiro', label: 'Dia inteiro' },
]

function formatBRL(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

interface OrcamentoItem {
  nome: string
  quantidade: number
  valor_unitario: number
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Evento = Record<string, any>

const labelClass = 'block text-sm font-semibold text-text mb-1'
const inputClass = 'w-full px-3 py-2 border border-border rounded-lg text-sm bg-surface text-text focus:outline-none focus:ring-2 focus:ring-teal'
const textareaClass = `${inputClass} resize-y min-h-[60px]`

export default function EventoModal({ open, onClose, eventoId }: EventoModalProps) {
  const [evento, setEvento] = useState<Evento | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [novaPessoa, setNovaPessoa] = useState('')
  const [novaTag, setNovaTag] = useState('')
  const [dirty, setDirty] = useState(false)

  useEffect(() => {
    if (!open || !eventoId) return
    let cancelled = false

    async function load() {
      setLoading(true)
      setDirty(false)
      setSaveError('')
      const { data, error } = await supabase
        .from('eventos')
        .select('*')
        .eq('id', eventoId)
        .single()

      if (!cancelled) {
        setEvento(error ? null : data)
        setLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [open, eventoId])

  if (!open) return null

  const updateField = (field: string, value: unknown) => {
    if (!evento) return
    setEvento({ ...evento, [field]: value })
    setDirty(true)
  }

  const handleSave = async () => {
    if (!evento) return
    setSaving(true)
    setSaveError('')
    try {
      const { error } = await supabase
        .from('eventos')
        .update({
          categoria: evento.categoria,
          tipo: evento.tipo,
          status: evento.status,
          objetivo: evento.objetivo,
          tema_custom: evento.tema_custom,
          publico_alvo: evento.publico_alvo,
          conteudo: evento.conteudo,
          formato_modalidade: evento.formato_modalidade || null,
          formato_periodo: evento.formato_periodo || null,
          formato_duracao_horas: evento.formato_duracao_horas || null,
          parceiros: evento.parceiros,
          recursos: evento.recursos || [],
          metas_inscritos: evento.metas_inscritos || null,
          metas_presenca: evento.metas_presenca || null,
          metas_conversoes: evento.metas_conversoes || null,
          metas_qualitativas: evento.metas_qualitativas,
          data_evento: evento.data_evento || null,
          pessoas: evento.pessoas || [],
          tags: evento.tags || [],
        })
        .eq('id', eventoId)

      if (error) throw error
      setDirty(false)
    } catch (err: unknown) {
      setSaveError(err instanceof Error ? err.message : 'Erro ao salvar')
    } finally {
      setSaving(false)
    }
  }

  // Chip helpers
  const addChip = (field: string, value: string, setter: (v: string) => void) => {
    const trimmed = value.trim()
    if (!trimmed || !evento) return
    const arr = [...(evento[field] || [])]
    if (!arr.includes(trimmed)) {
      arr.push(trimmed)
      updateField(field, arr)
    }
    setter('')
  }

  const removeChip = (field: string, index: number) => {
    if (!evento) return
    const arr = [...(evento[field] || [])]
    arr.splice(index, 1)
    updateField(field, arr)
  }

  return (
    <Modal open={open} onClose={onClose} title="Editar Evento" className="max-w-2xl">
      {loading ? (
        <p className="text-text-secondary text-center py-8">Carregando...</p>
      ) : !evento ? (
        <p className="text-text-secondary text-center py-8">Evento não encontrado.</p>
      ) : (
        <div className="space-y-4">

          {/* Row: Status + Categoria */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Status</label>
              <select value={evento.status} onChange={(e) => updateField('status', e.target.value)} className={`${inputClass} cursor-pointer`}>
                {STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Categoria</label>
              <select value={evento.categoria} onChange={(e) => updateField('categoria', e.target.value)} className={`${inputClass} cursor-pointer`}>
                {CATEGORIA_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          </div>

          {/* Tipo + Data */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Tipo de Evento</label>
              <input className={inputClass} value={evento.tipo || ''} onChange={(e) => updateField('tipo', e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Data do Evento *</label>
              <input type="date" className={inputClass} value={evento.data_evento || ''} onChange={(e) => updateField('data_evento', e.target.value)} />
            </div>
          </div>

          {/* Objetivo */}
          <div>
            <label className={labelClass}>Objetivo</label>
            <textarea className={textareaClass} value={evento.objetivo || ''} onChange={(e) => updateField('objetivo', e.target.value)} placeholder="Objetivo do evento..." />
          </div>

          {/* Tema */}
          <div>
            <label className={labelClass}>Tema</label>
            <input className={inputClass} value={evento.tema_custom || ''} onChange={(e) => updateField('tema_custom', e.target.value)} placeholder="Nome do tema..." />
          </div>

          {/* Público-alvo */}
          <div>
            <label className={labelClass}>Público-alvo</label>
            <textarea className={textareaClass} value={evento.publico_alvo || ''} onChange={(e) => updateField('publico_alvo', e.target.value)} placeholder="Público-alvo..." />
          </div>

          {/* Conteúdo */}
          <div>
            <label className={labelClass}>Conteúdo</label>
            <textarea className={textareaClass} value={evento.conteudo || ''} onChange={(e) => updateField('conteudo', e.target.value)} placeholder="Conteúdo programático..." />
          </div>

          {/* Formato */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className={labelClass}>Modalidade</label>
              <select value={evento.formato_modalidade || ''} onChange={(e) => updateField('formato_modalidade', e.target.value)} className={`${inputClass} cursor-pointer`}>
                {MODALIDADE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Período</label>
              <select value={evento.formato_periodo || ''} onChange={(e) => updateField('formato_periodo', e.target.value)} className={`${inputClass} cursor-pointer`}>
                {PERIODO_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Duração (h)</label>
              <input type="number" className={inputClass} min={0} step={0.5} value={evento.formato_duracao_horas || ''} onChange={(e) => updateField('formato_duracao_horas', parseFloat(e.target.value) || 0)} />
            </div>
          </div>

          {/* Parceiros */}
          <div>
            <label className={labelClass}>Parceiros</label>
            <textarea className={textareaClass} value={evento.parceiros || ''} onChange={(e) => updateField('parceiros', e.target.value)} placeholder="Parceiros envolvidos..." />
          </div>

          {/* Metas */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className={labelClass}>Meta Inscritos</label>
              <input type="number" className={inputClass} min={0} value={evento.metas_inscritos || ''} onChange={(e) => updateField('metas_inscritos', parseInt(e.target.value) || 0)} />
            </div>
            <div>
              <label className={labelClass}>Meta Presença</label>
              <input type="number" className={inputClass} min={0} value={evento.metas_presenca || ''} onChange={(e) => updateField('metas_presenca', parseInt(e.target.value) || 0)} />
            </div>
            <div>
              <label className={labelClass}>Meta Conversões</label>
              <input type="number" className={inputClass} min={0} value={evento.metas_conversoes || ''} onChange={(e) => updateField('metas_conversoes', parseInt(e.target.value) || 0)} />
            </div>
          </div>

          <div>
            <label className={labelClass}>Metas Qualitativas</label>
            <textarea className={textareaClass} value={evento.metas_qualitativas || ''} onChange={(e) => updateField('metas_qualitativas', e.target.value)} placeholder="Metas qualitativas..." />
          </div>

          {/* Cronograma (read-only summary) */}
          {evento.cronograma && Array.isArray(evento.cronograma) && evento.cronograma.length > 0 && (
            <div>
              <h4 className={labelClass}>Cronograma</h4>
              <div className="space-y-1 p-3 bg-background rounded-lg border border-border">
                {evento.cronograma.map((item: { nome: string; duracao_min: number; horario?: string }, i: number) => (
                  <div key={i} className="flex items-center gap-3 text-sm">
                    <span className="text-text">{item.nome}</span>
                    <span className="text-text-secondary">{item.duracao_min}min</span>
                    {item.horario && <span className="text-text-secondary">{item.horario}</span>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Orçamento (read-only summary) */}
          {evento.orcamento && typeof evento.orcamento === 'object' && (
            (() => {
              const cats = (['alimentacao', 'divulgacao', 'equipamento', 'deslocamento'] as const)
                .filter((cat) => Array.isArray(evento.orcamento?.[cat]) && evento.orcamento[cat].length > 0)
              if (cats.length === 0) return null
              return (
                <div>
                  <h4 className={labelClass}>Orçamento</h4>
                  <div className="p-3 bg-background rounded-lg border border-border space-y-1">
                    {cats.map((cat) => {
                      const items = evento.orcamento[cat] as OrcamentoItem[]
                      const total = items.reduce((s, item) => s + (item.quantidade || 0) * (item.valor_unitario || 0), 0)
                      return (
                        <div key={cat} className="text-sm">
                          <span className="text-text-secondary capitalize">{cat}: </span>
                          <span className="text-text font-medium">{formatBRL(total)}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })()
          )}

          {/* Pessoas */}
          <div className="border-t border-border pt-4">
            <h4 className={labelClass}>Pessoas</h4>
            <div className="flex flex-wrap gap-2 mb-2">
              {(evento.pessoas || []).map((p: string, i: number) => (
                <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-teal-light text-teal-dark text-sm font-medium">
                  {p}
                  <button type="button" onClick={() => removeChip('pessoas', i)} className="ml-0.5 hover:text-red-600 cursor-pointer">&times;</button>
                </span>
              ))}
              {(!evento.pessoas || evento.pessoas.length === 0) && (
                <span className="text-sm text-text-secondary italic">Nenhuma pessoa</span>
              )}
            </div>
            <div className="flex gap-2">
              <input
                type="text" className={`${inputClass} flex-1`} placeholder="Adicionar pessoa..."
                value={novaPessoa} onChange={(e) => setNovaPessoa(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addChip('pessoas', novaPessoa, setNovaPessoa) } }}
              />
              <Button size="sm" onClick={() => addChip('pessoas', novaPessoa, setNovaPessoa)}>Adicionar</Button>
            </div>
          </div>

          {/* Tags */}
          <div>
            <h4 className={labelClass}>Tags</h4>
            <div className="flex flex-wrap gap-2 mb-2">
              {(evento.tags || []).map((t: string, i: number) => (
                <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gray-100 text-text-secondary text-sm font-medium">
                  {t}
                  <button type="button" onClick={() => removeChip('tags', i)} className="ml-0.5 hover:text-red-600 cursor-pointer">&times;</button>
                </span>
              ))}
              {(!evento.tags || evento.tags.length === 0) && (
                <span className="text-sm text-text-secondary italic">Nenhuma tag</span>
              )}
            </div>
            <div className="flex gap-2">
              <input
                type="text" className={`${inputClass} flex-1`} placeholder="Adicionar tag..."
                value={novaTag} onChange={(e) => setNovaTag(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addChip('tags', novaTag, setNovaTag) } }}
              />
              <Button size="sm" onClick={() => addChip('tags', novaTag, setNovaTag)}>Adicionar</Button>
            </div>
          </div>

          {/* Recursos */}
          <div>
            <h4 className={labelClass}>Recursos</h4>
            <div className="flex flex-wrap gap-1 mb-2">
              {(evento.recursos || []).map((r: string, i: number) => (
                <Badge key={i} variant="gray">
                  {r}
                  <button type="button" onClick={() => removeChip('recursos', i)} className="ml-1 hover:text-red-600 cursor-pointer">&times;</button>
                </Badge>
              ))}
            </div>
          </div>

          {/* Criado por (read-only) */}
          <div className="text-xs text-text-secondary">
            Criado por: {evento.criado_por} em {evento.created_at ? new Date(evento.created_at).toLocaleDateString('pt-BR') : '—'}
          </div>

          {/* Error */}
          {saveError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {saveError}
            </div>
          )}

          {/* Save */}
          {dirty && (
            <div className="border-t border-border pt-4">
              <Button onClick={handleSave} disabled={saving} fullWidth>
                {saving ? 'Salvando...' : 'Salvar alterações'}
              </Button>
            </div>
          )}
        </div>
      )}
    </Modal>
  )
}
