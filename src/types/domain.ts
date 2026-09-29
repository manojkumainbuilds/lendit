export type CustomerStatus = 'active' | 'inactive' | 'blocked'

export interface Customer {
  id: string
  fullName: string
  customerNumber: string
  phone: string
  email: string
  status: CustomerStatus
  type: 'individual' | 'business'
  outstanding: number
  createdAt: string
}

export type ApplicationStatus =
  | 'draft'
  | 'submitted'
  | 'under_review'
  | 'needs_information'
  | 'approved'
  | 'rejected'
  | 'withdrawn'

export type LoanStatus =
  | 'pending_disbursement'
  | 'active'
  | 'matured'
  | 'cancelled'
  | 'written_off'
  | 'closed'
