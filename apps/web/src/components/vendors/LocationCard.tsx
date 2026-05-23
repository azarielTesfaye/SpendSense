"use client";

import React from "react";
import { MapPin, Navigation, Compass } from "lucide-react";
import { Button } from "@repo/ui/components/button";
import { Badge } from "@repo/ui/components/badge";

interface LocationCardProps {
  address: string;
  region: string;
  lat?: number | null;
  lng?: number | null;
  deliveryRadius?: number; // km
}

export default function LocationCard({
  address,
  region,
  lat,
  lng,
  deliveryRadius = 5,
}: LocationCardProps) {
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    `${address}, ${region}`
  )}`;

  const searchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${address}, ${region}`
  )}`;

  // Styled SVG Vector Map mockup that matches SpendSense sleek dark/light mode and looks state-of-the-art
  const renderMapMockup = () => (
    <div className="relative w-full h-48 bg-[#e5e9f0] dark:bg-[#1a2333] overflow-hidden flex items-center justify-center select-none border-b">
      {/* Grid Pattern/Roads */}
      <svg className="absolute inset-0 w-full h-full opacity-60" xmlns="http://www.w3.org/2000/svg">
        {/* River/Waterbody */}
        <path
          d="M-20,100 C100,80 150,150 400,120 L400,200 L-20,200 Z"
          fill="rgba(59, 130, 246, 0.15)"
          className="dark:fill-blue-900/10"
        />
        {/* Park Area */}
        <rect
          x="30"
          y="20"
          width="120"
          height="70"
          rx="10"
          fill="rgba(16, 185, 129, 0.12)"
          className="dark:fill-emerald-950/10"
        />
        {/* Road networks */}
        <line x1="0" y1="50" x2="400" y2="50" stroke="var(--border)" strokeWidth="8" />
        <line x1="0" y1="50" x2="400" y2="50" stroke="white" strokeWidth="2" className="dark:stroke-slate-800" />
        
        <line x1="180" y1="0" x2="180" y2="200" stroke="var(--border)" strokeWidth="12" />
        <line x1="180" y1="0" x2="180" y2="200" stroke="white" strokeWidth="4" className="dark:stroke-slate-800" />

        <line x1="80" y1="0" x2="250" y2="200" stroke="var(--border)" strokeWidth="6" strokeDasharray="5,5" />
        
        {/* Surrounding mock dots/venues */}
        <circle cx="90" cy="40" r="4" fill="rgba(156, 163, 175, 0.5)" />
        <circle cx="280" cy="120" r="4" fill="rgba(156, 163, 175, 0.5)" />
        <circle cx="210" cy="80" r="5" fill="rgba(59, 130, 246, 0.4)" />
      </svg>

      {/* Target Pin Marker with waves */}
      <div className="absolute flex flex-col items-center justify-center z-10">
        <span className="absolute inline-flex h-12 w-12 rounded-full bg-blue-500/20 animate-ping" />
        <div className="bg-blue-600 text-white p-2.5 rounded-full shadow-lg border-2 border-white dark:border-slate-900 flex items-center justify-center">
          <MapPin className="w-5 h-5 fill-current" />
        </div>
      </div>

      {/* Compass Widget */}
      <div className="absolute bottom-3 right-3 bg-background/90 border p-1.5 rounded-full shadow-md text-foreground hidden sm:block">
        <Compass className="w-4 h-4 animate-spin-slow" />
      </div>
    </div>
  );

  return (
    <div className="border rounded-2xl overflow-hidden bg-card shadow-sm space-y-4 pb-5 flex flex-col h-full">
      {/* Mock Map Preview */}
      {renderMapMockup()}

      {/* Address Details */}
      <div className="px-5 space-y-4 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <h4 className="font-bold text-foreground text-sm flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
              Shop Location
            </h4>
            <Badge variant="secondary" className="bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400 text-[10px] font-semibold border-none rounded-full px-2 py-0.5">
              Delivers within {deliveryRadius}km
            </Badge>
          </div>
          <p className="text-sm text-foreground leading-snug font-medium">
            {address}
          </p>
          <p className="text-xs text-muted-foreground font-medium">
            {region}, Ethiopia
          </p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="w-full text-xs font-semibold py-2 rounded-lg cursor-pointer"
          >
            <a href={searchUrl} target="_blank" rel="noopener noreferrer">
              View on Maps
            </a>
          </Button>
          <Button
            asChild
            size="sm"
            className="w-full text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg gap-1.5 cursor-pointer"
          >
            <a href={directionsUrl} target="_blank" rel="noopener noreferrer">
              <Navigation className="w-3.5 h-3.5" />
              Directions
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
