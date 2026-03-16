import { useState } from 'react'
import type { EventoBriefing, OrcamentoItem } from '../../types'

interface StepProps {
  data: EventoBriefing
  updateData: (partial: Partial<EventoBriefing>) => void
}

type OrcamentoCategoria = 'alimentacao' | 'divulgacao' | 'equipamento' | 'deslocamento'

const SECTION_LABELS: Record<OrcamentoCategoria, string> = {
  alimentacao: 'Alimentacao',
  divulgacao: 'Material de Divulgacao',
  equipamento: 'Equipamento',
  deslocamento: 'Deslocamento',
}

function formatBRL(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function OrcamentoSection({
  categoria,
  label,
  items,
  onUpdate,
}: {
  categoria: OrcamentoCategoria
  label: string
  items: OrcamentoItem[]
  onUpdate: (cat: OrcamentoCategoria, items: OrcamentoItem[]) => void
}) {
  const [expanded, setExpanded] = useState(true)

  const updateItem = (index: number, field: keyof OrcamentoItem, value: string | number) => {
    const updated = items.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    )
    onUpdate(categoria, updated)
  }

  const removeItem = (index: number) => {
    onUpdate(categoria, items.filter((_, i) => i !== index))
  }

  const addItem = () => {
    onUpdate(categoria, [...items, { nome: '', quantidade: 1, valor_unitario: 0 }])
  }

  const sectionTotal = items.reduce(
    (sum, item) => sum + item.quantidade * item.valor_unitario,
    0
  )

  const inputClass =
    'w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal focus:border-teal'

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors"
      >
        <span className="font-semibold text-text-primary text-sm">{label}</span>
        <div className="flex items-center gap-3">
          <span className="text-sm text-teal-dark font-medium">{formatBRL(sectionTotal)}</span>
          <svg
            className={`w-4 h-4 text-text-secondary transition-transform ${expanded ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {expanded && (
        <div className="p-4">
          {items.length > 0 && (
            <div className="hidden sm:grid grid-cols-[1fr_80px_100px_90px_32px] gap-2 mb-2 text-xs text-text-secondary font-medium">
              <span>Item</span>
              <span>Qtd</span>
              <span>Valor unit.</span>
              <span>Subtotal</span>
              <span />
            </div>
          )}

          <div className="space-y-2">
            {items.map((item, index) => {
              const subtotal = item.quantidade * item.valor_unitario
              return (
                <div
                  key={index}
                  className="grid grid-cols-1 sm:grid-cols-[1fr_80px_100px_90px_32px] gap-2 items-center"
                >
                  <input
                    type="text"
                    className={inputClass}
                    placeholder="Nome do item"
                    value={item.nome}
                    onChange={(e) => updateItem(index, 'nome', e.target.value)}
                  />
                  <input
                    type="number"
                    className={inputClass}
                    placeholder="Qtd"
                    min={1}
                    value={item.quantidade || ''}
                    onChange={(e) =>
                      updateItem(index, 'quantidade', parseInt(e.target.value) || 0)
                    }
                  />
                  <input
                    type="number"
                    className={inputClass}
                    placeholder="R$ 0,00"
                    min={0}
                    step={0.01}
                    value={item.valor_unitario || ''}
                    onChange={(e) =>
                      updateItem(index, 'valor_unitario', parseFloat(e.target.value) || 0)
                    }
                  />
                  <span className="text-sm font-medium text-text-primary px-1">
                    {formatBRL(subtotal)}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors justify-self-center"
                    title="Remover"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )
            })}
          </div>

          <button
            type="button"
            onClick={addItem}
            className="mt-3 px-3 py-1.5 text-sm text-teal hover:text-teal-dark font-medium transition-colors"
          >
            + Adicionar item
          </button>
        </div>
      )}
    </div>
  )
}

function StepOrcamento({ data, updateData }: StepProps) {
  const handleUpdateSection = (cat: OrcamentoCategoria, items: OrcamentoItem[]) => {
    updateData({
      orcamento: {
        ...data.orcamento,
        [cat]: items,
      },
    })
  }

  const totalGeral = (Object.keys(SECTION_LABELS) as OrcamentoCategoria[]).reduce(
    (total, cat) =>
      total +
      data.orcamento[cat].reduce(
        (sum, item) => sum + item.quantidade * item.valor_unitario,
        0
      ),
    0
  )

  return (
    <div>
      <h2 className="text-xl font-bold text-text-primary mb-2">Orcamento</h2>
      <p className="text-text-secondary mb-6">Estime os custos do evento por categoria.</p>

      <div className="space-y-4">
        {(Object.keys(SECTION_LABELS) as OrcamentoCategoria[]).map((cat) => (
          <OrcamentoSection
            key={cat}
            categoria={cat}
            label={SECTION_LABELS[cat]}
            items={data.orcamento[cat]}
            onUpdate={handleUpdateSection}
          />
        ))}
      </div>

      <div className="mt-6 p-4 bg-teal/5 rounded-lg flex justify-between items-center">
        <span className="font-bold text-text-primary">Total Geral</span>
        <span className="text-lg font-bold text-teal-dark">{formatBRL(totalGeral)}</span>
      </div>
    </div>
  )
}

export default StepOrcamento
