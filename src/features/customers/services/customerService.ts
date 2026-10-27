
import { apiRequest } from "../../../services/apiClient";
import type { Customer, CustomerStatus } from "../../../types/domain";

interface FrappeCustomer {
  name: string;
  customer_number: string;
  customer_name: string;
  customer_type: "Individual" | "Business";
  phone?: string | null;
  email?: string | null;
  status: "Active" | "Inactive";
  creation?: string;
}

interface FrappeListResponse {
  data: FrappeCustomer[];
}

interface FrappeDocumentResponse {
  data: FrappeCustomer;
}

export interface CustomerInput {
  customerNumber: string;
  fullName: string;
  type: "individual" | "business";
  phone?: string;
  email?: string;
  status: CustomerStatus;
}

const fields = [
  "name",
  "customer_number",
  "customer_name",
  "customer_type",
  "phone",
  "email",
  "status",
  "creation",
];

function toCustomer(record: FrappeCustomer): Customer {
  return {
    id: record.name,
    customerNumber: record.customer_number,
    fullName: record.customer_name,
    phone: record.phone ?? "",
    email: record.email ?? "",
    status: record.status.toLowerCase() as CustomerStatus,
    type: record.customer_type === "Business" ? "business" : "individual",
    // Outstanding exposure will come from loan records once that API exists.
    outstanding: 0,
    createdAt: record.creation?.slice(0, 10) ?? "",
  };
}

function toFrappePayload(input: CustomerInput) {
  if (!input.customerNumber.trim()) {
    throw new Error("Customer number is required.");
  }

  if (!input.fullName.trim()) {
    throw new Error("Customer name is required.");
  }

  if (input.status === "blocked") {
    throw new Error(
      "The backend currently supports Active and Inactive customer statuses only.",
    );
  }

  return {
    customer_number: input.customerNumber.trim(),
    customer_name: input.fullName.trim(),
    customer_type: input.type === "business" ? "Business" : "Individual",
    phone: input.phone?.trim() ?? "",
    email: input.email?.trim() ?? "",
    status: input.status === "active" ? "Active" : "Inactive",
  };
}

export async function listCustomers(): Promise<Customer[]> {
  const params = new URLSearchParams({
    fields: JSON.stringify(fields),
    limit_page_length: "500",
    order_by: "creation desc",
  });

  const response = await apiRequest<FrappeListResponse>(
    `/api/resource/Customer?${params.toString()}`,
  );

  return response.data.map(toCustomer);
}

export async function getCustomerById(
  id: string,
): Promise<Customer | undefined> {
  const response = await apiRequest<FrappeDocumentResponse>(
    `/api/resource/Customer/${encodeURIComponent(id)}`,
  );

  return response.data ? toCustomer(response.data) : undefined;
}

export async function createCustomer(
  input: CustomerInput,
): Promise<Customer> {
  const response = await apiRequest<FrappeDocumentResponse>(
    "/api/resource/Customer",
    {
      method: "POST",
      body: JSON.stringify(toFrappePayload(input)),
    },
  );

  return toCustomer(response.data);
}

export async function updateCustomer(
  id: string,
  input: CustomerInput,
): Promise<Customer> {
  const response = await apiRequest<FrappeDocumentResponse>(
    `/api/resource/Customer/${encodeURIComponent(id)}`,
    {
      method: "PUT",
      body: JSON.stringify(toFrappePayload(input)),
    },
  );

  return toCustomer(response.data);
}
