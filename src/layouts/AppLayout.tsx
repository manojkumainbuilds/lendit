import { useEffect, useState } from 'react'
import { Icon } from '../components/ui/Icon'
import { navItems } from '../routes/routes'
import type { ReactNode } from 'react'

type Theme = 'light' | 'dark'

export function AppLayout({ currentPath, onNavigate, children }: { currentPath: string; onNavigate: (path: string) => void; children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('lendit-theme')
    return savedTheme === 'dark' ? 'dark' : 'light'
  })
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('lendit-theme', theme)
  }, [theme])

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setMobileOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  const isActive = (path: string) => currentPath === path || (path !== '/' && currentPath.startsWith(path))

  function navigate(path: string) {
    onNavigate(path)
    setMobileOpen(false)
  }

  return (
    <div className="app-shell">
      <aside id="primary-sidebar"
        className={`sidebar ${mobileOpen ? 'sidebar-open' : ''}`}>
        <button
          type="button"
          className="brand"
          onClick={() => navigate('/dashboard')}
          aria-label="LendIt home"
        >          <div className="brand-mark">L</div>
          <div><strong>LendIt</strong><span>Lending Management</span></div>
        </button>
        <nav className="nav" aria-label="Primary navigation">
          {navItems.map((item) => <button key={item.path} className={`nav-item ${isActive(item.path) ? 'nav-item-active' : ''}`} onClick={() => navigate(item.path)}><Icon name={item.icon} /><span>{item.label}</span></button>)}
        </nav>
        <div className="sidebar-footer"><div className="user-chip"><div className="avatar">MM</div><div><strong>Manoj</strong><span>Administrator</span></div></div></div>
      </aside>

      <div className="main-shell">
        <header className="topbar">
          <button
            type="button"
            className="icon-button mobile-menu"
            aria-label="Open menu"
            aria-expanded={mobileOpen}
            aria-controls="primary-sidebar"
            onClick={() => setMobileOpen((value) => !value)}
          >
            <Icon name="menu" />
          </button>

          <div className="topbar-title">LMS Command Center</div>

          <div className="topbar-actions">
            <button
              type="button"
              className="icon-button"
              aria-label="Toggle theme"
              onClick={() =>
                setTheme((value) => value === 'light' ? 'dark' : 'light')
              }
            >
              <Icon name={theme === 'light' ? 'moon' : 'sun'} />
            </button>
          </div>
        </header>

        <main className="content">{children}</main>
      </div>


    </div>

  )
}
