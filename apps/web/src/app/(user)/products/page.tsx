import React from "react";
import { createApiClient } from "@/services/apiClient";
import type { VendorPriceListResponse, VendorPriceListing } from "@/types/api/product-listing";
import { ProductCard } from "@/components/products/product-card";
import ProductFilters from "@/components/products/product-filters";
import { Card, CardContent } from "@repo/ui/components/card";
import { Button } from "@repo/ui/components/button";

type Props = {
  searchParams?: { [key: string]: string | string[] | undefined };
};

export default async function ProductsPage({ searchParams }: Props) {
  const params = new URLSearchParams();
  const page = String((searchParams?.page as string) ?? '1');
  const pageSize = String((searchParams?.pageSize as string) ?? '12');

  if (searchParams?.q) params.set('q', String(searchParams.q));
  if (searchParams?.category) params.set('category', String(searchParams.category));
  if (searchParams?.city) params.set('city', String(searchParams.city));
  params.set('page', page);
  params.set('page_size', pageSize);

  const api = createApiClient();

  let listings: VendorPriceListing[] = [];
  let total = 0;

  try {
    const res = await api.get<VendorPriceListResponse>('/api/market/vendors/prices', { params: Object.fromEntries(params) });
    listings = (res.data && (res.data.results || [])) as VendorPriceListing[];
    total = res.data?.count ?? listings.length;
  } catch (err) {
    console.error('Failed to load listings', err);
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-extrabold">Products</h2>
          <p className="text-muted-foreground">Browse aggregated product listings across verified vendors.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost">Sort</Button>
          <Button>New Listing</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <aside className="lg:col-span-3">
          <Card className="rounded-2xl p-4">
            <CardContent>
              <ProductFilters params={new URLSearchParams(Object.entries(Object.fromEntries(params)))} />
            </CardContent>
          </Card>
        </aside>

        <section className="lg:col-span-9">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((l) => (
              <ProductCard key={String(l.id)} listing={l} />
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-center gap-3 mt-8">
            <Button variant="outline">Previous</Button>
            <div className="text-sm font-bold">Page {page} • {total} results</div>
            <Button>Next</Button>
          </div>
        </section>
      </div>
    </div>
  );
}
