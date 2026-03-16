import Modal from '../ui/Modal'
import Badge from '../ui/Badge'

interface CalendarioEvento {
  id: string
  nome: string
  data: string
  tipo: 'evento' | 'data_estrategica' | 'janela_prospeccao'
  categoria?: string
  cor: string
  detalhes?: string
}

interface DetalheDiaProps {
  open: boolean
  onClose: () => void
  dia: number
  mes: number
  ano: number
  eventos: CalendarioEvento[]
}

const TIPO_LABEL: Record<string, string> = {
  evento: 'Evento',
  data_estrategica: 'Data Estratégica',
  janela_prospeccao: 'Janela de Prospecção',
}

const TIPO_VARIANT: Record<string, 'teal' | 'amber' | 'rose'> = {
  evento: 'teal',
  data_estrategica: 'amber',
  janela_prospeccao: 'rose',
}

export default function DetalheDia({ open, onClose, dia, mes, ano, eventos }: DetalheDiaProps) {
  const dataFormatada = new Date(ano, mes - 1, dia).toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <Modal open={open} onClose={onClose} title={`${dia}/${mes}/${ano}`}>
      <p className="text-sm text-text-secondary mb-4 capitalize">{dataFormatada}</p>

      {eventos.length === 0 ? (
        <p className="text-sm text-text-secondary">Nenhum evento neste dia.</p>
      ) : (
        <div className="space-y-3">
          {eventos.map((ev, i) => (
            <div key={`${ev.id}-${i}`} className="p-3 rounded-lg border border-border bg-background">
              <div className="flex items-center gap-2 mb-1">
                <Badge variant={TIPO_VARIANT[ev.tipo] || 'gray'}>
                  {TIPO_LABEL[ev.tipo] || ev.tipo}
                </Badge>
                {ev.categoria && <Badge variant="gray">{ev.categoria}</Badge>}
              </div>
              <h4 className="text-sm font-semibold text-text">{ev.nome}</h4>
              {ev.detalhes && (
                <p className="text-xs text-text-secondary mt-1">{ev.detalhes}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </Modal>
  )
}
