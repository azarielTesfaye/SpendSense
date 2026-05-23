import { z } from "zod";

export const priceAlertInputSchema = z.object({
  itemId: z.string(),
  targetPrice: z.coerce.number().positive(),
  city: z.string().optional(),
  alertMethods: z.array(z.enum(["in-app", "email", "sms"])).min(1).optional(),
  expiry: z.enum(["1W", "1M", "3M"]).optional(),
});
