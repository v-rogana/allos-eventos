export interface Pitch {
  id: string
  titulo: string
  contexto: string
  texto: string
  argumentos: string[]
}

export const PITCHS: Pitch[] = [
  {
    id: 'pitch_da_online',
    titulo: 'Pitch para DA / Ligas / Atléticas — Online',
    contexto:
      'Ao abordar um Diretório Acadêmico, o foco deve ser protagonismo discente e o desenvolvimento de carreira. O DA atua como o representante dos interesses imediatos dos alunos e busca parcerias que ofereçam vantagens reais no currículo e no bem-estar.',
    texto: `Olá, pessoal! Tudo bem?
Meu nome é [NOME], e falo em nome da Associação Allos. Somos uma organização dedicada a transformar a formação em Psicologia no Brasil, integrando a teoria acadêmica à prática real.
Sabemos que uma das maiores preocupações dos alunos hoje é a insegurança para o início das diversas práticas em psicologia e a falta de espaços para discussão prática. Por isso, queremos propor uma parceria para:
1. Implementar Grupos de Estudo Teóricos e Práticos dentro da faculdade
2. Oferecer suporte em saúde mental e grupos de escuta para os estudantes.
3. Gerar horas de extensão e complementares com certificação Allos.
4. Aproximar e fortalecer comunidade psi em nossos eventos ou realizando colaborações que trazem psi experientes para compartilhar ideias, até mesmo dando suporte aos eventos em que sonha realizar.
Teria disponibilidade para uma conversa rápida ou para que eu envie nosso modelo de parceria detalhado? Nosso objetivo é que o aluno saia da graduação pronto para o mercado.`,
    argumentos: [
      'Networking: Acesso direto a mentores da Allos e parceiras durante eventos permite que o aluno explore novas ideias e compartilhe as suas.',
      'Portfólio de Impacto: Participar de projetos sociais reais da Allos permite ao estudante construir um portfólio valorizado e desenvolver novas competências clínicas.',
      'Suporte à Saúde Mental: A parceria garante acesso a serviços psicológicos qualificados, abordando uma das maiores dores do corpo discente atual.',
      'Horas Complementares e de Extensão: Facilidade em registrar as atividades na Associação Allos como horas de extensão obrigatórias.',
    ],
  },
  {
    id: 'pitch_da_presencial',
    titulo: 'Pitch para DA / Ligas / Atléticas — Presencial',
    contexto:
      'Ao abordar presencialmente um DA, Liga ou Atlética, o foco deve ser apresentação rápida e objetiva, pedindo o contato para continuidade.',
    texto: `Oi, pessoal, tudo bem? Sou o(a) [NOME] e faço parte da Associação Allos.
A gente é uma ONG de Psicologia que foca em uma coisa que o aluno sente muita falta, que é a falta de segurança na prática da psicologia. Nosso método é a Prática Deliberada, para o pessoal aprender o manejo clínico de verdade antes de se formar.
Queríamos ver de fechar uma parceria com vocês em duas frentes. Trazer nossos grupos de estudo práticos, já realizamos em diversos outros espaços e vocês podem até ter a experiência antes de iniciar aqui. E dar suporte nos eventos de vocês, tipo Semana de Psicologia, trazendo palestrantes da Allos ou workshops de prática.
Posso pegar o contato de quem cuida disso no DA para a nossa coordenadora explicar como funciona?`,
    argumentos: [
      'Networking: Acesso direto a mentores da Allos e parceiras durante eventos.',
      'Portfólio de Impacto: Projetos sociais reais para construir portfólio.',
      'Suporte à Saúde Mental: Serviços psicológicos qualificados para o corpo discente.',
      'Horas Complementares e de Extensão: Atividades registráveis como horas de extensão.',
    ],
  },
  {
    id: 'pitch_secretaria_presencial',
    titulo: 'Pitch para Secretaria / Coordenação — Presencial',
    contexto:
      'Para a reitoria ou coordenação de curso, o pitch deve focar em conformidade regulatória, inovação acadêmica e visibilidade institucional. O gestor acadêmico está preocupado com notas de avaliação do MEC, taxa de evasão e produção científica.',
    texto: `Bom dia. Sou [NOME], da Associação Allos. Somos uma instituição focada em excelência clínica e formação complementar.
Estamos trabalhando com diversas faculdades como parceiros de vínculo de estágio, em que os alunos atuam em projetos estruturados de saúde mental e clínica escola. Além disso, nossa Coordenadora de Projetos gostaria de ampliar as relações com a faculdade, e para isso mostrar algumas propostas, como por exemplo eventos colaborativos. Teria um minuto para eu te passar o contato dela ou poderia me orientar a quem é possível iniciar uma comunicação para discutir o interesse?`,
    argumentos: [
      'Extensão Universitária: A Allos incentiva e fornece suporte para a criação de grupos conduzidos pelos alunos, registráveis como Atividades Extensionistas Curricularizadas.',
      'Formação via Prática Deliberada: Foco no desenvolvimento de habilidades específicas através de objetivos claros, repetição intencional e feedback constante.',
      'Suporte e Realização de Eventos: Eventos como pontes de conexão entre alunos, professores e profissionais, favorecendo visibilidade institucional e inserção no mercado.',
    ],
  },
]

export function getPitchParaTipo(tipo: string): Pitch[] {
  if (tipo === 'da' || tipo === 'liga' || tipo === 'atletica') {
    return PITCHS.filter((p) => p.id.startsWith('pitch_da'))
  }
  return PITCHS.filter((p) => p.id === 'pitch_secretaria_presencial')
}
