import { z } from "zod";

export const shoppingListSchema = z.object({
  itemId: z.string().uuid(),
  quantity: z.number().positive(),
  unit: z.string(),
});
