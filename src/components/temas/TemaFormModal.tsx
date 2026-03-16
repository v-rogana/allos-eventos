import { useState } from 'react'
import Modal from '../ui/Modal'
import Input from '../ui/Input'
import Textarea from '../ui/Textarea'
import Button from '../ui/Button'
import type { TemaCompleto, Palestrante } from '../../types'

interface TemaFormModalProps {
  open: boolean
  onClose: () => void
  tema?: TemaCompleto | null
  palestrantes: Palestrante[]
  onSave: (nome: string, descricao: string, tags: string[], palestranteIds: string[]) => Promise<void>
  onCreatePalestrante: (nome: string, bio: string, macroTemas: string[]) => Promise<Palestrante>
}

export default function TemaFormModal({ open, onClose, tema, palestrantes, onSave, onCreatePalestrante }: TemaFormModalProps) {
  const [nome, setNome] = useState(tema?.nome || '')
  const [descricao, setDescricao] = useState(tema?.descricao || '')
  const [tags, setTags] = useState<string[]>(tema?.tags || [])
  const [novaTag, setNovaTag] = useState('')
  const [selectedPalestrantes, setSelectedPalestrantes] = useState<string[]>(
    tema?.responsaveis.map((r) => r.id) || []
  )
  const [saving, setSaving] = useState(false)

  // New palestrante inline form
  const [showNewPal, setShowNewPal] = useState(false)
  const [newPalNome, setNewPalNome] = useState('')
  const [newPalBio, setNewPalBio] = useState('')
  const [savingPal, setSavingPal] = useState(false)

  const addTag = () => {
    const trimmed = novaTag.trim()
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed])
    }
    setNovaTag('')
  }

  const removeTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index))
  }

  const togglePalestrante = (id: string) => {
    setSelectedPalestrantes((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!nome.trim()) return
    setSaving(true)
    try {
      await onSave(nome.trim(), descricao.trim(), tags, selectedPalestrantes)
      onClose()
    } catch {
      // handle silently
    } finally {
      setSaving(false)
    }
  }

  const handleCreatePalestrante = async () => {
    if (!newPalNome.trim()) return
    setSavingPal(true)
    try {
      const pal = await onCreatePalestrante(newPalNome.trim(), newPalBio.trim(), [])
      setSelectedPalestrantes((prev) => [...prev, pal.id])
      setNewPalNome('')
      setNewPalBio('')
      setShowNewPal(false)
    } catch {
      // handle silently
    } finally {
      setSavingPal(false)
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={tema ? 'Editar Tema' : 'Novo Tema'} className="max-w-lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Nome do Tema *"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Ex: Psicologia Analítica — Jung"
        />

        <Textarea
          label="Descrição"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          placeholder="Descrição opcional do tema..."
        />

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-text mb-1.5">Tags</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {tags.map((tag, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-teal-light text-teal-dark text-sm font-medium"
              >
                {tag}
                <button type="button" onClick={() => removeTag(i)} className="hover:text-red-600 cursor-pointer">
                  &times;
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              className="flex-1 px-3 py-1.5 border border-border rounded-lg text-sm bg-surface text-text focus:outline-none focus:ring-2 focus:ring-teal"
              placeholder="Adicionar tag..."
              value={novaTag}
              onChange={(e) => setNovaTag(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag() } }}
            />
            <Button type="button" size="sm" onClick={addTag}>Adicionar</Button>
          </div>
        </div>

        {/* Palestrantes selection */}
        <div>
          <label className="block text-sm font-medium text-text mb-1.5">Palestrantes</label>
          {palestrantes.length > 0 && (
            <div className="space-y-1 mb-2 max-h-40 overflow-y-auto border border-border rounded-lg p-2">
              {palestrantes.map((p) => (
                <label key={p.id} className="flex items-center gap-2 text-sm cursor-pointer hover:bg-gray-50 rounded p-1">
                  <input
                    type="checkbox"
                    checked={selectedPalestrantes.includes(p.id)}
                    onChange={() => togglePalestrante(p.id)}
                    className="w-4 h-4 rounded border-gray-300 text-teal focus:ring-teal"
                  />
                  <span className="text-text">{p.nome}</span>
                  {p.bio && <span className="text-text-secondary text-xs truncate">— {p.bio}</span>}
                </label>
              ))}
            </div>
          )}

          {!showNewPal ? (
            <button
              type="button"
              onClick={() => setShowNewPal(true)}
              className="text-sm text-teal hover:text-teal-dark font-medium cursor-pointer"
            >
              + Novo Palestrante
            </button>
          ) : (
            <div className="bg-background rounded-lg p-3 border border-border space-y-2 mt-2">
              <Input
                label="Nome *"
                value={newPalNome}
                onChange={(e) => setNewPalNome(e.target.value)}
                placeholder="Nome do palestrante"
              />
              <Input
                label="Bio"
                value={newPalBio}
                onChange={(e) => setNewPalBio(e.target.value)}
                placeholder="Breve descrição"
              />
              <div className="flex gap-2">
                <Button type="button" size="sm" onClick={handleCreatePalestrante} disabled={!newPalNome.trim() || savingPal}>
                  {savingPal ? 'Salvando...' : 'Criar'}
                </Button>
                <Button type="button" size="sm" variant="ghost" onClick={() => setShowNewPal(false)}>
                  Cancelar
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="ghost" onClick={onClose}>Cancelar</Button>
          <Button type="submit" disabled={!nome.trim() || saving}>
            {saving ? 'Salvando...' : tema ? 'Salvar' : 'Criar Tema'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
