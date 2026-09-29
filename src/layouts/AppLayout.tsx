import { useEffect, useState } from 'react'
import { Icon } from '../components/ui/Icon'
import { navItems } from '../routes/routes'

type Theme = 'light' | 'dark'

export function AppLayout({ currentPath, onNavigate, children }: { currentPath: string; onNavigate: (path: string) => void; children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem('lendit-theme') as Theme) || 'light')
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('lendit-theme', theme)
  }, [theme])

  const isActive = (path: string) => currentPath === path || (path !== '/' && currentPath.startsWith(path))

  function navigate(path: string) {
    onNavigate(path)
    setMobileOpen(false)
  }

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileOpen ? 'sidebar-open' : ''}`}>
        <div className="brand" onClick={() => navigate('/dashboard')} role="button" tabIndex={0} onKeyDown={(event) => event.key === 'Enter' && navigate('/dashboard')}>
          <div className="brand-mark">L</div>
          <div><strong>LendIt</strong><span>Lending Management</span></div>
        </div>
        <nav className="nav" aria-label="Primary navigation">
          {navItems.map((item) => <button key={item.path} className={`nav-item ${isActive(item.path) ? 'nav-item-active' : ''}`} onClick={() => navigate(item.path)}><Icon name={item.icon} /><span>{item.label}</span></button>)}
        </nav>
        <div className="sidebar-footer"><div className="user-chip"><div className="avatar">MM</div><div><strong>Manoj</strong><span>Administrator</span></div></div></div>
      </aside>

      <div className="main-shell">
        <header className="topbar">
          <button className="icon-button mobile-menu" aria-label="Open menu" onClick={() => setMobileOpen((value) => !value)}><Icon name="menu" /></button>
          <div className="topbar-title">LMS Command Center</div>
          <div className="topbar-actions"><button className="icon-button" aria-label="Toggle theme" onClick={() => setTheme((value) => value === 'light' ? 'dark' : 'light')}><Icon name={theme === 'light' ? 'moon' : 'sun'} /></button></div>
        </header>
        <main className="content">{children}</main>
      </div>
    </div>
  )
}
