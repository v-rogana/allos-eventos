import { useMemo } from 'react'
import KanbanColumn from './KanbanColumn'
import InstituicaoCard from './InstituicaoCard'
import type { Instituicao, StatusProspeccao } from '../../types'

interface KanbanBoardProps {
  instituicoes: Instituicao[]
  onStatusChange: (id: string, status: StatusProspeccao) => void
  loading: boolean
}

const COLUNAS: { status: StatusProspeccao; titulo: string; cor: string }[] = [
  { status: 'nao_contatada', titulo: 'Não Contatada', cor: 'bg-gray-200 text-gray-800' },
  { status: 'primeiro_contato', titulo: '1º Contato', cor: 'bg-blue-200 text-blue-900' },
  { status: 'reuniao_agendada', titulo: 'Reunião Agendada', cor: 'bg-amber-200 text-amber-900' },
  { status: 'reuniao_realizada', titulo: 'Reunião Realizada', cor: 'bg-purple-200 text-purple-900' },
  { status: 'parceria_formalizada', titulo: 'Parceria Formalizada', cor: 'bg-green-200 text-green-900' },
  { status: 'inativa', titulo: 'Inativa', cor: 'bg-red-100 text-red-800' },
]

export default function KanbanBoard({ instituicoes, onStatusChange, loading }: KanbanBoardProps) {
  const agrupadas = useMemo(() => {
    const map: Record<StatusProspeccao, Instituicao[]> = {
      nao_contatada: [],
      primeiro_contato: [],
      reuniao_agendada: [],
      reuniao_realizada: [],
      parceria_formalizada: [],
      inativa: [],
    }
    for (const inst of instituicoes) {
      if (map[inst.status]) {
        map[inst.status].push(inst)
      }
    }
    return map
  }, [instituicoes])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-text-secondary">Carregando instituições...</p>
      </div>
    )
  }

  return (
    <>
      {/* Desktop: horizontal scroll Kanban */}
      <div className="hidden md:flex gap-4 overflow-x-auto pb-4">
        {COLUNAS.map((col) => (
          <KanbanColumn
            key={col.status}
            titulo={col.titulo}
            cor={col.cor}
            instituicoes={agrupadas[col.status]}
            onStatusChange={onStatusChange}
          />
        ))}
      </div>

      {/* Mobile: vertical list with status dropdown per card */}
      <div className="md:hidden space-y-3">
        {instituicoes.length === 0 ? (
          <p className="text-center text-text-secondary py-12">
            Nenhuma instituição cadastrada. Clique em "Nova Instituição" para começar.
          </p>
        ) : (
          instituicoes.map((inst) => (
            <InstituicaoCard
              key={inst.id}
              instituicao={inst}
              onStatusChange={onStatusChange}
              isMobile
            />
          ))
        )}
      </div>
    </>
  )
}
