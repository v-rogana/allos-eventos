export interface CronogramaItem {
  nome: string
  duracao_min: number
  horario?: string
}

export interface OrcamentoItem {
  nome: string
  quantidade: number
  valor_unitario: number
}

export interface DivulgacaoItem {
  descricao: string
  dias_antes: number | null
  continuo: boolean
  feito: boolean
}

export interface ChecklistItem {
  texto: string
  feito: boolean
}

export type Categoria = 'promocional' | 'comunitario' | 'corporativo' | 'institucional'

export type Modalidade = 'presencial' | 'online' | 'hibrido'

export type Periodo = 'manha' | 'tarde' | 'noite' | 'dia_inteiro'

export interface TipoEventoTemplate {
  objetivo_sugestao: string
  formato_modalidade: Modalidade
  formato_periodo: Periodo
  formato_duracao_horas: number
  recursos_sugeridos: string[]
  cronograma_padrao: CronogramaItem[]
}

export interface TipoEvento {
  id: string
  nome: string
  template: TipoEventoTemplate
}

export interface EventoBriefing {
  // Step 1
  categoria: Categoria | ''
  // Step 2
  tipo_evento_id: string
  tipo_evento_nome: string
  // Step 3 - Briefing
  objetivo: string
  tema_id: string
  tema_custom: string
  publico_alvo: string
  conteudo: string
  formato_modalidade: Modalidade | ''
  formato_periodo: Periodo | ''
  formato_duracao_horas: number
  parceiros: string
  recursos: string[]
  metas_inscritos: number
  metas_presenca: number
  metas_conversoes: number
  metas_qualitativas: string
  // Step 4 - Cronograma
  data_evento: string
  cronograma: CronogramaItem[]
  // Step 5 - Orcamento
  orcamento: {
    alimentacao: OrcamentoItem[]
    divulgacao: OrcamentoItem[]
    equipamento: OrcamentoItem[]
    deslocamento: OrcamentoItem[]
  }
  // Step 6 - Divulgacao
  plano_divulgacao: DivulgacaoItem[]
  // Step 7 - Checklist
  checklist_pre: ChecklistItem[]
  checklist_dia: ChecklistItem[]
  checklist_pos: ChecklistItem[]
  // Meta
  criado_por: string
  // Pessoas e Tags
  pessoas: string[]
  tags: string[]
}

export interface Tema {
  id: string
  nome: string
  responsaveis: string[]
}

// === Módulo 2 — Prospecção ===

export type StatusProspeccao = 'nao_contatada' | 'primeiro_contato' | 'reuniao_agendada' | 'reuniao_realizada' | 'parceria_formalizada' | 'inativa'

export type TipoInstituicao = 'faculdade' | 'da' | 'liga' | 'atletica' | 'outro'

export type TipoInteracao = 'presencial' | 'whatsapp' | 'email' | 'telefone' | 'reuniao'

export interface Instituicao {
  id: string
  nome: string
  tipo: TipoInstituicao
  cidade: string
  estado: string
  contato_nome: string
  contato_cargo: string
  contato_telefone: string
  contato_email: string
  status: StatusProspeccao
  promoter_responsavel: string
  data_criacao: string
  data_primeiro_contato: string | null
  data_ultimo_contato: string | null
  notas: string
}

export interface Interacao {
  id: string
  instituicao_id: string
  data: string
  tipo: TipoInteracao
  descricao: string
  responsavel: string
}

// === Módulo 3 — Temas e Palestrantes ===

export interface Palestrante {
  id: string
  nome: string
  macro_temas: string[]
  bio?: string
  disponivel: boolean
}

export interface TemaCompleto {
  id: string
  nome: string
  descricao?: string
  tags: string[]
  responsaveis: Palestrante[]
  eventos_realizados?: number
}

// === Módulo 4 — Calendário ===

export type TipoDataEstrategica = 'campanha_nacional' | 'processo_seletivo' | 'semana_psicologia' | 'data_interna' | 'outro'

export interface DataEstrategica {
  id: string
  nome: string
  tipo: TipoDataEstrategica
  data_inicio: string
  data_fim?: string
  recorrente: boolean
  notas?: string
}
