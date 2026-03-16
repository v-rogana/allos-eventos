import PageContainer from '../components/layout/PageContainer'
import CalendarioView from '../components/calendario/CalendarioView'

export default function Calendario() {
  return (
    <PageContainer
      title="Calendário Estratégico"
      subtitle="Visualize eventos, campanhas e janelas de prospecção"
    >
      <CalendarioView />
    </PageContainer>
  )
}
