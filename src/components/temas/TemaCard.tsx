import { useState } from 'react'
import type { TemaCompleto } from '../../types'
import Badge from '../ui/Badge'
import PalestranteCard from './PalestranteCard'

interface TemaCardProps {
  tema: TemaCompleto
  onEdit?: (tema: TemaCompleto) => void
  onDelete?: (id: string) => void
}

export default function TemaCard({ tema, onEdit, onDelete }: TemaCardProps) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div
      className="bg-surface rounded-xl border border-border shadow-sm overflow-hidden transition-shadow hover:shadow-md cursor-pointer"
      onClick={() => setExpanded(!expanded)}
    >
      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-lg font-semibold font-[family-name:var(--font-heading)] text-text">
            {tema.nome}
          </h3>
          {(onEdit || onDelete) && (
            <div className="flex gap-1 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
              {onEdit && (
                <button
                  onClick={() => onEdit(tema)}
                  className="p-1 text-text-secondary hover:text-teal transition-colors cursor-pointer"
                  title="Editar"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => { if (confirm(`Excluir tema "${tema.nome}"?`)) onDelete(tema.id) }}
                  className="p-1 text-text-secondary hover:text-red-500 transition-colors cursor-pointer"
                  title="Excluir"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-1.5 mt-2">
          {tema.tags.map((tag) => (
            <Badge key={tag} variant="teal">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="flex items-center justify-between mt-3">
          <div className="text-sm text-text-secondary">
            {tema.responsaveis.length > 0
              ? tema.responsaveis.map((r) => r.nome).join(', ')
              : 'Sem responsável definido'}
          </div>
          {tema.eventos_realizados !== undefined && tema.eventos_realizados > 0 && (
            <Badge variant="gray">
              {tema.eventos_realizados} evento{tema.eventos_realizados !== 1 ? 's' : ''}
            </Badge>
          )}
        </div>

        <button
          className="mt-2 text-sm text-teal hover:text-teal-dark font-medium transition-colors"
          onClick={(e) => {
            e.stopPropagation()
            setExpanded(!expanded)
          }}
        >
          {expanded ? 'Recolher' : 'Ver detalhes'}
        </button>
      </div>

      {expanded && (
        <div className="border-t border-border p-4 sm:p-5 bg-background/50">
          {tema.descricao && (
            <p className="text-sm text-text-secondary mb-4">{tema.descricao}</p>
          )}

          {tema.responsaveis.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-text mb-2">Palestrantes</h4>
              <div className="space-y-2">
                {tema.responsaveis.map((p) => (
                  <PalestranteCard key={p.id} palestrante={p} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
