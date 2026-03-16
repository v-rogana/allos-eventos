import { useState } from 'react'
import { Link } from 'react-router-dom'
import PageContainer from '../components/layout/PageContainer'
import Badge from '../components/ui/Badge'
import ErrorAlert from '../components/ui/ErrorAlert'
import EventoModal from '../components/eventos/EventoModal'
import { useEventos } from '../hooks/useEventos'

const STATUS_LABELS: Record<string, string> = {
  rascunho: 'Rascunho',
  planejamento: 'Planejamento',
  divulgacao: 'Divulgação',
  execucao: 'Execução',
  pos_evento: 'Pós-evento',
  concluido: 'Concluído',
  cancelado: 'Cancelado',
}

const CATEGORIA_LABELS: Record<string, string> = {
  promocional: 'Promocional',
  comunitario: 'Comunitário',
  corporativo: 'Corporativo',
  institucional: 'Institucional',
}

export default function Eventos() {
  const { eventos, loading, error, fetchEventos } = useEventos()
  const [selectedEventoId, setSelectedEventoId] = useState<string | null>(null)

  return (
    <PageContainer
      title="Eventos"
      subtitle="Briefings criados"
      action={
        <Link
          to="/novo-evento"
          className="inline-flex items-center gap-2 px-4 py-2 bg-teal text-white rounded-lg text-sm font-medium hover:bg-teal-dark transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Novo
        </Link>
      }
    >
      {error ? (
        <ErrorAlert message={`Erro ao carregar eventos: ${error}`} onRetry={fetchEventos} />
      ) : loading ? (
        <div className="text-center py-12 text-text-secondary">Carregando...</div>
      ) : eventos.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-text-secondary mb-4">Nenhum evento criado ainda.</p>
          <Link
            to="/novo-evento"
            className="inline-flex items-center gap-2 px-6 py-3 bg-terracotta text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            Criar primeiro evento
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {eventos.map((evento) => (
            <div
              key={evento.id}
              onClick={() => setSelectedEventoId(evento.id)}
              className="bg-surface border border-border rounded-xl p-4 hover:border-teal/50 transition-colors cursor-pointer"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <Badge variant="teal">
                      {CATEGORIA_LABELS[evento.categoria] || evento.categoria}
                    </Badge>
                    <Badge variant="gray">
                      {STATUS_LABELS[evento.status] || evento.status}
                    </Badge>
                    {evento.tags && evento.tags.map((tag, i) => (
                      <Badge key={i} variant="blue">{tag}</Badge>
                    ))}
                  </div>
                  <h3 className="font-semibold truncate">{evento.tipo}</h3>
                  {evento.objetivo && (
                    <p className="text-sm text-text-secondary mt-1 line-clamp-2">{evento.objetivo}</p>
                  )}
                  {evento.pessoas && evento.pessoas.length > 0 && (
                    <p className="text-xs text-text-secondary mt-1">
                      {evento.pessoas.join(', ')}
                    </p>
                  )}
                </div>
                {evento.data_evento && (
                  <span className="text-sm text-text-secondary whitespace-nowrap">
                    {new Date(evento.data_evento + 'T00:00:00').toLocaleDateString('pt-BR')}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedEventoId && (
        <EventoModal
          open={!!selectedEventoId}
          onClose={() => {
            setSelectedEventoId(null)
            fetchEventos()
          }}
          eventoId={selectedEventoId}
        />
      )}
    </PageContainer>
  )
}
