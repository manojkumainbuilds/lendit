import { useCallback, useEffect, useState } from 'react'
import { Badge } from '../../../components/ui/Badge'
import { Button } from '../../../components/ui/Button'
import { Card } from '../../../components/ui/Card'
import { Icon } from '../../../components/ui/Icon'
import { ErrorState, LoadingState } from '../../../components/ui/States'
import { formatCurrency } from '../../../lib/format'
import { getCustomerById } from '../services/customerService'
import type { Customer } from '../../../types/domain'

export function CustomerDetailPage({ id, onBack }: { id: string; onBack: () => void }) {
  const [customer, setCustomer] = useState<Customer>()
  const [loadedId, setLoadedId] = useState<string>()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)


  const load = useCallback(async () => {
    try {
      const data = await getCustomerById(id)
      setCustomer(data)
      setLoadedId(id)
      setError(false)
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }, [id])

  function handleRetry() {
    setLoading(true)
    setError(false)
    void load()
  }

  useEffect(() => {
    void load()
  }, [load])

  if (error) return <ErrorState onRetry={handleRetry} />

  if (loading || loadedId !== id) {
    return <LoadingState label="Loading customer..." />
  }

  if (!customer) return <ErrorState onRetry={onBack} />

  return (
    <div className="page-stack">
      <button className="back-link" onClick={onBack}>← Back to customers</button>
      <div className="page-heading"><div><p className="eyebrow">Customer profile</p><h1>{customer.fullName}</h1><p className="page-subtitle">{customer.customerNumber} · {customer.phone}</p></div><Button variant="secondary">Edit profile</Button></div>
      <div className="detail-grid"><Card><div className="profile-header"><div className="avatar avatar-large">{customer.fullName.split(' ').map((part) => part[0]).slice(0, 2).join('')}</div><div><h2>{customer.fullName}</h2><p>{customer.email}</p></div><Badge tone={customer.status === 'active' ? 'success' : 'neutral'}>{customer.status}</Badge></div><div className="details-list"><div><span>Customer number</span><strong>{customer.customerNumber}</strong></div><div><span>Customer type</span><strong className="capitalize">{customer.type}</strong></div><div><span>Phone</span><strong>{customer.phone}</strong></div><div><span>Current exposure</span><strong>{formatCurrency(customer.outstanding)}</strong></div></div></Card><Card><div className="card-header"><div><h2>Next useful action</h2><p>Customer workspace will grow vertically from here.</p></div></div><div className="action-stack"><button className="action-row"><span><strong>View applications</strong><small>See current and historical credit requests</small></span><Icon name="arrow-right" /></button><button className="action-row"><span><strong>View loans</strong><small>Inspect active exposure and repayment history</small></span><Icon name="arrow-right" /></button><button className="action-row"><span><strong>View documents</strong><small>Review KYC and supporting documents</small></span><Icon name="arrow-right" /></button></div></Card></div>
    </div>
  )
}
