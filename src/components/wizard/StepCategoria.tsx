import type { EventoBriefing, Categoria } from '../../types'
import { CATEGORIAS } from '../../data/categorias'

interface StepProps {
  data: EventoBriefing
  updateData: (partial: Partial<EventoBriefing>) => void
}

const CATEGORY_COLORS: Record<string, string> = {
  'cat-promocional': '#3B82F6',
  'cat-comunitario': '#10B981',
  'cat-corporativo': '#8B5CF6',
  'cat-institucional': '#F59E0B',
}

function StepCategoria({ data, updateData }: StepProps) {
  const handleSelect = (id: Categoria) => {
    updateData({
      categoria: id,
      tipo_evento_id: '',
      tipo_evento_nome: '',
    })
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-text-primary mb-2">Categoria do Evento</h2>
      <p className="text-text-secondary mb-6">Selecione a categoria que melhor descreve seu evento.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {CATEGORIAS.map((cat) => {
          const isSelected = data.categoria === cat.id
          const borderColor = CATEGORY_COLORS[cat.cor] || '#6B7280'

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => handleSelect(cat.id)}
              className={`
                text-left p-4 rounded-lg border-2 transition-all
                ${isSelected ? 'ring-2 ring-teal border-teal bg-teal/5' : 'border-gray-200 hover:border-gray-300 bg-white'}
              `}
              style={{ borderLeftWidth: '4px', borderLeftColor: borderColor }}
            >
              <h3 className="font-semibold text-text-primary mb-1">{cat.nome}</h3>
              <p className="text-sm text-text-secondary mb-2">{cat.objetivo}</p>
              <p className="text-xs text-text-secondary">
                <span className="font-medium">Parceiros-alvo:</span> {cat.parceiros_alvo}
              </p>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default StepCategoria
