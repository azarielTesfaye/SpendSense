import { getVendors } from "@/lib/vendors";
import { VendorMapClient } from "@/components/vendors/vendor-map-client";

export const metadata = {
  title: "Vendor Map Discovery | SpendSense",
  description: "Locate verified sellers and find cheap price zones near you.",
};

export default async function VendorMapPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;
  
  // Reuse the robust fetching logic with all filtering & search parameters active
  const data = await getVendors({
    ...resolvedParams,
    // Maximize page size for comprehensive map discovery
    pageSize: 100,
  });

  return <VendorMapClient initialData={data} searchParams={resolvedParams} />;
}
