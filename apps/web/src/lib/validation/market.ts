import { z } from "zod";
import { paginatedSchema } from "./vendor";

export const priceAverageRowSchema = z.object({
  item_id: z.number(),
  item_name: z.string(),
  average_price: z.string(),
  city: z.string(),
  source: z.string(),
  count: z.number(),
});

export const trendPointSchema = z.object({
  date: z.string(),
  average_price: z.string(),
  count: z.number(),
});

export const forecastPointSchema = z.object({
  item_id: z.number(),
  forecast_date: z.string(),
  predicted_price: z.string(),
  confidence_low: z.string().nullable(),
  confidence_high: z.string().nullable(),
  model_used: z.string(),
  city: z.string().nullable().optional(),
});

export const inflationResponseSchema = z.object({
  period: z.string(),
  city: z.string().nullable(),
  item_id: z.number().nullable(),
  current_avg: z.string().nullable(),
  previous_avg: z.string().nullable(),
  change_percent: z.number().nullable(),
});

export const vendorPriceRowSchema = z.object({
  id: z.number(),
  vendor_id: z.string(),
  vendor_name: z.string(),
  city: z.string(),
  rating_avg: z.string(),
  is_verified: z.boolean(),
  price: z.string(),
  date: z.string(),
});

export const priceAverageListSchema = z
  .array(priceAverageRowSchema)
  .or(paginatedSchema(priceAverageRowSchema).transform((data) => data.results));

export const trendListSchema = z
  .array(trendPointSchema)
  .or(paginatedSchema(trendPointSchema).transform((data) => data.results));

export const forecastListSchema = z
  .array(forecastPointSchema)
  .or(paginatedSchema(forecastPointSchema).transform((data) => data.results));

export const vendorPriceListSchema = z
  .array(vendorPriceRowSchema)
  .or(paginatedSchema(vendorPriceRowSchema).transform((data) => data.results));
