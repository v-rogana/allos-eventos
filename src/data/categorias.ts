import type { Categoria } from '../types'

interface CategoriaInfo {
  id: Categoria
  nome: string
  objetivo: string
  parceiros_alvo: string
  cor: string
}

export const CATEGORIAS: CategoriaInfo[] = [
  {
    id: 'promocional',
    nome: 'Evento Promocional',
    objetivo: 'Captar estagiários e alunos',
    parceiros_alvo: 'DAs, Ligas, Faculdades + Psis de fora/formados',
    cor: 'cat-promocional',
  },
  {
    id: 'comunitario',
    nome: 'Evento Comunitário',
    objetivo: 'Captar pacientes',
    parceiros_alvo: 'Atléticas',
    cor: 'cat-comunitario',
  },
  {
    id: 'corporativo',
    nome: 'Evento Corporativo',
    objetivo: 'Interno (integração, cultura, novas parcerias)',
    parceiros_alvo: 'Parceiros específicos (ex: Exyo)',
    cor: 'cat-corporativo',
  },
  {
    id: 'institucional',
    nome: 'Evento Institucional',
    objetivo: 'Captar parceiros',
    parceiros_alvo: 'Prefeituras e órgãos públicos',
    cor: 'cat-institucional',
  },
]
