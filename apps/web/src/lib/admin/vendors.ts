import { apiClient } from "@/lib/api";
import { AdminVendorListResponse } from "@/types/api/admin-vendors";
import { adminVendorListSchema } from "@/lib/validation/admin-vendors";

export async function getPendingVendors() {
  const raw = await apiClient<AdminVendorListResponse>({
    method: "GET",
    endpoint: "/api/ecommerce/admin/vendors/",
    query: { status: "pending" },
    next: { tags: ["admin-vendors"] },
  });

  return adminVendorListSchema.parse(raw);
}
