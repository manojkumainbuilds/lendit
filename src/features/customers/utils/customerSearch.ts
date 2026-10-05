import type { Customer } from "../../../types/domain"

export function searchCustomers(
    customers: Customer[],
    query: string
): Customer[] {
    const normalizedQuery = query.toLowerCase()

    return customers.filter((customer) =>
        `${customer.fullName} ${customer.customerNumber} ${customer.phone}`
            .toLowerCase()
            .includes(normalizedQuery)
    )
}