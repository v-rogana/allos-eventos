import { useState, useEffect } from 'react'
import Modal from '../ui/Modal'
import Badge from '../ui/Badge'
import Button from '../ui/Button'
import Input from '../ui/Input'
import Select from '../ui/Select'
import Textarea from '../ui/Textarea'
import PitchModal from './PitchModal'
import { useInteracoes } from '../../hooks/useInteracoes'
import type { Instituicao, TipoInteracao } from '../../types'

interface InstituicaoModalProps {
  open: boolean
  onClose: () => void
  instituicao: Instituicao
}

const TIPO_INTERACAO_OPTIONS = [
  { value: 'presencial', label: 'Presencial' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'email', label: 'Email' },
  { value: 'telefone', label: 'Telefone' },
  { value: 'reuniao', label: 'Reunião' },
]

const TIPO_LABELS: Record<string, string> = {
  faculdade: 'Faculdade',
  da: 'DA',
  liga: 'Liga',
  atletica: 'Atlética',
  outro: 'Outro',
}

function formatDate(d: string | null): string {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('pt-BR')
}

export default function InstituicaoModal({ open, onClose, instituicao }: InstituicaoModalProps) {
  const { interacoes, loading, fetchInteracoes, createInteracao } = useInteracoes(instituicao.id)
  const [showPitch, setShowPitch] = useState(false)
  const [showNovaInteracao, setShowNovaInteracao] = useState(false)
  const [novaInteracao, setNovaInteracao] = useState({
    tipo: 'whatsapp' as TipoInteracao,
    descricao: '',
    responsavel: '',
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (open) fetchInteracoes()
  }, [open, fetchInteracoes])

  const handleAddInteracao = async () => {
    if (!novaInteracao.descricao) return
    setSaving(true)
    try {
      await createInteracao({
        instituicao_id: instituicao.id,
        data: new Date().toISOString(),
        tipo: novaInteracao.tipo,
        descricao: novaInteracao.descricao,
        responsavel: novaInteracao.responsavel,
      })
      setNovaInteracao({ tipo: 'whatsapp', descricao: '', responsavel: '' })
      setShowNovaInteracao(false)
    } catch {
      // handle silently
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <Modal open={open} onClose={onClose} title={instituicao.nome} className="max-w-2xl">
        <div className="space-y-4">
          {/* Info */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-text-secondary">Tipo:</span>{' '}
              <Badge variant="teal">{TIPO_LABELS[instituicao.tipo] || instituicao.tipo}</Badge>
            </div>
            <div>
              <span className="text-text-secondary">Local:</span>{' '}
              <span className="text-text">{instituicao.cidade}{instituicao.estado ? `, ${instituicao.estado}` : ''}</span>
            </div>
            <div>
              <span className="text-text-secondary">Promoter:</span>{' '}
              <span className="text-text">{instituicao.promoter_responsavel || '—'}</span>
            </div>
            <div>
              <span className="text-text-secondary">Criado em:</span>{' '}
              <span className="text-text">{formatDate(instituicao.data_criacao)}</span>
            </div>
            <div>
              <span className="text-text-secondary">Primeiro contato:</span>{' '}
              <span className="text-text">{formatDate(instituicao.data_primeiro_contato)}</span>
            </div>
            <div>
              <span className="text-text-secondary">Último contato:</span>{' '}
              <span className="text-text">{formatDate(instituicao.data_ultimo_contato)}</span>
            </div>
          </div>

          {/* Contato */}
          {(instituicao.contato_nome || instituicao.contato_email || instituicao.contato_telefone) && (
            <div className="bg-background rounded-lg p-3 border border-border">
              <h4 className="text-sm font-semibold text-text mb-1">Contato</h4>
              <div className="text-sm text-text-secondary space-y-0.5">
                {instituicao.contato_nome && <p>{instituicao.contato_nome}{instituicao.contato_cargo ? ` — ${instituicao.contato_cargo}` : ''}</p>}
                {instituicao.contato_telefone && <p>Tel: {instituicao.contato_telefone}</p>}
                {instituicao.contato_email && <p>Email: {instituicao.contato_email}</p>}
              </div>
            </div>
          )}

          {instituicao.notas && (
            <div className="text-sm">
              <span className="font-semibold text-text">Notas:</span>
              <p className="text-text-secondary mt-0.5">{instituicao.notas}</p>
            </div>
          )}

          <div className="flex gap-2">
            <Button size="sm" variant="secondary" onClick={() => setShowPitch(true)}>
              Ver Pitch
            </Button>
            <Button size="sm" onClick={() => setShowNovaInteracao(!showNovaInteracao)}>
              + Interação
            </Button>
          </div>

          {/* Nova Interação form */}
          {showNovaInteracao && (
            <div className="bg-background rounded-lg p-4 border border-border space-y-3">
              <Select
                label="Tipo"
                options={TIPO_INTERACAO_OPTIONS}
                value={novaInteracao.tipo}
                onChange={(e) => setNovaInteracao((p) => ({ ...p, tipo: e.target.value as TipoInteracao }))}
              />
              <Input
                label="Responsável"
                value={novaInteracao.responsavel}
                onChange={(e) => setNovaInteracao((p) => ({ ...p, responsavel: e.target.value }))}
              />
              <Textarea
                label="Descrição *"
                value={novaInteracao.descricao}
                onChange={(e) => setNovaInteracao((p) => ({ ...p, descricao: e.target.value }))}
                placeholder="O que foi discutido/acordado..."
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={handleAddInteracao} disabled={!novaInteracao.descricao || saving}>
                  {saving ? 'Salvando...' : 'Salvar'}
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setShowNovaInteracao(false)}>
                  Cancelar
                </Button>
              </div>
            </div>
          )}

          {/* Timeline */}
          <div>
            <h4 className="text-sm font-semibold text-text mb-2">Histórico de interações</h4>
            {loading ? (
              <p className="text-sm text-text-secondary">Carregando...</p>
            ) : interacoes.length === 0 ? (
              <p className="text-sm text-text-secondary">Nenhuma interação registrada.</p>
            ) : (
              <div className="space-y-3">
                {interacoes.map((int) => (
                  <div key={int.id} className="flex gap-3 text-sm">
                    <div className="flex flex-col items-center">
                      <div className="w-2 h-2 rounded-full bg-teal mt-1.5" />
                      <div className="w-0.5 flex-1 bg-border" />
                    </div>
                    <div className="pb-3">
                      <div className="flex items-center gap-2">
                        <Badge variant="gray">{int.tipo}</Badge>
                        <span className="text-text-secondary text-xs">{formatDate(int.data)}</span>
                        {int.responsavel && (
                          <span className="text-text-secondary text-xs">— {int.responsavel}</span>
                        )}
                      </div>
                      <p className="text-text mt-0.5">{int.descricao}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </Modal>

      <PitchModal
        open={showPitch}
        onClose={() => setShowPitch(false)}
        tipoInstituicao={instituicao.tipo}
      />
    </>
  )
}
