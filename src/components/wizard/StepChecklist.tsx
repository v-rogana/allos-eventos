import { useEffect, useState } from 'react'
import type { EventoBriefing, ChecklistItem } from '../../types'
import {
  CHECKLIST_PRE_DEFAULT,
  CHECKLIST_DIA_DEFAULT,
  CHECKLIST_POS_DEFAULT,
} from '../../data/checklist-templates'

interface StepProps {
  data: EventoBriefing
  updateData: (partial: Partial<EventoBriefing>) => void
}

type ChecklistKey = 'checklist_pre' | 'checklist_dia' | 'checklist_pos'

const SECTIONS: { key: ChecklistKey; label: string; defaults: ChecklistItem[] }[] = [
  { key: 'checklist_pre', label: 'Antes de chegar', defaults: CHECKLIST_PRE_DEFAULT },
  { key: 'checklist_dia', label: 'Depois de chegar', defaults: CHECKLIST_DIA_DEFAULT },
  { key: 'checklist_pos', label: 'Pos-evento', defaults: CHECKLIST_POS_DEFAULT },
]

function ChecklistSection({
  label,
  items,
  onUpdate,
}: {
  label: string
  items: ChecklistItem[]
  onUpdate: (items: ChecklistItem[]) => void
}) {
  const [novoItem, setNovoItem] = useState('')

  const toggleItem = (index: number) => {
    const updated = items.map((item, i) =>
      i === index ? { ...item, feito: !item.feito } : item
    )
    onUpdate(updated)
  }

  const updateText = (index: number, texto: string) => {
    const updated = items.map((item, i) =>
      i === index ? { ...item, texto } : item
    )
    onUpdate(updated)
  }

  const removeItem = (index: number) => {
    onUpdate(items.filter((_, i) => i !== index))
  }

  const addItem = () => {
    const trimmed = novoItem.trim()
    if (trimmed) {
      onUpdate([...items, { texto: trimmed, feito: false }])
      setNovoItem('')
    }
  }

  const doneCount = items.filter((i) => i.feito).length

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <div className="px-4 py-3 bg-gray-50 flex items-center justify-between">
        <h3 className="font-semibold text-text-primary text-sm">{label}</h3>
        <span className="text-xs text-text-secondary">
          {doneCount}/{items.length} concluidos
        </span>
      </div>

      <div className="p-4 space-y-2">
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-2 group">
            <input
              type="checkbox"
              checked={item.feito}
              onChange={() => toggleItem(index)}
              className="w-4 h-4 rounded border-gray-300 text-teal focus:ring-teal shrink-0"
            />
            <input
              type="text"
              className={`flex-1 px-2 py-1 border border-transparent hover:border-gray-200 focus:border-teal rounded text-sm focus:outline-none focus:ring-1 focus:ring-teal transition-colors ${
                item.feito ? 'line-through text-text-secondary' : 'text-text-primary'
              }`}
              value={item.texto}
              onChange={(e) => updateText(index, e.target.value)}
            />
            <button
              type="button"
              onClick={() => removeItem(index)}
              className="p-1 text-red-500 opacity-0 group-hover:opacity-100 hover:bg-red-50 rounded transition-all"
              title="Remover"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}

        <div className="flex gap-2 pt-2">
          <input
            type="text"
            className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal focus:border-teal"
            placeholder="Adicionar item..."
            value={novoItem}
            onChange={(e) => setNovoItem(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                addItem()
              }
            }}
          />
          <button
            type="button"
            onClick={addItem}
            className="px-3 py-1.5 text-sm text-teal hover:text-teal-dark font-medium transition-colors"
          >
            Adicionar
          </button>
        </div>
      </div>
    </div>
  )
}

function StepChecklist({ data, updateData }: StepProps) {
  // Auto-load defaults if empty
  useEffect(() => {
    const updates: Partial<EventoBriefing> = {}
    let needsUpdate = false

    for (const section of SECTIONS) {
      if (data[section.key].length === 0) {
        updates[section.key] = section.defaults.map((item) => ({ ...item }))
        needsUpdate = true
      }
    }

    if (needsUpdate) {
      updateData(updates)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div>
      <h2 className="text-xl font-bold text-text-primary mb-2">Checklist</h2>
      <p className="text-text-secondary mb-6">
        Acompanhe as tarefas antes, durante e depois do evento.
      </p>

      <div className="space-y-4">
        {SECTIONS.map((section) => (
          <ChecklistSection
            key={section.key}
            label={section.label}
            items={data[section.key]}
            onUpdate={(items) => updateData({ [section.key]: items })}
          />
        ))}
      </div>
    </div>
  )
}

export default StepChecklist
