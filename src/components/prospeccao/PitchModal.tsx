import { useState } from 'react'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import { getPitchParaTipo } from '../../data/pitchs'
import type { Pitch } from '../../data/pitchs'

interface PitchModalProps {
  open: boolean
  onClose: () => void
  tipoInstituicao: string
}

export default function PitchModal({ open, onClose, tipoInstituicao }: PitchModalProps) {
  const pitchs = getPitchParaTipo(tipoInstituicao)
  const [activePitch, setActivePitch] = useState<Pitch | null>(pitchs[0] || null)
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    if (!activePitch) return
    try {
      await navigator.clipboard.writeText(activePitch.texto)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Pitch de Abordagem" className="max-w-2xl">
      {pitchs.length > 1 && (
        <div className="flex gap-2 mb-4">
          {pitchs.map((p) => (
            <button
              key={p.id}
              onClick={() => setActivePitch(p)}
              className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-colors cursor-pointer ${
                activePitch?.id === p.id
                  ? 'bg-teal text-white'
                  : 'bg-gray-100 text-text-secondary hover:bg-gray-200'
              }`}
            >
              {p.titulo.includes('Online') ? 'Online' : 'Presencial'}
            </button>
          ))}
        </div>
      )}

      {activePitch && (
        <>
          <h3 className="font-semibold text-text mb-2">{activePitch.titulo}</h3>
          <p className="text-sm text-text-secondary mb-4">{activePitch.contexto}</p>

          <div className="bg-background rounded-lg p-4 border border-border mb-4">
            <p className="text-sm text-text whitespace-pre-line">{activePitch.texto}</p>
          </div>

          <Button onClick={handleCopy} variant="secondary" size="sm">
            {copied ? 'Copiado!' : 'Copiar texto'}
          </Button>

          <div className="mt-4">
            <h4 className="text-sm font-semibold text-text mb-2">Argumentos centrais</h4>
            <ul className="space-y-1.5">
              {activePitch.argumentos.map((arg, i) => (
                <li key={i} className="text-sm text-text-secondary flex gap-2">
                  <span className="text-teal font-bold flex-shrink-0">{i + 1}.</span>
                  {arg}
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </Modal>
  )
}
