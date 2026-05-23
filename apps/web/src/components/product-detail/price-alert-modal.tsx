"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { priceAlertInputSchema } from "@/lib/validation/product-details";
import { z } from "zod";
import { createPriceAlert } from "@/actions/price-alerts";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@repo/ui/components/dialog";
import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";

type AlertFormData = z.infer<typeof priceAlertInputSchema>;

interface PriceAlertModalProps {
  itemId: string;
  isOpen: boolean;
  onClose: () => void;
  city?: string;
}

export function PriceAlertModal({ itemId, isOpen, onClose, city }: PriceAlertModalProps) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<AlertFormData>({
    resolver: zodResolver(priceAlertInputSchema) as any,
    defaultValues: {
      itemId,
      targetPrice: "" as unknown as number,
      city: city && city !== "All Regions" ? city : undefined,
    },
  });

  const onSubmit = (data: AlertFormData) => {
    startTransition(async () => {
      const result = await createPriceAlert(data.itemId, data.targetPrice, data.city);
      if (result.success) {
        toast.success(`Alert set! We'll notify you when price drops below ${data.targetPrice} ETB.`);
        onClose();
        form.reset();
      } else {
        toast.error(result.message || "Failed to set alert");
      }
    });
  };

  const setPreset = (val: number) => {
    form.setValue("targetPrice", val, { shouldValidate: true });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Set Price Alert</DialogTitle>
          <DialogDescription>
            Notify me when the price drops below my target.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
          <div className="space-y-3">
            <Label htmlFor="targetPrice">Target Price (ETB)</Label>
            <Input 
              id="targetPrice" 
              type="number" 
              placeholder="e.g. 100" 
              {...form.register("targetPrice")}
            />
            {form.formState.errors.targetPrice && (
              <p className="text-sm text-red-500">{form.formState.errors.targetPrice.message}</p>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {[110, 105, 100].map((val) => (
              <Button
                key={val}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setPreset(val)}
                className="text-xs"
              >
                {val} ETB
              </Button>
            ))}
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white" disabled={isPending}>
              {isPending ? "Setting..." : "Set Alert"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
