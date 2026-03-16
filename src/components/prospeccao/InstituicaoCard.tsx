import { useState } from 'react'
import Badge from '../ui/Badge'
import InstituicaoModal from './InstituicaoModal'
import PitchModal from './PitchModal'
import type { Instituicao, StatusProspeccao } from '../../types'

interface InstituicaoCardProps {
  instituicao: Instituicao
  onStatusChange: (id: string, status: StatusProspeccao) => void
  isMobile?: boolean
}

const TIPO_LABELS: Record<string, string> = {
  faculdade: 'Faculdade',
  da: 'DA',
  liga: 'Liga',
  atletica: 'Atlética',
  outro: 'Outro',
}

const STATUS_OPTIONS: { value: StatusProspeccao; label: string }[] = [
  { value: 'nao_contatada', label: 'Não Contatada' },
  { value: 'primeiro_contato', label: '1º Contato' },
  { value: 'reuniao_agendada', label: 'Reunião Agendada' },
  { value: 'reuniao_realizada', label: 'Reunião Realizada' },
  { value: 'parceria_formalizada', label: 'Parceria Formalizada' },
  { value: 'inativa', label: 'Inativa' },
]

function formatDate(d: string | null): string {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('pt-BR')
}

export default function InstituicaoCard({ instituicao, onStatusChange, isMobile }: InstituicaoCardProps) {
  const [showModal, setShowModal] = useState(false)
  const [showPitch, setShowPitch] = useState(false)

  return (
    <>
      <div
        className="bg-surface rounded-lg border border-border p-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
        onClick={() => setShowModal(true)}
      >
        <div className="flex items-start justify-between gap-2">
          <h4 className="text-sm font-semibold text-text truncate">{instituicao.nome}</h4>
          <Badge variant="gray">{TIPO_LABELS[instituicao.tipo] || instituicao.tipo}</Badge>
        </div>

        {instituicao.promoter_responsavel && (
          <p className="text-xs text-text-secondary mt-1 truncate">
            {instituicao.promoter_responsavel}
          </p>
        )}

        <p className="text-xs text-text-secondary mt-1">
          Último contato: {formatDate(instituicao.data_ultimo_contato)}
        </p>

        {isMobile && (
          <div className="flex items-center gap-2 mt-2" onClick={(e) => e.stopPropagation()}>
            <select
              value={instituicao.status}
              onChange={(e) => onStatusChange(instituicao.id, e.target.value as StatusProspeccao)}
              className="text-xs px-2 py-1 rounded border border-border bg-surface text-text cursor-pointer"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <button
              onClick={() => setShowPitch(true)}
              className="text-xs text-teal font-medium hover:text-teal-dark cursor-pointer"
            >
              Ver Pitch
            </button>
          </div>
        )}
      </div>

      <InstituicaoModal
        open={showModal}
        onClose={() => setShowModal(false)}
        instituicao={instituicao}
      />

      <PitchModal
        open={showPitch}
        onClose={() => setShowPitch(false)}
        tipoInstituicao={instituicao.tipo}
      />
    </>
  )
}
