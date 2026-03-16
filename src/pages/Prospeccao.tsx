import { useState } from 'react'
import PageContainer from '../components/layout/PageContainer'
import KanbanBoard from '../components/prospeccao/KanbanBoard'
import NovaInstituicaoForm from '../components/prospeccao/NovaInstituicaoForm'
import Button from '../components/ui/Button'
import ErrorAlert from '../components/ui/ErrorAlert'
import { useInstituicoes } from '../hooks/useInstituicoes'

export default function Prospeccao() {
  const { instituicoes, loading, error, fetchInstituicoes, createInstituicao, updateStatus } = useInstituicoes()
  const [showForm, setShowForm] = useState(false)

  return (
    <PageContainer
      title="Painel de Prospecção"
      subtitle="Gerencie o relacionamento com instituições parceiras"
      action={
        <Button size="sm" onClick={() => setShowForm(true)}>
          + Nova Instituição
        </Button>
      }
    >
      {error ? (
        <ErrorAlert message={`Erro ao carregar instituições: ${error}`} onRetry={fetchInstituicoes} />
      ) : (
        <KanbanBoard
          instituicoes={instituicoes}
          onStatusChange={updateStatus}
          loading={loading}
        />
      )}

      <NovaInstituicaoForm
        open={showForm}
        onClose={() => setShowForm(false)}
        onSave={async (inst) => {
          await createInstituicao(inst)
        }}
      />
    </PageContainer>
  )
}
