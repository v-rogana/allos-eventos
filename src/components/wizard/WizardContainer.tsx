import { useState } from 'react'
import type { EventoBriefing } from '../../types'
import ProgressSteps from '../ui/ProgressSteps'
import StepCategoria from './StepCategoria'
import StepTipoEvento from './StepTipoEvento'
import StepBriefing from './StepBriefing'
import StepCronograma from './StepCronograma'
import StepOrcamento from './StepOrcamento'
import StepDivulgacao from './StepDivulgacao'
import StepChecklist from './StepChecklist'
import StepRevisao from './StepRevisao'

const STEP_LABELS = [
  'Categoria',
  'Tipo',
  'Briefing',
  'Cronograma',
  'Orcamento',
  'Divulgacao',
  'Checklist',
  'Revisao',
]

const initialBriefing: EventoBriefing = {
  categoria: '',
  tipo_evento_id: '',
  tipo_evento_nome: '',
  objetivo: '',
  tema_id: '',
  tema_custom: '',
  publico_alvo: '',
  conteudo: '',
  formato_modalidade: '',
  formato_periodo: '',
  formato_duracao_horas: 0,
  parceiros: '',
  recursos: [],
  metas_inscritos: 0,
  metas_presenca: 0,
  metas_conversoes: 0,
  metas_qualitativas: '',
  data_evento: '',
  cronograma: [],
  orcamento: {
    alimentacao: [],
    divulgacao: [],
    equipamento: [],
    deslocamento: [],
  },
  plano_divulgacao: [],
  checklist_pre: [],
  checklist_dia: [],
  checklist_pos: [],
  criado_por: '',
  pessoas: [],
  tags: [],
}

const steps = STEP_LABELS.map((label) => ({ label }))

function WizardContainer() {
  const [currentStep, setCurrentStep] = useState(0)
  const [data, setData] = useState<EventoBriefing>(initialBriefing)

  const updateData = (partial: Partial<EventoBriefing>) => {
    setData((prev) => ({ ...prev, ...partial }))
  }

  const next = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((s) => s + 1)
    }
  }

  const prev = () => {
    if (currentStep > 0) {
      setCurrentStep((s) => s - 1)
    }
  }

  const renderStep = () => {
    const props = { data, updateData }
    switch (currentStep) {
      case 0:
        return <StepCategoria {...props} />
      case 1:
        return <StepTipoEvento {...props} />
      case 2:
        return <StepBriefing {...props} />
      case 3:
        return <StepCronograma {...props} />
      case 4:
        return <StepOrcamento {...props} />
      case 5:
        return <StepDivulgacao {...props} />
      case 6:
        return <StepChecklist {...props} />
      case 7:
        return <StepRevisao {...props} />
      default:
        return null
    }
  }

  const isLastStep = currentStep === steps.length - 1

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <ProgressSteps steps={steps} currentStep={currentStep} className="mb-8" />

      <div className="min-h-[400px]">{renderStep()}</div>

      <div className="flex justify-between mt-8">
        {currentStep > 0 ? (
          <button
            type="button"
            onClick={prev}
            className="px-6 py-2.5 rounded-lg text-text-secondary hover:bg-gray-100 font-medium transition-colors"
          >
            Voltar
          </button>
        ) : (
          <div />
        )}

        {!isLastStep && (
          <button
            type="button"
            onClick={next}
            disabled={currentStep === 3 && !data.data_evento}
            className="px-6 py-2.5 rounded-lg bg-teal text-white font-medium hover:bg-teal-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Proximo
          </button>
        )}
      </div>
    </div>
  )
}

export default WizardContainer
