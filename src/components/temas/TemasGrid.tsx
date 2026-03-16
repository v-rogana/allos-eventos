import { useState, useMemo } from 'react'
import type { TemaCompleto } from '../../types'
import TemaCard from './TemaCard'
import Badge from '../ui/Badge'

interface TemasGridProps {
  temas: TemaCompleto[]
  onEdit?: (tema: TemaCompleto) => void
  onDelete?: (id: string) => void
}

export default function TemasGrid({ temas, onEdit, onDelete }: TemasGridProps) {
  const [busca, setBusca] = useState('')
  const [tagsFiltro, setTagsFiltro] = useState<string[]>([])

  const todasTags = useMemo(() => {
    const set = new Set<string>()
    temas.forEach((t) => t.tags.forEach((tag) => set.add(tag)))
    return Array.from(set).sort()
  }, [temas])

  const temasFiltrados = useMemo(() => {
    return temas.filter((tema) => {
      const buscaLower = busca.toLowerCase()
      const matchBusca =
        !busca ||
        tema.nome.toLowerCase().includes(buscaLower) ||
        tema.responsaveis.some((r) => r.nome.toLowerCase().includes(buscaLower)) ||
        tema.tags.some((t) => t.toLowerCase().includes(buscaLower))

      const matchTags =
        tagsFiltro.length === 0 || tagsFiltro.some((tag) => tema.tags.includes(tag))

      return matchBusca && matchTags
    })
  }, [temas, busca, tagsFiltro])

  const toggleTag = (tag: string) => {
    setTagsFiltro((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    )
  }

  return (
    <div>
      {/* Search */}
      <div className="relative mb-4">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-text-secondary"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
            clipRule="evenodd"
          />
        </svg>
        <input
          type="text"
          placeholder="Buscar por tema, palestrante ou tag..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-surface text-text placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-teal focus:border-teal transition-colors"
        />
      </div>

      {/* Tag filters */}
      {todasTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {todasTags.map((tag) => {
            const active = tagsFiltro.includes(tag)
            return (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`cursor-pointer transition-all ${active ? '' : 'opacity-60 hover:opacity-100'}`}
              >
                <Badge variant={active ? 'teal' : 'gray'}>{tag}</Badge>
              </button>
            )
          })}
        </div>
      )}

      {/* Grid */}
      {temasFiltrados.length === 0 ? (
        <p className="text-center text-text-secondary py-12">
          Nenhum tema encontrado para a busca atual.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {temasFiltrados.map((tema) => (
            <TemaCard
              key={tema.id}
              tema={tema}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  )
}
