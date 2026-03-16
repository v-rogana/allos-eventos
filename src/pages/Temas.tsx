import { useState } from 'react'
import PageContainer from '../components/layout/PageContainer'
import TemasGrid from '../components/temas/TemasGrid'
import TemaFormModal from '../components/temas/TemaFormModal'
import Button from '../components/ui/Button'
import { useTemas } from '../hooks/useTemas'
import type { TemaCompleto } from '../types'

export default function Temas() {
  const { temas, palestrantes, loading, usingSupabase, createTema, updateTema, deleteTema, createPalestrante } = useTemas()
  const [showForm, setShowForm] = useState(false)
  const [editingTema, setEditingTema] = useState<TemaCompleto | null>(null)

  const handleEdit = (tema: TemaCompleto) => {
    setEditingTema(tema)
    setShowForm(true)
  }

  const handleClose = () => {
    setShowForm(false)
    setEditingTema(null)
  }

  const handleSave = async (nome: string, descricao: string, tags: string[], palestranteIds: string[]) => {
    if (editingTema) {
      await updateTema(editingTema.id, nome, descricao, tags, palestranteIds)
    } else {
      await createTema(nome, descricao, tags, palestranteIds)
    }
  }

  return (
    <PageContainer
      title="Banco de Temas e Palestrantes"
      subtitle="Explore, crie e edite temas para eventos"
      action={
        usingSupabase ? (
          <Button size="sm" onClick={() => { setEditingTema(null); setShowForm(true) }}>
            + Novo Tema
          </Button>
        ) : undefined
      }
    >
      {loading ? (
        <div className="text-center py-12 text-text-secondary">Carregando...</div>
      ) : (
        <TemasGrid
          temas={temas}
          onEdit={usingSupabase ? handleEdit : undefined}
          onDelete={usingSupabase ? deleteTema : undefined}
        />
      )}

      {!usingSupabase && !loading && (
        <p className="text-center text-text-secondary text-sm mt-6">
          Dados estáticos. Para criar e editar temas, crie as tabelas <code>temas</code>, <code>palestrantes</code> e <code>tema_palestrante</code> no Supabase.
        </p>
      )}

      {showForm && (
        <TemaFormModal
          open={showForm}
          onClose={handleClose}
          tema={editingTema}
          palestrantes={palestrantes}
          onSave={handleSave}
          onCreatePalestrante={createPalestrante}
        />
      )}
    </PageContainer>
  )
}
