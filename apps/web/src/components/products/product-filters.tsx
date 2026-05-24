"use client";

import React from "react";
import { Input } from "@repo/ui/components/input";
import { Button } from "@repo/ui/components/button";
import { Checkbox } from "@repo/ui/components/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@repo/ui/components/select";

type Props = {
  params: URLSearchParams;
};

export function ProductFilters({ params }: Props) {
  return (
    <div className="space-y-4 sticky top-6">
      <div>
        <label className="text-xs font-bold text-muted-foreground">Search</label>
        <Input defaultValue={params.get('q') ?? ''} placeholder="Search products, variants or descriptions" />
      </div>

      <div>
        <label className="text-xs font-bold text-muted-foreground">Category</label>
        <Select>
          <SelectTrigger className="w-full rounded-xl"> 
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="produce">Produce</SelectItem>
            <SelectItem value="grains">Grains</SelectItem>
            <SelectItem value="dairy">Dairy</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-xs font-bold text-muted-foreground">Price range (ETB)</label>
        <div className="flex items-center gap-2 mt-2">
          <Input type="number" placeholder="Min" />
          <Input type="number" placeholder="Max" />
        </div>
      </div>

      <div>
        <label className="text-xs font-bold text-muted-foreground">City</label>
        <Input placeholder="City or region" defaultValue={params.get('city') ?? ''} />
      </div>

      <div className="flex items-center gap-2">
        <Checkbox id="verified" />
        <label htmlFor="verified" className="text-sm font-medium">Verified vendors only</label>
      </div>

      <div className="pt-4">
        <Button className="w-full rounded-xl">Apply</Button>
      </div>
    </div>
  );
}

export default ProductFilters;
