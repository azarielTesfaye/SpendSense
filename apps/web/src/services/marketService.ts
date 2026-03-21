import { createApiClient } from "./apiClient";

export type MarketItem = {
  id: number;
  name: string;
  category: string;
  unit: string;
};

export type PriceAverageRow = {
  item_id: number;
  item_name: string;
  average_price: string;
  city: string;
  source: string;
  count: number;
};

export type SubmitPricePayload = {
  item_id: number;
  price_value: number | string;
  market_location: string;
  city: string;
  date_observed: string; // YYYY-MM-DD
};

export type PriceSubmissionResponse = {
  id: string;
  item_id: number;
  price_value: string;
  market_location: string;
  city: string;
  date_observed: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
  outlier_warning?: string | null;
};

export async function getPriceAverages(params?: {
  item_id?: number;
  city?: string;
  from_date?: string;
  to_date?: string;
}): Promise<PriceAverageRow[]> {
  const api = createApiClient();
  const { data } = await api.get<PriceAverageRow[]>("/api/market/prices/averages/", { params });
  return data;
}

export async function getItems(): Promise<MarketItem[]> {
  const api = createApiClient();
  const { data } = await api.get<MarketItem[]>("/api/market/items/");
  return data;
}

export async function submitPrice(accessToken: string, payload: SubmitPricePayload): Promise<PriceSubmissionResponse> {
  const api = createApiClient(() => accessToken);
  const { data } = await api.post<PriceSubmissionResponse>("/api/market/prices/submit/", payload);
  return data;
}

