"use server";

import { z } from "zod";
import { priceAlertInputSchema } from "@/lib/validation/product-details";
import { apiClient, ApiError } from "@/lib/api";

type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; message: string };

export async function createPriceAlert(
  itemId: string,
  targetPrice: number,
  city?: string,
): Promise<ActionResult<{ alertId: string }>> {
  const parsed = priceAlertInputSchema.parse({ itemId, targetPrice, city });
  try {
    const data = await apiClient<{ id: number }>({
      method: "POST",
      endpoint: "/api/market/price-alerts/",
      body: {
        item: Number(parsed.itemId),
        target_price: parsed.targetPrice,
        city: parsed.city || undefined,
      },
    });
    return { success: true, data: { alertId: String(data.id) } };
  } catch (error) {
    if (error instanceof ApiError) return { success: false, message: error.message };
    return { success: false, message: "Internal Server Error" };
  }
}

export async function deletePriceAlert(alertId: string): Promise<ActionResult<void>> {
  try {
    await apiClient<void>({
      method: "DELETE",
      endpoint: `/api/market/price-alerts/${alertId}/`,
    });
    return { success: true, data: undefined };
  } catch (error) {
    if (error instanceof ApiError) return { success: false, message: error.message };
    return { success: false, message: "Internal Server Error" };
  }
}
