import { searchCustomers } from '../utils/customerSearch'
import { useEffect, useMemo, useState } from 'react'
import { Badge } from '../../../components/ui/Badge'
import { Button } from '../../../components/ui/Button'
import { Card } from '../../../components/ui/Card'
import { Icon } from '../../../components/ui/Icon'
import { EmptyState, ErrorState, LoadingState } from '../../../components/ui/States'
import { formatCurrency, formatDate } from '../../../lib/format'
import { listCustomers } from '../services/customerService'
import type { Customer } from '../../../types/domain'

const statusTone = { active: 'success', inactive: 'neutral', blocked: 'danger' } as const

export function CustomersPage({ onNavigate }: { onNavigate: (path: string) => void }) {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  async function load() {
    setLoading(true); setError(false)
    try { setCustomers(await listCustomers()) } catch { setError(true) } finally { setLoading(false) }
  }

  useEffect(() => { void load() }, [])

  const filtered = useMemo(
    () => searchCustomers(customers, query),
    [customers, query]
  )

  return (
    <div className="page-stack">
      <div className="page-heading"><div><p className="eyebrow">Customers</p><h1>Customers</h1><p className="page-subtitle">Manage borrower profiles and understand their relationship with LendIt.</p></div><Button><Icon name="plus" size={17} />Add customer</Button></div>

      <div className="metric-grid">
        <Card><span className="metric-label">Total customers</span><strong className="metric-value">{customers.length || '—'}</strong><span className="metric-note">Registered profiles</span></Card>
        <Card><span className="metric-label">Active</span><strong className="metric-value">{customers.filter((customer) => customer.status === 'active').length || '—'}</strong><span className="metric-note">Eligible for servicing</span></Card>
        <Card><span className="metric-label">Outstanding exposure</span><strong className="metric-value">{formatCurrency(customers.reduce((sum, customer) => sum + customer.outstanding, 0))}</strong><span className="metric-note">Across customer loans</span></Card>
      </div>

      <Card className="table-card">
        <div className="card-header"><div><h2>Customer directory</h2><p>Search by name, customer number, or phone.</p></div><button className="icon-button" aria-label="Refresh customers" onClick={() => void load()}><Icon name="refresh" /></button></div>
        <div className="table-toolbar"><label className="search-field"><Icon name="search" size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search customers" aria-label="Search customers" /></label><span className="result-count">{loading ? 'Loading' : `${filtered.length} result${filtered.length === 1 ? '' : 's'}`}</span></div>
        {loading ? <LoadingState label="Loading customers..." /> : error ? <ErrorState onRetry={() => void load()} /> : filtered.length === 0 ? <EmptyState title="No customers found" description="Try a different search term." /> : (
          <div className="table-wrap"><table><thead><tr><th>Customer</th><th>Type</th><th>Status</th><th>Outstanding</th><th>Created</th><th aria-label="Actions" /></tr></thead><tbody>{filtered.map((customer) => <tr key={customer.id} onDoubleClick={() => onNavigate(`/customers/${customer.id}`)}><td><div className="person-cell"><div className="avatar avatar-small">{customer.fullName.split(' ').map((part) => part[0]).slice(0, 2).join('')}</div><div><strong>{customer.fullName}</strong><span>{customer.customerNumber}</span></div></div></td><td className="capitalize">{customer.type}</td><td><Badge tone={statusTone[customer.status]}>{customer.status}</Badge></td><td>{formatCurrency(customer.outstanding)}</td><td>{formatDate(customer.createdAt)}</td><td><button className="text-button" onClick={() => onNavigate(`/customers/${customer.id}`)}>View</button></td></tr>)}</tbody></table></div>
        )}
      </Card>
      <p className="helper-note">Tip: open a customer by pressing <kbd>Tab</kbd> to the View action or double-clicking a row.</p>
    </div>
  )
}
