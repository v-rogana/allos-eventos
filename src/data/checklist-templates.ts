import type { ChecklistItem } from '../types'

export const CHECKLIST_PRE_DEFAULT: ChecklistItem[] = [
  { texto: "Conferir se o local está organizado e acessível", feito: false },
  { texto: "Impressão dos crachás para credenciamento", feito: false },
  { texto: "Coffee break posicionado", feito: false },
  { texto: "Câmera posicionada", feito: false },
  { texto: "Confirmação dos monitores (3 dias antes)", feito: false },
]

export const CHECKLIST_DIA_DEFAULT: ChecklistItem[] = [
  { texto: "Credenciamento na entrada", feito: false },
  { texto: "Monitores disponíveis", feito: false },
  { texto: "Organizadores anunciam breaks e chamada para happy hour", feito: false },
]

export const CHECKLIST_POS_DEFAULT: ChecklistItem[] = [
  { texto: "Envio de certificados", feito: false },
  { texto: "Guardar contatos para próximos eventos", feito: false },
  { texto: "Convidar para comunidade e conteúdos online", feito: false },
  { texto: "Conversão dos eventos para conteúdo das plataformas digitais", feito: false },
  { texto: "Análise da taxa de quebra (inscritos vs presentes)", feito: false },
  { texto: "Análise de conversão no objetivo principal", feito: false },
]
