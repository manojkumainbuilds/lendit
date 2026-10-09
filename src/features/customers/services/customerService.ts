import type { Customer } from '../../../types/domain'
import { mockCustomers } from '../mocks/customerMocks'

export async function listCustomers(): Promise<Customer[]> {
  return mockCustomers.map((customer) => ({ ...customer }))
}

export async function getCustomerById(
  id: string,
): Promise<Customer | undefined> {
  const customer = mockCustomers.find((customer) => customer.id === id)

  return customer ? { ...customer } : undefined
}