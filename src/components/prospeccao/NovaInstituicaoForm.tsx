import { useState } from 'react'
import Modal from '../ui/Modal'
import Input from '../ui/Input'
import Select from '../ui/Select'
import Textarea from '../ui/Textarea'
import Button from '../ui/Button'
import type { Instituicao, TipoInstituicao, StatusProspeccao } from '../../types'

interface NovaInstituicaoFormProps {
  open: boolean
  onClose: () => void
  onSave: (inst: Omit<Instituicao, 'id' | 'data_criacao' | 'data_primeiro_contato' | 'data_ultimo_contato'>) => Promise<void>
}

const TIPOS_OPTIONS = [
  { value: 'faculdade', label: 'Faculdade' },
  { value: 'da', label: 'Diretório Acadêmico (DA)' },
  { value: 'liga', label: 'Liga Acadêmica' },
  { value: 'atletica', label: 'Atlética' },
  { value: 'outro', label: 'Outro' },
]

export default function NovaInstituicaoForm({ open, onClose, onSave }: NovaInstituicaoFormProps) {
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    nome: '',
    tipo: '' as TipoInstituicao | '',
    cidade: '',
    estado: '',
    contato_nome: '',
    contato_cargo: '',
    contato_telefone: '',
    contato_email: '',
    promoter_responsavel: '',
    notas: '',
  })

  const update = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.nome || !form.tipo) return

    setSaving(true)
    try {
      await onSave({
        nome: form.nome,
        tipo: form.tipo as TipoInstituicao,
        cidade: form.cidade,
        estado: form.estado,
        contato_nome: form.contato_nome,
        contato_cargo: form.contato_cargo,
        contato_telefone: form.contato_telefone,
        contato_email: form.contato_email,
        promoter_responsavel: form.promoter_responsavel,
        status: 'nao_contatada' as StatusProspeccao,
        notas: form.notas,
      })
      setForm({
        nome: '', tipo: '', cidade: '', estado: '',
        contato_nome: '', contato_cargo: '', contato_telefone: '', contato_email: '',
        promoter_responsavel: '', notas: '',
      })
      onClose()
    } catch {
      // handle error silently
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Nova Instituição" className="max-w-lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Nome da Instituição *"
          value={form.nome}
          onChange={(e) => update('nome', e.target.value)}
          placeholder="Ex: PUC Minas"
        />
        <Select
          label="Tipo *"
          options={TIPOS_OPTIONS}
          value={form.tipo}
          onChange={(e) => update('tipo', e.target.value)}
          placeholder="Selecione o tipo"
        />
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Cidade"
            value={form.cidade}
            onChange={(e) => update('cidade', e.target.value)}
          />
          <Input
            label="Estado"
            value={form.estado}
            onChange={(e) => update('estado', e.target.value)}
            placeholder="Ex: MG"
          />
        </div>

        <hr className="border-border" />
        <p className="text-sm font-medium text-text">Contato</p>

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Nome"
            value={form.contato_nome}
            onChange={(e) => update('contato_nome', e.target.value)}
          />
          <Input
            label="Cargo"
            value={form.contato_cargo}
            onChange={(e) => update('contato_cargo', e.target.value)}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Telefone"
            value={form.contato_telefone}
            onChange={(e) => update('contato_telefone', e.target.value)}
          />
          <Input
            label="Email"
            value={form.contato_email}
            onChange={(e) => update('contato_email', e.target.value)}
            type="email"
          />
        </div>

        <hr className="border-border" />

        <Input
          label="Promoter Responsável"
          value={form.promoter_responsavel}
          onChange={(e) => update('promoter_responsavel', e.target.value)}
        />
        <Textarea
          label="Notas"
          value={form.notas}
          onChange={(e) => update('notas', e.target.value)}
          placeholder="Observações adicionais..."
        />

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" disabled={!form.nome || !form.tipo || saving}>
            {saving ? 'Salvando...' : 'Criar Instituição'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
