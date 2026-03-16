import { useEffect } from 'react'
import type { EventoBriefing, DivulgacaoItem } from '../../types'
import { DIVULGACAO_DEFAULT } from '../../data/divulgacao-template'

interface StepProps {
  data: EventoBriefing
  updateData: (partial: Partial<EventoBriefing>) => void
}

function calcTargetDate(dataEvento: string, diasAntes: number): string {
  if (!dataEvento) return ''
  const date = new Date(dataEvento + 'T00:00:00')
  date.setDate(date.getDate() - diasAntes)
  return date.toLocaleDateString('pt-BR')
}

function StepDivulgacao({ data, updateData }: StepProps) {
  // Auto-load defaults if empty
  useEffect(() => {
    if (data.plano_divulgacao.length === 0) {
      updateData({
        plano_divulgacao: DIVULGACAO_DEFAULT.map((item) => ({ ...item })),
      })
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const items = data.plano_divulgacao

  const updateItem = (index: number, partial: Partial<DivulgacaoItem>) => {
    const updated = items.map((item, i) =>
      i === index ? { ...item, ...partial } : item
    )
    updateData({ plano_divulgacao: updated })
  }

  const removeItem = (index: number) => {
    updateData({ plano_divulgacao: items.filter((_, i) => i !== index) })
  }

  const addItem = () => {
    updateData({
      plano_divulgacao: [
        ...items,
        { descricao: '', dias_antes: 7, continuo: false, feito: false },
      ],
    })
  }

  const inputClass =
    'w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal focus:border-teal'

  return (
    <div>
      <h2 className="text-xl font-bold text-text-primary mb-2">Plano de Divulgacao</h2>
      <p className="text-text-secondary mb-6">
        Organize as acoes de divulgacao do evento.
      </p>

      {/* Data do evento */}
      {!data.data_evento && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <label className="block text-sm font-semibold text-text-primary mb-1">
            Data do Evento (necessaria para calcular datas-alvo)
          </label>
          <input
            type="date"
            className={`${inputClass} max-w-xs`}
            value={data.data_evento}
            onChange={(e) => updateData({ data_evento: e.target.value })}
          />
        </div>
      )}

      <div className="space-y-3">
        {items.map((item, index) => (
          <div
            key={index}
            className={`p-3 border rounded-lg transition-colors ${
              item.feito ? 'bg-teal/5 border-teal/30' : 'bg-white border-gray-200'
            }`}
          >
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={item.feito}
                onChange={(e) => updateItem(index, { feito: e.target.checked })}
                className="mt-1 w-4 h-4 rounded border-gray-300 text-teal focus:ring-teal"
              />
              <div className="flex-1 space-y-2">
                <input
                  type="text"
                  className={`${inputClass} ${item.feito ? 'line-through text-text-secondary' : ''}`}
                  value={item.descricao}
                  onChange={(e) => updateItem(index, { descricao: e.target.value })}
                  placeholder="Descricao da acao..."
                />
                <div className="flex flex-wrap items-center gap-3 text-sm">
                  <label className="flex items-center gap-1.5">
                    <input
                      type="checkbox"
                      checked={item.continuo}
                      onChange={(e) =>
                        updateItem(index, {
                          continuo: e.target.checked,
                          dias_antes: e.target.checked ? null : 7,
                        })
                      }
                      className="w-3.5 h-3.5 rounded border-gray-300 text-teal focus:ring-teal"
                    />
                    <span className="text-text-secondary">Continuo</span>
                  </label>

                  {item.continuo ? (
                    <span className="text-xs font-medium text-teal bg-teal/10 px-2 py-0.5 rounded">
                      Continuo
                    </span>
                  ) : (
                    <>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          className="w-16 px-2 py-1 border border-gray-300 rounded text-sm text-center focus:outline-none focus:ring-2 focus:ring-teal focus:border-teal"
                          min={0}
                          value={item.dias_antes ?? ''}
                          onChange={(e) =>
                            updateItem(index, {
                              dias_antes: e.target.value ? parseInt(e.target.value) : null,
                            })
                          }
                        />
                        <span className="text-text-secondary text-xs">dias antes</span>
                      </div>
                      {data.data_evento && item.dias_antes !== null && (
                        <span className="text-xs text-text-secondary">
                          Alvo: {calcTargetDate(data.data_evento, item.dias_antes)}
                        </span>
                      )}
                    </>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeItem(index)}
                className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
                title="Remover"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addItem}
        className="mt-4 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm text-text-secondary hover:border-teal hover:text-teal transition-colors w-full"
      >
        + Adicionar acao
      </button>
    </div>
  )
}

export default StepDivulgacao
