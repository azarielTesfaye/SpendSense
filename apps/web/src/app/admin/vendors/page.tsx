export const dynamic = "force-dynamic";

import AdminPanelShell from "../_components/admin-panel-shell";
import { apiClient, ApiError } from "@/lib/api";

import { adminVendorListSchema } from "@/lib/validation/admin-vendors";
import { z } from "zod";

type Vendor = z.infer<typeof import("@/lib/validation/admin-vendors").adminVendorSchema>;

export default async function AdminPanelVendorsPage() {
  let vendors: Vendor[] = [];

  try {
    const raw = await apiClient({
      method: "GET",
      endpoint: "/api/ecommerce/admin/vendors/",
      next: { revalidate: 300, tags: ["admin-vendors"] },
    });

    const parsed = adminVendorListSchema.parse(raw);
    vendors = parsed.results;
  } catch (err) {
    if (err instanceof ApiError) {
      console.error("API error fetching vendors:", err.message, err.payload);
    } else {
      console.error("Vendors parse/fetch error:", err);
    }
  }

  // Derive summary statistics
  const verifiedCount = vendors.filter((v) => v.is_verified).length;
  const pendingCount = vendors.length - verifiedCount;

  return (
    <AdminPanelShell
      activeTab="vendors"
      subtitle="Review vendor onboarding status and manage marketplace participation."
      title="Vendor Management"
    >
      <section className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <Tile label="Total Vendors" value={String(vendors.length)} />
        <Tile label="Verified" value={String(verifiedCount)} />
        <Tile label="Pending" value={String(pendingCount)} />
        <Tile label="Flagged" value="0" />
      </section>

      <section className="mt-8 overflow-hidden rounded-xl bg-white shadow-sm">
        <div className="border-b border-slate-100 p-6">
          <h3 className="text-lg font-bold">Vendors Directory</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-[11px] uppercase tracking-widest text-slate-500">
              <tr>
                <th className="px-6 py-4">Shop Name</th>
                <th className="px-6 py-4">City</th>
                <th className="px-6 py-4">Joined At</th>
                <th className="px-6 py-4">Rating</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {vendors.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-slate-400">
                    No vendors found.
                  </td>
                </tr>
              ) : (
                vendors.map((vendor) => (
                  <tr key={vendor.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-bold text-slate-900">
                      {vendor.shop_name}
                    </td>
                    <td className="px-6 py-4 text-slate-500">{vendor.city}</td>
                    <td className="px-6 py-4 text-slate-500">
                      {new Date(vendor.joined_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-slate-700">
                      ⭐ {vendor.rating_avg} ({vendor.rating_count})
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={[
                          "rounded-full px-2.5 py-1 text-xs font-bold",
                          vendor.is_verified
                            ? "bg-green-100 text-green-700"
                            : "bg-amber-100 text-amber-700",
                        ].join(" ")}
                      >
                        {vendor.is_verified ? "Verified" : "Pending"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        className="rounded-lg px-3 py-1.5 text-xs font-bold text-blue-700 hover:bg-blue-50"
                        type="button"
                      >
                        Review
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </AdminPanelShell>
  );
}

function Tile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-white p-6 shadow-sm">
      <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-2xl font-black text-slate-900">{value}</p>
    </div>
  );
}