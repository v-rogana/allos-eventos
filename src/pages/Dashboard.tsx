import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import PageContainer from '../components/layout/PageContainer'
import { supabase } from '../lib/supabase'

export default function Dashboard() {
  const [stats, setStats] = useState({ total: 0, planejamento: 0, instituicoes: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        const [eventosRes, planejamentoRes, instRes] = await Promise.all([
          supabase.from('eventos').select('id', { count: 'exact', head: true }),
          supabase.from('eventos').select('id', { count: 'exact', head: true }).eq('status', 'planejamento'),
          supabase.from('instituicoes').select('id', { count: 'exact', head: true }),
        ])
        setStats({
          total: eventosRes.count ?? 0,
          planejamento: planejamentoRes.count ?? 0,
          instituicoes: instRes.count ?? 0,
        })
      } catch {
        // keep defaults
      }
      setLoading(false)
    }
    fetchStats()
  }, [])

  return (
    <PageContainer
      title="Dashboard"
      subtitle="Visão geral do Allos Eventos & Parcerias"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <StatCard label="Eventos Criados" value={loading ? '...' : String(stats.total)} />
        <StatCard label="Em Planejamento" value={loading ? '...' : String(stats.planejamento)} />
        <StatCard label="Instituições Prospectadas" value={loading ? '...' : String(stats.instituicoes)} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          to="/novo-evento"
          className="bg-surface border border-border rounded-xl p-6 hover:border-teal hover:shadow-md transition-all group"
        >
          <div className="w-12 h-12 rounded-lg bg-teal-light flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold group-hover:text-teal-dark transition-colors">
            Novo Evento
          </h3>
          <p className="text-text-secondary text-sm mt-1">
            Crie um briefing completo com o wizard guiado
          </p>
        </Link>

        <Link
          to="/eventos"
          className="bg-surface border border-border rounded-xl p-6 hover:border-teal hover:shadow-md transition-all group"
        >
          <div className="w-12 h-12 rounded-lg bg-teal-light flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold group-hover:text-teal-dark transition-colors">
            Meus Eventos
          </h3>
          <p className="text-text-secondary text-sm mt-1">
            Visualize e gerencie eventos criados
          </p>
        </Link>
      </div>
    </PageContainer>
  )
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-surface border border-border rounded-xl p-5">
      <p className="text-text-secondary text-sm">{label}</p>
      <p className="text-3xl font-bold text-teal-dark mt-1 font-heading">{value}</p>
    </div>
  )
}
