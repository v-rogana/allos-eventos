import type { EventoBriefing, Categoria } from '../../types'
import { TIPOS_EVENTO } from '../../data/tipos-evento'

interface StepProps {
  data: EventoBriefing
  updateData: (partial: Partial<EventoBriefing>) => void
}

function StepTipoEvento({ data, updateData }: StepProps) {
  const categoria = data.categoria as Categoria
  const tipos = categoria ? TIPOS_EVENTO[categoria] || [] : []

  const handleSelect = (tipoId: string) => {
    const tipo = tipos.find((t) => t.id === tipoId)
    if (!tipo) return

    const tpl = tipo.template
    updateData({
      tipo_evento_id: tipo.id,
      tipo_evento_nome: tipo.nome,
      objetivo: tpl.objetivo_sugestao,
      formato_modalidade: tpl.formato_modalidade,
      formato_periodo: tpl.formato_periodo,
      formato_duracao_horas: tpl.formato_duracao_horas,
      recursos: [...tpl.recursos_sugeridos],
      cronograma: tpl.cronograma_padrao.map((c) => ({ ...c })),
    })
  }

  if (!categoria) {
    return (
      <div className="text-center py-12 text-text-secondary">
        Selecione uma categoria primeiro.
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-text-primary mb-2">Tipo de Evento</h2>
      <p className="text-text-secondary mb-6">
        Escolha o tipo de evento dentro da categoria selecionada.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {tipos.map((tipo) => {
          const isSelected = data.tipo_evento_id === tipo.id
          const descricao =
            tipo.template.objetivo_sugestao.length > 80
              ? tipo.template.objetivo_sugestao.slice(0, 80) + '...'
              : tipo.template.objetivo_sugestao

          return (
            <button
              key={tipo.id}
              type="button"
              onClick={() => handleSelect(tipo.id)}
              className={`
                text-left p-4 rounded-lg border-2 transition-all
                ${isSelected ? 'ring-2 ring-teal border-teal bg-teal/5' : 'border-gray-200 hover:border-gray-300 bg-white'}
              `}
            >
              <h3 className="font-semibold text-text-primary mb-1">{tipo.nome}</h3>
              <p className="text-sm text-text-secondary">{descricao}</p>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default StepTipoEvento
