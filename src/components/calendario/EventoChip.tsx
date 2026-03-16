interface EventoChipProps {
  nome: string
  cor: string
  onClick: () => void
}

export default function EventoChip({ nome, cor, onClick }: EventoChipProps) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
      className={`w-full text-left px-1.5 py-0.5 rounded text-[10px] sm:text-xs font-medium truncate ${cor} hover:opacity-80 transition-opacity cursor-pointer`}
      title={nome}
    >
      {nome}
    </button>
  )
}
