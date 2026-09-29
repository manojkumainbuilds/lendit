import type { Customer } from '../../../types/domain'

const customers: Customer[] = [
  {
    id: 'cust-001', fullName: 'Amina Banda', customerNumber: 'CUS-000184', phone: '+260 97 123 4567',
    email: 'amina.banda@example.com', status: 'active', type: 'individual', outstanding: 18500, createdAt: '2026-08-12',
  },
  {
    id: 'cust-002', fullName: 'David Mwansa', customerNumber: 'CUS-000219', phone: '+260 96 554 1182',
    email: 'david.mwansa@example.com', status: 'active', type: 'individual', outstanding: 0, createdAt: '2026-08-18',
  },
  {
    id: 'cust-003', fullName: 'Greenline Traders', customerNumber: 'CUS-000227', phone: '+260 95 781 0091',
    email: 'accounts@greenline.example.com', status: 'active', type: 'business', outstanding: 74000, createdAt: '2026-08-21',
  },
  {
    id: 'cust-004', fullName: 'Chanda Phiri', customerNumber: 'CUS-000241', phone: '+260 97 880 4102',
    email: 'chanda.phiri@example.com', status: 'inactive', type: 'individual', outstanding: 0, createdAt: '2026-08-27',
  },
]

export async function listCustomers(): Promise<Customer[]> {
  await Promise.resolve()
  return customers
}

export async function getCustomerById(id: string): Promise<Customer | undefined> {
  await Promise.resolve()
  return customers.find((customer) => customer.id === id)
}
