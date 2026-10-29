
import { useEffect, useState } from 'react'
import { Button } from '../../../components/ui/Button'
import { Card } from '../../../components/ui/Card'
import { createCustomer, getCustomerById, updateCustomer } from '../services/customerService'
import type { CustomerInput } from '../services/customerService'
import type { Customer } from '../../../types/domain'

type CustomerFormPageProps = {
  id?: string
  onNavigate: (path: string) => void
}

type FormValues = {
  customerNumber: string
  fullName: string
  type: 'individual' | 'business'
  phone: string
  email: string
  status: 'active' | 'inactive'
}

const initialValues: FormValues = {
  customerNumber: '',
  fullName: '',
  type: 'individual',
  phone: '',
  email: '',
  status: 'active',
}

function toFormValues(customer: Customer): FormValues {
  return {
    customerNumber: customer.customerNumber,
    fullName: customer.fullName,
    type: customer.type,
    phone: customer.phone,
    email: customer.email,
    status: customer.status === 'inactive' ? 'inactive' : 'active',
  }
}

export function CustomerFormPage({ id, onNavigate }: CustomerFormPageProps) {
  const isEditing = Boolean(id)
  const [values, setValues] = useState<FormValues>(initialValues)
  const [loading, setLoading] = useState(isEditing)
  const [saving, setSaving] = useState(false)
  const [loadError, setLoadError] = useState('')
  const [saveError, setSaveError] = useState('')

  useEffect(() => {
    if (!id) return

    let cancelled = false

    async function loadCustomer() {
      setLoading(true)
      setLoadError('')

      try {
        const customer = await getCustomerById(id!)

        if (!customer) {
          throw new Error('Customer not found.')
        }

        if (!cancelled) {
          setValues(toFormValues(customer))
        }
      } catch (error) {
        if (!cancelled) {
          setLoadError(
            error instanceof Error ? error.message : 'Unable to load this customer.',
          )
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    void loadCustomer()

    return () => {
      cancelled = true
    }
  }, [id])

  function updateField<K extends keyof FormValues>(
    field: K,
    value: FormValues[K],
  ) {
    setValues((current) => ({ ...current, [field]: value }))
    setSaveError('')
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (saving) return

    setSaving(true)
    setSaveError('')

    const input: CustomerInput = {
      ...values,
      customerNumber: values.customerNumber.trim(),
      fullName: values.fullName.trim(),
      phone: values.phone.trim(),
      email: values.email.trim(),
    }

    try {
      const saved = id
        ? await updateCustomer(id, input)
        : await createCustomer(input)

      onNavigate(`/customers/${encodeURIComponent(saved.id)}`)

    } catch (error) {
      const message =
        error instanceof Error ? error.message : ''

      const isDuplicateCustomerNumber =
        message.toLowerCase().includes('customer number must be unique')

      setSaveError(
        isDuplicateCustomerNumber
          ? 'This customer number already exists. Please enter a different customer number.'
          : message || 'Unable to save the customer. Please try again.',
      )
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="state-panel"><span className="spinner" /><span>Loading customer details...</span></div>
  }

  if (loadError) {
    return (
      <div className="state-panel state-error" role="alert">
        <strong>Could not load customer</strong>
        <span>{loadError}</span>
        <Button variant="secondary" onClick={() => onNavigate('/customers')}>
          Back to customers
        </Button>
      </div>
    )
  }

  return (
    <div className="page-stack">
      <button
        className="back-link"
        type="button"
        onClick={() => onNavigate(id ? `/customers/${encodeURIComponent(id)}` : '/customers')}
      >
        ← {id ? 'Back to customer' : 'Back to customers'}
      </button>

      <div className="page-heading">
        <div>
          <p className="eyebrow">Customer management</p>
          <h1>{isEditing ? 'Edit customer' : 'Add customer'}</h1>
          <p className="page-subtitle">
            {isEditing
              ? 'Update the borrower profile and save your changes.'
              : 'Create a borrower profile to start their LendIt journey.'}
          </p>
        </div>
      </div>

      <Card className="customer-form-card">
        <form onSubmit={handleSubmit} className="customer-form">
          <div className="form-section-heading">
            <h2>Basic information</h2>
            <p>Fields marked with * are required.</p>
          </div>

          <div className="form-grid">
            {id && (
              <label className="form-field">
                <span>Customer number</span>
                <input
                  name="customerNumber"
                  value={values.customerNumber}
                  readOnly
                  aria-readonly="true"
                />
                <small>
                  Assigned by the system. Customer numbers cannot be changed.
                </small>
              </label>
            )}

            <label className="form-field">
              <span>Customer name *</span>
              <input
                name="fullName"
                value={values.fullName}
                onChange={(event) => updateField('fullName', event.target.value)}
                placeholder="Enter full name or business name"
                maxLength={140}
                autoComplete="name"
                required
              />
            </label>

            <label className="form-field">
              <span>Customer type *</span>
              <select
                name="type"
                value={values.type}
                onChange={(event) => updateField('type', event.target.value as FormValues['type'])}
                required
              >
                <option value="individual">Individual</option>
                <option value="business">Business</option>
              </select>
            </label>

            <label className="form-field">
              <span>Status *</span>
              <select
                name="status"
                value={values.status}
                onChange={(event) => updateField('status', event.target.value as FormValues['status'])}
                required
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </label>

            <label className="form-field">
              <span>Phone number</span>
              <input
                name="phone"
                type="tel"
                value={values.phone}
                onChange={(event) => updateField('phone', event.target.value)}
                placeholder="Enter phone number"
                autoComplete="tel"
              />
            </label>

            <label className="form-field">
              <span>Email address</span>
              <input
                name="email"
                type="email"
                value={values.email}
                onChange={(event) => updateField('email', event.target.value)}
                placeholder="name@example.com"
                autoComplete="email"
              />
            </label>
          </div>

          {saveError && (
            <div className="form-error" role="alert">
              <strong>Could not save customer</strong>
              <span>{saveError}</span>
            </div>
          )}

          <div className="form-actions">
            <Button
              type="button"
              variant="secondary"
              disabled={saving}
              onClick={() => onNavigate(id ? `/customers/${encodeURIComponent(id)}` : '/customers')}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving
                ? 'Saving...'
                : isEditing
                  ? 'Save changes'
                  : 'Create customer'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
