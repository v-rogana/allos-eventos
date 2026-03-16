import type { Tema, TemaCompleto, Palestrante } from '../types'

export const TEMAS_PRE_PRONTOS: Tema[] = [
  { id: "nise", nome: "Nise", responsaveis: ["Giulia Rani"] },
  { id: "pratica-deliberada", nome: "Praticando a Prática Deliberada / Problemas Clínicos", responsaveis: [] },
  { id: "jung", nome: "Jung", responsaveis: ["Alan Rogana", "Arthur Bernardes", "Flávia Moreira", "João Bragança"] },
  { id: "psicologia-social", nome: "Psicologia Social e Prática", responsaveis: ["Cindy Vitoriano"] },
  { id: "ia-psicologia", nome: "IA na Psicologia", responsaveis: ["Alan Rogana", "Arthur Bernardes", "Bernardo Costa"] },
  { id: "neuro", nome: "Neuro", responsaveis: ["Julia Goulart", "Victoria"] },
]

export const PALESTRANTES: Palestrante[] = [
  {
    id: 'giulia-rani',
    nome: 'Giulia Rani',
    macro_temas: ['Nise da Silveira', 'Arte e Psicologia', 'Saúde Mental'],
    bio: 'Especialista em abordagens artísticas na psicologia, com foco na obra e método de Nise da Silveira.',
    disponivel: true,
  },
  {
    id: 'alan-rogana',
    nome: 'Alan Rogana',
    macro_temas: ['Jung', 'IA na Psicologia', 'Psicologia Analítica'],
    bio: 'Pesquisador em psicologia analítica e aplicações de inteligência artificial na prática clínica.',
    disponivel: true,
  },
  {
    id: 'arthur-bernardes',
    nome: 'Arthur Bernardes',
    macro_temas: ['Jung', 'IA na Psicologia', 'Tecnologia e Saúde Mental'],
    bio: 'Atua na interseção entre tecnologia e psicologia, com pesquisa em IA aplicada à clínica.',
    disponivel: true,
  },
  {
    id: 'flavia-moreira',
    nome: 'Flávia Moreira',
    macro_temas: ['Jung', 'Psicologia Analítica', 'Simbolismo'],
    bio: 'Especialista em psicologia analítica junguiana e interpretação simbólica.',
    disponivel: true,
  },
  {
    id: 'joao-braganca',
    nome: 'João Bragança',
    macro_temas: ['Jung', 'Psicologia Analítica'],
    bio: 'Estudioso da psicologia analítica com foco em aplicações contemporâneas.',
    disponivel: true,
  },
  {
    id: 'cindy-vitoriano',
    nome: 'Cindy Vitoriano',
    macro_temas: ['Psicologia Social', 'Prática Comunitária', 'Políticas Públicas'],
    bio: 'Atua em psicologia social e prática comunitária, com foco em intervenções psicossociais.',
    disponivel: true,
  },
  {
    id: 'bernardo-costa',
    nome: 'Bernardo Costa',
    macro_temas: ['IA na Psicologia', 'Inovação', 'Tecnologia'],
    bio: 'Pesquisador em inovação tecnológica aplicada à saúde mental.',
    disponivel: true,
  },
  {
    id: 'julia-goulart',
    nome: 'Julia Goulart',
    macro_temas: ['Neuropsicologia', 'Avaliação Neuropsicológica', 'Cognição'],
    bio: 'Especialista em neuropsicologia e avaliação cognitiva.',
    disponivel: true,
  },
  {
    id: 'victoria',
    nome: 'Victoria',
    macro_temas: ['Neuropsicologia', 'Reabilitação Cognitiva'],
    bio: 'Atua em neuropsicologia com foco em reabilitação cognitiva.',
    disponivel: true,
  },
]

function getPalestrantesByNomes(nomes: string[]): Palestrante[] {
  return nomes
    .map((nome) => PALESTRANTES.find((p) => p.nome === nome))
    .filter((p): p is Palestrante => p !== undefined)
}

export const TEMAS_COMPLETOS: TemaCompleto[] = [
  {
    id: 'nise',
    nome: 'Nise da Silveira',
    descricao: 'Estudo da vida e obra de Nise da Silveira, pioneira no uso da arte como instrumento terapêutico. Aborda o Museu de Imagens do Inconsciente, a luta antimanicomial e a humanização do tratamento psiquiátrico no Brasil.',
    tags: ['Arte', 'Saúde Mental', 'História da Psicologia', 'Luta Antimanicomial'],
    responsaveis: getPalestrantesByNomes(['Giulia Rani']),
    eventos_realizados: 2,
  },
  {
    id: 'pratica-deliberada',
    nome: 'Praticando a Prática Deliberada / Problemas Clínicos',
    descricao: 'Treinamento focado no desenvolvimento de habilidades clínicas através de repetição intencional, objetivos claros e feedback constante. Aborda casos clínicos reais e simulações de atendimento.',
    tags: ['Clínica', 'Formação', 'Prática Deliberada', 'Competências'],
    responsaveis: [],
    eventos_realizados: 5,
  },
  {
    id: 'jung',
    nome: 'Psicologia Analítica — Jung',
    descricao: 'Exploração da teoria junguiana: arquétipos, inconsciente coletivo, individuação, tipologia psicológica e análise de sonhos. Aplicações práticas na clínica contemporânea.',
    tags: ['Jung', 'Psicologia Analítica', 'Arquétipos', 'Inconsciente'],
    responsaveis: getPalestrantesByNomes(['Alan Rogana', 'Arthur Bernardes', 'Flávia Moreira', 'João Bragança']),
    eventos_realizados: 3,
  },
  {
    id: 'psicologia-social',
    nome: 'Psicologia Social e Prática',
    descricao: 'Discussão sobre intervenções psicossociais, psicologia comunitária, políticas públicas de saúde mental e o papel do psicólogo em contextos de vulnerabilidade social.',
    tags: ['Social', 'Comunitária', 'Políticas Públicas', 'Vulnerabilidade'],
    responsaveis: getPalestrantesByNomes(['Cindy Vitoriano']),
    eventos_realizados: 1,
  },
  {
    id: 'ia-psicologia',
    nome: 'IA na Psicologia',
    descricao: 'Análise do impacto da inteligência artificial na prática clínica: ferramentas de apoio diagnóstico, chatbots terapêuticos, ética e limites da IA na saúde mental.',
    tags: ['IA', 'Tecnologia', 'Inovação', 'Ética'],
    responsaveis: getPalestrantesByNomes(['Alan Rogana', 'Arthur Bernardes', 'Bernardo Costa']),
    eventos_realizados: 2,
  },
  {
    id: 'neuro',
    nome: 'Neuropsicologia',
    descricao: 'Fundamentos da neuropsicologia: avaliação neuropsicológica, reabilitação cognitiva, transtornos do neurodesenvolvimento e interfaces entre cérebro e comportamento.',
    tags: ['Neuropsicologia', 'Cognição', 'Avaliação', 'Reabilitação'],
    responsaveis: getPalestrantesByNomes(['Julia Goulart', 'Victoria']),
    eventos_realizados: 1,
  },
]
