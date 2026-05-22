import type { PaginatedResponse } from "./vendor";

export interface PriceAverageRow {
  item_id: number;
  item_name: string;
  average_price: string;
  city: string;
  source: string;
  count: number;
}

export type PriceAverageListResponse =
  | PriceAverageRow[]
  | PaginatedResponse<PriceAverageRow>;

export interface TrendPoint {
  date: string;
  average_price: string;
  count: number;
}

export type TrendListResponse = TrendPoint[] | PaginatedResponse<TrendPoint>;

export interface ForecastPoint {
  item_id: number;
  forecast_date: string;
  predicted_price: string;
  confidence_low: string | null;
  confidence_high: string | null;
  model_used: string;
  city?: string | null;
}

export type ForecastListResponse =
  | ForecastPoint[]
  | PaginatedResponse<ForecastPoint>;

export interface InflationResponse {
  period: string;
  city: string | null;
  item_id: number | null;
  current_avg: string | null;
  previous_avg: string | null;
  change_percent: number | null;
}

export interface VendorPriceRow {
  id: number;
  vendor_id: string;
  vendor_name: string;
  city: string;
  rating_avg: string;
  is_verified: boolean;
  price: string;
  date: string;
}

export type VendorPriceListResponse =
  | VendorPriceRow[]
  | PaginatedResponse<VendorPriceRow>;
