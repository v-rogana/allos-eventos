import PageContainer from '../components/layout/PageContainer'
import WizardContainer from '../components/wizard/WizardContainer'

export default function NovoEvento() {
  return (
    <PageContainer
      title="Novo Evento"
      subtitle="Crie um briefing completo passo a passo"
    >
      <WizardContainer />
    </PageContainer>
  )
}
