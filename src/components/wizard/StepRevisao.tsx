import { useState } from 'react'
import type { EventoBriefing } from '../../types'
import { supabase } from '../../lib/supabase'

interface StepProps {
  data: EventoBriefing
  updateData: (partial: Partial<EventoBriefing>) => void
}

function formatBRL(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

const MODALIDADE_LABELS: Record<string, string> = {
  presencial: 'Presencial',
  online: 'Online',
  hibrido: 'Hibrido',
}

const PERIODO_LABELS: Record<string, string> = {
  manha: 'Manha',
  tarde: 'Tarde',
  noite: 'Noite',
  dia_inteiro: 'Dia inteiro',
}

function PencilIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
      />
    </svg>
  )
}

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <div className="px-4 py-3 bg-gray-50 flex items-center justify-between">
        <h3 className="font-semibold text-text-primary text-sm">{title}</h3>
        <button
          type="button"
          className="p-1 text-text-secondary hover:text-teal transition-colors"
          title="Editar"
        >
          <PencilIcon />
        </button>
      </div>
      <div className="p-4 text-sm space-y-2">{children}</div>
    </div>
  )
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  if (!value) return null
  return (
    <div>
      <span className="font-medium text-text-secondary">{label}: </span>
      <span className="text-text-primary">{value}</span>
    </div>
  )
}

