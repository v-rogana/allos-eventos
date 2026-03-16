import type { EventoBriefing, CronogramaItem } from '../../types'

interface StepProps {
  data: EventoBriefing
  updateData: (partial: Partial<EventoBriefing>) => void
}

function StepCronograma({ data, updateData }: StepProps) {
  const items = data.cronograma

  const updateItem = (index: number, field: keyof CronogramaItem, value: string | number) => {
    const updated = items.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    )
    updateData({ cronograma: updated })
  }

  const removeItem = (index: number) => {
    updateData({ cronograma: items.filter((_, i) => i !== index) })
  }

  const addItem = () => {
    updateData({
      cronograma: [...items, { nome: '', duracao_min: 30 }],
    })
  }

  const moveItem = (index: number, direction: -1 | 1) => {
    const newIndex = index + direction
    if (newIndex < 0 || newIndex >= items.length) return
    const updated = [...items]
    const temp = updated[index]
    updated[index] = updated[newIndex]
    updated[newIndex] = temp
    updateData({ cronograma: updated })
  }

  const totalMinutes = items.reduce((sum, item) => sum + (item.duracao_min || 0), 0)
  const totalHours = Math.floor(totalMinutes / 60)
  const remainingMinutes = totalMinutes % 60

  const inputClass =
    'w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal focus:border-teal'

  return (
    <div>
      <h2 className="text-xl font-bold text-text-primary mb-2">Cronograma</h2>
      <p className="text-text-secondary mb-6">Organize os blocos do evento.</p>

      {/* Data do evento */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-text-primary mb-1">
          Data do Evento <span className="text-terracotta">*</span>
        </label>
        <input
          type="date"
          className={`${inputClass} max-w-xs ${!data.data_evento ? 'border-terracotta ring-1 ring-terracotta' : ''}`}
          value={data.data_evento}
          onChange={(e) => updateData({ data_evento: e.target.value })}
          required
        />
        {!data.data_evento && (
          <p className="text-xs text-terracotta mt-1">A data do evento é obrigatória</p>
        )}
      </div>

      <div className="space-y-3">
        {items.map((item, index) => (
          <div
            key={index}
            className="flex flex-col sm:flex-row gap-2 p-3 bg-white border border-gray-200 rounded-lg"
          >
            <div className="flex gap-1 sm:flex-col sm:justify-center">
              <button
                type="button"
                onClick={() => moveItem(index, -1)}
                disabled={index === 0}
                className="p-1 text-text-secondary hover:text-teal disabled:opacity-30 transition-colors"
                title="Mover para cima"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => moveItem(index, 1)}
                disabled={index === items.length - 1}
                className="p-1 text-text-secondary hover:text-teal disabled:opacity-30 transition-colors"
                title="Mover para baixo"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>

            <div className="flex-1">
              <input
                type="text"
                className={inputClass}
                placeholder="Nome do bloco"
                value={item.nome}
                onChange={(e) => updateItem(index, 'nome', e.target.value)}
              />
            </div>

            <div className="w-full sm:w-28">
              <input
                type="number"
                className={inputClass}
                placeholder="Min"
                min={1}
                value={item.duracao_min || ''}
                onChange={(e) => updateItem(index, 'duracao_min', parseInt(e.target.value) || 0)}
              />
            </div>

            <div className="w-full sm:w-32">
              <input
                type="time"
                className={inputClass}
                value={item.horario || ''}
                onChange={(e) => updateItem(index, 'horario', e.target.value)}
              />
            </div>

            <button
              type="button"
              onClick={() => removeItem(index)}
              className="self-center p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors"
              title="Remover"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addItem}
        className="mt-4 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm text-text-secondary hover:border-teal hover:text-teal transition-colors w-full"
      >
        + Adicionar bloco
      </button>

      <div className="mt-4 p-3 bg-teal/5 rounded-lg text-sm font-medium text-teal-dark">
        Duracao total: {totalHours}h{remainingMinutes > 0 ? ` ${remainingMinutes}min` : ''} ({totalMinutes} minutos)
      </div>
    </div>
  )
}

export default StepCronograma
