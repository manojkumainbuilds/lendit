import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { AppLayout } from '../layouts/AppLayout'
import { CustomersPage } from '../features/customers/components/CustomersPage'
import { CustomerDetailPage } from '../features/customers/components/CustomerDetailPage'

function Placeholder({ title }: { title: string }) {
  return <div className="page-stack"><div className="page-heading"><div><p className="eyebrow">LendIt</p><h1>{title}</h1><p className="page-subtitle">This destination is reserved for the next vertical slice.</p></div></div></div>
}

function Dashboard() {
  return <div className="page-stack"><div className="page-heading"><div><p className="eyebrow">Wednesday, 30 Sep 2026</p><h1>Good morning, Manoj.</h1><p className="page-subtitle">Start with the work that needs a decision, not more dashboards.</p></div></div><div className="metric-grid"><div className="card hero-card"><span className="metric-label">Portfolio snapshot</span><strong className="metric-value">ZMW 92.5k</strong><span className="metric-note">Current outstanding exposure</span></div><div className="card"><span className="metric-label">Applications needing work</span><strong className="metric-value">12</strong><span className="metric-note">4 need information</span></div><div className="card"><span className="metric-label">Overdue installments</span><strong className="metric-value">7</strong><span className="metric-note">Across 5 loans</span></div></div><div className="two-column"><div className="card"><div className="card-header"><div><h2>Work to do</h2><p>High-value actions surfaced first.</p></div></div><div className="action-stack"><button className="action-row"><span><strong>Review 4 applications</strong><small>Information is missing</small></span><span className="action-count">4</span></button><button className="action-row"><span><strong>Follow up on overdue loans</strong><small>5 borrowers need attention</small></span><span className="action-count">5</span></button></div></div><div className="card"><div className="card-header"><div><h2>Lifecycle</h2><p>Today's simple view of the lending flow.</p></div></div><div className="lifecycle"><span>Customers</span><span>Applications</span><span>Approvals</span><span>Loans</span><span>Collections</span></div></div></div></div>
}

export function AppRouter() {
  const [path, setPath] = useState(() => window.location.pathname === '/' ? '/dashboard' : window.location.pathname)
  useEffect(() => { const onPopState = () => setPath(window.location.pathname); window.addEventListener('popstate', onPopState); return () => window.removeEventListener('popstate', onPopState) }, [])
  function navigate(nextPath: string) { window.history.pushState({}, '', nextPath); setPath(nextPath) }

  let content: ReactNode
  if (path === '/dashboard') content = <Dashboard />
  else if (path === '/customers') content = <CustomersPage onNavigate={navigate} />
  else if (path.startsWith('/customers/')) content = <CustomerDetailPage id={path.split('/')[2] ?? ''} onBack={() => navigate('/customers')} />
  else { const label = path.split('/')[1] || 'Dashboard'; content = <Placeholder title={label.charAt(0).toUpperCase() + label.slice(1)} /> }

  return <AppLayout currentPath={path} onNavigate={navigate}>{content}</AppLayout>
}