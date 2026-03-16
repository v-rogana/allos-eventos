export default function Header({ onMenuClick }: { onMenuClick: () => void }) {
  return (
    <header className="sticky top-0 z-30 bg-surface border-b border-border px-4 py-3 flex items-center gap-3 lg:hidden">
      <button
        onClick={onMenuClick}
        className="p-2 -ml-2 rounded-lg hover:bg-gray-100"
        aria-label="Menu"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
      </button>
      <h1 className="text-lg font-bold text-teal-dark tracking-tight">Allos Eventos</h1>
    </header>
  )
}
