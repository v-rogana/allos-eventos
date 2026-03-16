import type { Palestrante } from '../../types'
import Badge from '../ui/Badge'

interface PalestranteCardProps {
  palestrante: Palestrante
}

export default function PalestranteCard({ palestrante }: PalestranteCardProps) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg border border-border bg-background">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-teal-light flex items-center justify-center">
        <span className="text-sm font-semibold text-teal-dark">
          {palestrante.nome.charAt(0)}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-text truncate">{palestrante.nome}</span>
          <span
            className={`inline-block w-2 h-2 rounded-full flex-shrink-0 ${
              palestrante.disponivel ? 'bg-green-500' : 'bg-gray-300'
            }`}
            title={palestrante.disponivel ? 'Disponível' : 'Indisponível'}
          />
        </div>
        {palestrante.bio && (
          <p className="text-xs text-text-secondary mt-0.5 line-clamp-2">{palestrante.bio}</p>
        )}
        <div className="flex flex-wrap gap-1 mt-1.5">
          {palestrante.macro_temas.map((tema) => (
            <Badge key={tema} variant="gray">
              {tema}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  )
}
