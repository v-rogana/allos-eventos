import type { Instituicao, StatusProspeccao } from '../../types'
import InstituicaoCard from './InstituicaoCard'

interface KanbanColumnProps {
  titulo: string
  cor: string
  instituicoes: Instituicao[]
  onStatusChange: (id: string, status: StatusProspeccao) => void
}

export default function KanbanColumn({ titulo, cor, instituicoes, onStatusChange }: KanbanColumnProps) {
  return (
    <div className="flex flex-col min-w-[280px] max-w-[320px] flex-shrink-0">
      {/* Header */}
      <div className={`rounded-t-lg px-3 py-2 ${cor}`}>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">{titulo}</h3>
          <span className="text-xs font-medium opacity-80">{instituicoes.length}</span>
        </div>
      </div>

      {/* Cards */}
      <div className="flex-1 bg-gray-50 rounded-b-lg p-2 space-y-2 min-h-[200px] border border-t-0 border-border">
        {instituicoes.length === 0 ? (
          <p className="text-xs text-text-secondary text-center py-8 italic">Nenhuma instituição</p>
        ) : (
          instituicoes.map((inst) => (
            <InstituicaoCard
              key={inst.id}
              instituicao={inst}
              onStatusChange={onStatusChange}
            />
          ))
        )}
      </div>
    </div>
  )
}
