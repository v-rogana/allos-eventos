import type { DivulgacaoItem } from '../types'

export const DIVULGACAO_DEFAULT: DivulgacaoItem[] = [
  { descricao: "Criar folders (cartaz e/ou panfletos)", dias_antes: 30, continuo: false, feito: false },
  { descricao: "Iniciar exposição dos materiais físicos", dias_antes: 30, continuo: false, feito: false },
  { descricao: "Criar divulgação nos grupos e Instagram", dias_antes: 30, continuo: false, feito: false },
  { descricao: "Criar grupo no WhatsApp para aquecer e tirar dúvidas", dias_antes: 30, continuo: false, feito: false },
  { descricao: "Conteúdo no IG da Formação e YouTube (combinar com Victor)", dias_antes: 14, continuo: false, feito: false },
  { descricao: "Micro conteúdo para o grupo WhatsApp", dias_antes: 14, continuo: false, feito: false },
  { descricao: "Evento online no Meet ou YouTube (se aplicável)", dias_antes: 7, continuo: false, feito: false },
  { descricao: "Mensagem lembrando + dúvidas comuns", dias_antes: 3, continuo: false, feito: false },
  { descricao: "Mensagem de aquecimento", dias_antes: 2, continuo: false, feito: false },
  { descricao: "Sorteios (se aplicável)", dias_antes: null, continuo: true, feito: false },
  { descricao: "Brinde por lote ou por convidar amigo (se aplicável)", dias_antes: null, continuo: true, feito: false },
]
