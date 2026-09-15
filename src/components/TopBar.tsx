import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'

interface TopBarProps {
  name: string
  nav?: ReactNode
}

export function TopBar({ name, nav }: TopBarProps) {
  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-900/90">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <div className="flex items-center gap-4">
          <Link to="/" className="text-sm font-medium text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100">
            ← Back to ideas
          </Link>
          <span className="text-lg font-semibold text-slate-900 dark:text-white">{name}</span>
        </div>
        {nav ? <nav className="flex flex-wrap items-center gap-1 text-sm">{nav}</nav> : null}
      </div>
    </header>
  )
}
