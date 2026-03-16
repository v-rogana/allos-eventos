import { useState } from 'react'
import type { EventoBriefing, Modalidade, Periodo } from '../../types'
import { TEMAS_PRE_PRONTOS } from '../../data/temas'

interface StepProps {
  data: EventoBriefing
  updateData: (partial: Partial<EventoBriefing>) => void
}

function StepBriefing({ data, updateData }: StepProps) {
  const [novoRecurso, setNovoRecurso] = useState('')
  const [novaPessoa, setNovaPessoa] = useState('')
  const [novaTag, setNovaTag] = useState('')

  const handleTemaChange = (value: string) => {
    if (value === 'outro') {
      updateData({ tema_id: 'outro', tema_custom: '' })
    } else {
      const tema = TEMAS_PRE_PRONTOS.find((t) => t.id === value)
      updateData({ tema_id: value, tema_custom: tema ? tema.nome : '' })
    }
  }

  const toggleRecurso = (index: number) => {
    const updated = [...data.recursos]
    updated.splice(index, 1)
    updateData({ recursos: updated })
  }

  const addRecurso = () => {
    const trimmed = novoRecurso.trim()
    if (trimmed && !data.recursos.includes(trimmed)) {
      updateData({ recursos: [...data.recursos, trimmed] })
      setNovoRecurso('')
    }
  }

  const labelClass = 'block text-sm font-semibold text-text-primary mb-1'
  const inputClass =
    'w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal focus:border-teal'
  const textareaClass = `${inputClass} resize-y min-h-[80px]`

  return (
    <div>
      <h2 className="text-xl font-bold text-text-primary mb-2">Briefing do Evento</h2>
      <p className="text-text-secondary mb-6">Preencha os detalhes do seu evento.</p>

      <div className="space-y-5">
        {/* 1. Objetivo */}
        <div>
          <label className={labelClass}>Objetivo</label>
          <textarea
            className={textareaClass}
            value={data.objetivo}
            onChange={(e) => updateData({ objetivo: e.target.value })}
            placeholder="Descreva o objetivo principal do evento..."
          />
        </div>

        {/* 2. Tema */}
        <div>
          <label className={labelClass}>Tema</label>
          <select
            className={inputClass}
            value={data.tema_id}
            onChange={(e) => handleTemaChange(e.target.value)}
          >
            <option value="">Selecione um tema...</option>
            {TEMAS_PRE_PRONTOS.map((tema) => (
              <option key={tema.id} value={tema.id}>
                {tema.nome}
              </option>
            ))}
            <option value="outro">Outro</option>
          </select>
          {data.tema_id === 'outro' && (
            <input
              type="text"
              className={`${inputClass} mt-2`}
              placeholder="Digite o nome do tema..."
              value={data.tema_custom}
              onChange={(e) => updateData({ tema_custom: e.target.value })}
            />
          )}
        </div>

        {/* 3. Publico-alvo */}
        <div>
          <label className={labelClass}>Publico-alvo</label>
          <textarea
            className={textareaClass}
            value={data.publico_alvo}
            onChange={(e) => updateData({ publico_alvo: e.target.value })}
            placeholder="Quem vai participar? (ex: estudantes de psicologia, profissionais da area, comunidade em geral...)"
          />
        </div>

        {/* 4. Conteudo */}
        <div>
          <label className={labelClass}>Conteudo</label>
          <textarea
            className={textareaClass}
            value={data.conteudo}
            onChange={(e) => updateData({ conteudo: e.target.value })}
            placeholder="Descreva o conteudo programatico do evento..."
          />
        </div>

        {/* 5. Formato */}
        <div>
          <label className={labelClass}>Formato</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs text-text-secondary mb-1">Modalidade</label>
              <select
                className={inputClass}
                value={data.formato_modalidade}
                onChange={(e) => updateData({ formato_modalidade: e.target.value as Modalidade | '' })}
              >
                <option value="">Selecione...</option>
                <option value="presencial">Presencial</option>
                <option value="online">Online</option>
                <option value="hibrido">Hibrido</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-text-secondary mb-1">Periodo</label>
              <select
                className={inputClass}
                value={data.formato_periodo}
                onChange={(e) => updateData({ formato_periodo: e.target.value as Periodo | '' })}
              >
                <option value="">Selecione...</option>
                <option value="manha">Manha</option>
                <option value="tarde">Tarde</option>
                <option value="noite">Noite</option>
                <option value="dia_inteiro">Dia inteiro</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-text-secondary mb-1">Duracao (horas)</label>
              <input
                type="number"
                className={inputClass}
                min={0}
                step={0.5}
                value={data.formato_duracao_horas || ''}
                onChange={(e) =>
                  updateData({ formato_duracao_horas: parseFloat(e.target.value) || 0 })
                }
              />
            </div>
          </div>
        </div>

        {/* 6. Parceiros */}
        <div>
          <label className={labelClass}>Parceiros</label>
          <textarea
            className={textareaClass}
            value={data.parceiros}
            onChange={(e) => updateData({ parceiros: e.target.value })}
            placeholder="Liste os parceiros envolvidos no evento..."
          />
        </div>

        {/* 7. Recursos */}
        <div>
          <label className={labelClass}>Recursos</label>
          <div className="space-y-2 mb-3">
            {data.recursos.map((recurso, i) => (
              <label key={i} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={true}
                  onChange={() => toggleRecurso(i)}
                  className="w-4 h-4 rounded border-gray-300 text-teal focus:ring-teal"
                />
                <span className="text-text-primary">{recurso}</span>
              </label>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              className={`${inputClass} flex-1`}
              placeholder="Adicionar recurso..."
              value={novoRecurso}
              onChange={(e) => setNovoRecurso(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  addRecurso()
                }
              }}
            />
            <button
              type="button"
              onClick={addRecurso}
              className="px-4 py-2 bg-teal text-white rounded-lg text-sm font-medium hover:bg-teal-dark transition-colors"
            >
              Adicionar
            </button>
          </div>
        </div>

        {/* 8. Metas */}
        <div>
          <label className={labelClass}>Metas</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
            <div>
              <label className="block text-xs text-text-secondary mb-1">Inscritos</label>
              <input
                type="number"
                className={inputClass}
                min={0}
                value={data.metas_inscritos || ''}
                onChange={(e) => updateData({ metas_inscritos: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div>
              <label className="block text-xs text-text-secondary mb-1">Presenca esperada</label>
              <input
                type="number"
                className={inputClass}
                min={0}
                value={data.metas_presenca || ''}
                onChange={(e) => updateData({ metas_presenca: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div>
              <label className="block text-xs text-text-secondary mb-1">Conversoes</label>
              <input
                type="number"
                className={inputClass}
                min={0}
                value={data.metas_conversoes || ''}
                onChange={(e) => updateData({ metas_conversoes: parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>
          <textarea
            className={textareaClass}
            value={data.metas_qualitativas}
            onChange={(e) => updateData({ metas_qualitativas: e.target.value })}
            placeholder="Metas qualitativas (ex: fortalecer marca, criar comunidade...)"
          />
        </div>

        {/* 9. Pessoas */}
        <div>
          <label className={labelClass}>Pessoas (Responsáveis / Palestrantes)</label>
          <div className="flex flex-wrap gap-2 mb-3">
            {data.pessoas.map((pessoa, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-teal-light text-teal-dark text-sm font-medium"
              >
                {pessoa}
                <button
                  type="button"
                  onClick={() => updateData({ pessoas: data.pessoas.filter((_, j) => j !== i) })}
                  className="ml-0.5 hover:text-red-600 cursor-pointer"
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              className={`${inputClass} flex-1`}
              placeholder="Adicionar pessoa..."
              value={novaPessoa}
              onChange={(e) => setNovaPessoa(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  const trimmed = novaPessoa.trim()
                  if (trimmed && !data.pessoas.includes(trimmed)) {
                    updateData({ pessoas: [...data.pessoas, trimmed] })
                    setNovaPessoa('')
                  }
                }
              }}
            />
            <button
              type="button"
              onClick={() => {
                const trimmed = novaPessoa.trim()
                if (trimmed && !data.pessoas.includes(trimmed)) {
                  updateData({ pessoas: [...data.pessoas, trimmed] })
                  setNovaPessoa('')
                }
              }}
              className="px-4 py-2 bg-teal text-white rounded-lg text-sm font-medium hover:bg-teal-dark transition-colors"
            >
              Adicionar
            </button>
          </div>
        </div>

        {/* 10. Tags */}
        <div>
          <label className={labelClass}>Tags</label>
          <div className="flex flex-wrap gap-2 mb-3">
            {data.tags.map((tag, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gray-100 text-text-secondary text-sm font-medium"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => updateData({ tags: data.tags.filter((_, j) => j !== i) })}
                  className="ml-0.5 hover:text-red-600 cursor-pointer"
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              className={`${inputClass} flex-1`}
              placeholder="Adicionar tag..."
              value={novaTag}
              onChange={(e) => setNovaTag(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  const trimmed = novaTag.trim()
                  if (trimmed && !data.tags.includes(trimmed)) {
                    updateData({ tags: [...data.tags, trimmed] })
                    setNovaTag('')
                  }
                }
              }}
            />
            <button
              type="button"
              onClick={() => {
                const trimmed = novaTag.trim()
                if (trimmed && !data.tags.includes(trimmed)) {
                  updateData({ tags: [...data.tags, trimmed] })
                  setNovaTag('')
                }
              }}
              className="px-4 py-2 bg-teal text-white rounded-lg text-sm font-medium hover:bg-teal-dark transition-colors"
            >
              Adicionar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StepBriefing