function StepRevisao({ data, updateData }: StepProps) {
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  async function handleSave() {
    if (!data.criado_por.trim()) {
      setError('Preencha o campo "Criado por"')
      return
    }
    if (!data.data_evento) {
      setError('A data do evento é obrigatória. Volte ao passo "Cronograma" e preencha.')
      return
    }
    setSaving(true)
    setError('')
    const { error: dbError } = await supabase.from('eventos').insert({
      categoria: data.categoria,
      tipo: data.tipo_evento_nome,
      status: 'rascunho',
      objetivo: data.objetivo,
      tema_id: data.tema_id === 'outro' ? null : data.tema_id,
      tema_custom: data.tema_id === 'outro' ? data.tema_custom : null,
      publico_alvo: data.publico_alvo,
      conteudo: data.conteudo,
      formato_modalidade: data.formato_modalidade || null,
      formato_periodo: data.formato_periodo || null,
      formato_duracao_horas: data.formato_duracao_horas || null,
      parceiros: data.parceiros,
      recursos: data.recursos,
      metas_inscritos: data.metas_inscritos || null,
      metas_presenca: data.metas_presenca || null,
      metas_conversoes: data.metas_conversoes || null,
      metas_qualitativas: data.metas_qualitativas,
      data_evento: data.data_evento || null,
      cronograma: data.cronograma,
      orcamento: data.orcamento,
      plano_divulgacao: data.plano_divulgacao,
      checklist_pre: data.checklist_pre,
      checklist_dia: data.checklist_dia,
      checklist_pos: data.checklist_pos,
      criado_por: data.criado_por,
      pessoas: data.pessoas,
      tags: data.tags,
    })
    setSaving(false)
    if (dbError) {
      setError('Erro ao salvar: ' + dbError.message)
    } else {
      setSaved(true)
    }
  }

  if (saved) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-bold mb-2">Briefing salvo com sucesso!</h3>
        <p className="text-text-secondary">O evento foi salvo como rascunho.</p>
      </div>
    )
  }

  const totalOrcamento = Object.values(data.orcamento).reduce(
    (total, items) =>
      total + items.reduce((sum, item) => sum + item.quantidade * item.valor_unitario, 0),
    0
  )

  const totalMinutos = data.cronograma.reduce((sum, item) => sum + (item.duracao_min || 0), 0)
  const totalHoras = Math.floor(totalMinutos / 60)
  const restMinutos = totalMinutos % 60

  const checklistTotal =
    data.checklist_pre.length + data.checklist_dia.length + data.checklist_pos.length
  const checklistDone =
    data.checklist_pre.filter((i) => i.feito).length +
    data.checklist_dia.filter((i) => i.feito).length +
    data.checklist_pos.filter((i) => i.feito).length

  const divulgacaoDone = data.plano_divulgacao.filter((i) => i.feito).length

  return (
    <div>
      <h2 className="text-xl font-bold text-text-primary mb-2">Revisao do Briefing</h2>
      <p className="text-text-secondary mb-6">Confira todos os dados antes de salvar.</p>

      {/* Criado por */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-text-primary mb-1">Criado por</label>
        <input
          type="text"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal focus:border-teal"
          placeholder="Seu nome..."
          value={data.criado_por}
          onChange={(e) => updateData({ criado_por: e.target.value })}
        />
      </div>

      <div className="space-y-4">
        {/* Categoria & Tipo */}
        <Section title="Categoria e Tipo">
          <Field label="Categoria" value={data.categoria} />
          <Field label="Tipo de evento" value={data.tipo_evento_nome} />
        </Section>

        {/* Briefing */}
        <Section title="Briefing">
          <Field label="Objetivo" value={data.objetivo} />
          <Field label="Tema" value={data.tema_id === 'outro' ? data.tema_custom : data.tema_custom || data.tema_id} />
          <Field label="Publico-alvo" value={data.publico_alvo} />
          <Field label="Conteudo" value={data.conteudo} />
          <Field
            label="Formato"
            value={
              [
                data.formato_modalidade ? MODALIDADE_LABELS[data.formato_modalidade] : '',
                data.formato_periodo ? PERIODO_LABELS[data.formato_periodo] : '',
                data.formato_duracao_horas ? `${data.formato_duracao_horas}h` : '',
              ]
                .filter(Boolean)
                .join(' / ') || undefined
            }
          />
          <Field label="Parceiros" value={data.parceiros} />
          {data.recursos.length > 0 && (
            <div>
              <span className="font-medium text-text-secondary">Recursos: </span>
              <ul className="list-disc list-inside text-text-primary mt-1">
                {data.recursos.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>
          )}
          <Field label="Meta inscritos" value={data.metas_inscritos || undefined} />
          <Field label="Meta presenca" value={data.metas_presenca || undefined} />
          <Field label="Meta conversoes" value={data.metas_conversoes || undefined} />
          <Field label="Metas qualitativas" value={data.metas_qualitativas} />
        </Section>

        {/* Cronograma */}
        <Section title="Cronograma">
          <Field
            label="Data do evento"
            value={
              data.data_evento
                ? new Date(data.data_evento + 'T00:00:00').toLocaleDateString('pt-BR')
                : undefined
            }
          />
          {data.cronograma.length > 0 && (
            <div className="mt-2">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-text-secondary">
                    <th className="py-1 font-medium">Bloco</th>
                    <th className="py-1 font-medium w-20">Duracao</th>
                    <th className="py-1 font-medium w-20">Horario</th>
                  </tr>
                </thead>
                <tbody>
                  {data.cronograma.map((item, i) => (
                    <tr key={i} className="border-t border-gray-100">
                      <td className="py-1 text-text-primary">{item.nome}</td>
                      <td className="py-1 text-text-primary">{item.duracao_min}min</td>
                      <td className="py-1 text-text-primary">{item.horario || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-2 text-teal-dark font-medium">
                Total: {totalHoras}h{restMinutos > 0 ? ` ${restMinutos}min` : ''}
              </div>
            </div>
          )}
        </Section>

        {/* Orcamento */}
        <Section title="Orcamento">
          {(
            [
              ['Alimentacao', data.orcamento.alimentacao],
              ['Material de Divulgacao', data.orcamento.divulgacao],
              ['Equipamento', data.orcamento.equipamento],
              ['Deslocamento', data.orcamento.deslocamento],
            ] as const
          ).map(([label, items]) => {
            if (items.length === 0) return null
            const sectionTotal = items.reduce(
              (s, item) => s + item.quantidade * item.valor_unitario,
              0
            )
            return (
              <div key={label} className="mb-2">
                <span className="font-medium text-text-secondary">{label}: </span>
                <span className="text-text-primary">{formatBRL(sectionTotal)}</span>
                <ul className="list-disc list-inside text-text-primary ml-2 text-xs mt-1">
                  {items.map((item, i) => (
                    <li key={i}>
                      {item.nome} - {item.quantidade}x {formatBRL(item.valor_unitario)} ={' '}
                      {formatBRL(item.quantidade * item.valor_unitario)}
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
          <div className="mt-2 pt-2 border-t border-gray-200 font-bold text-teal-dark">
            Total Geral: {formatBRL(totalOrcamento)}
          </div>
        </Section>

        {/* Divulgacao */}
        <Section title="Plano de Divulgacao">
          <p className="text-text-secondary">
            {divulgacaoDone}/{data.plano_divulgacao.length} acoes concluidas
          </p>
          {data.plano_divulgacao.length > 0 && (
            <ul className="space-y-1 mt-2">
              {data.plano_divulgacao.map((item, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full shrink-0 ${
                      item.feito ? 'bg-teal' : 'bg-gray-300'
                    }`}
                  />
                  <span className={item.feito ? 'line-through text-text-secondary' : 'text-text-primary'}>
                    {item.descricao}
                  </span>
                  <span className="text-xs text-text-secondary ml-auto">
                    {item.continuo ? 'Continuo' : item.dias_antes !== null ? `${item.dias_antes}d antes` : ''}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Section>

        {/* Pessoas e Tags */}
        {(data.pessoas.length > 0 || data.tags.length > 0) && (
          <Section title="Pessoas e Tags">
            {data.pessoas.length > 0 && (
              <div>
                <span className="font-medium text-text-secondary">Pessoas: </span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {data.pessoas.map((p, i) => (
                    <span key={i} className="inline-flex items-center px-2 py-0.5 rounded-full bg-teal-light text-teal-dark text-xs font-medium">
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {data.tags.length > 0 && (
              <div>
                <span className="font-medium text-text-secondary">Tags: </span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {data.tags.map((t, i) => (
                    <span key={i} className="inline-flex items-center px-2 py-0.5 rounded-full bg-gray-100 text-text-secondary text-xs font-medium">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </Section>
        )}

        {/* Checklist */}
        <Section title="Checklist">
          <p className="text-text-secondary">
            {checklistDone}/{checklistTotal} tarefas concluidas
          </p>
          {[
            { label: 'Antes de chegar', items: data.checklist_pre },
            { label: 'Depois de chegar', items: data.checklist_dia },
            { label: 'Pos-evento', items: data.checklist_pos },
          ].map(({ label, items }) =>
            items.length > 0 ? (
              <div key={label} className="mt-2">
                <span className="font-medium text-text-secondary text-xs uppercase tracking-wide">
                  {label}
                </span>
                <ul className="mt-1 space-y-0.5">
                  {items.map((item, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span
                        className={`w-2 h-2 rounded-full shrink-0 ${
                          item.feito ? 'bg-teal' : 'bg-gray-300'
                        }`}
                      />
                      <span
                        className={
                          item.feito ? 'line-through text-text-secondary' : 'text-text-primary'
                        }
                      >
                        {item.texto}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null
          )}
        </Section>
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Salvar button */}
      <div className="mt-8">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="w-full py-3 rounded-lg bg-terracotta text-white font-bold text-base hover:bg-terracotta/90 transition-colors disabled:opacity-50"
        >
          {saving ? 'Salvando...' : 'Salvar Briefing'}
        </button>
      </div>
    </div>
  )
}

export default StepRevisao
