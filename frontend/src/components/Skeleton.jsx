import React from "react";

export default function Skeleton({ className = "" }) {
  return (
    <div className={`animate-pulse bg-white/10 rounded ${className}`} />
  );
}

export function PageFallback() {
  return (
    <div className="min-h-screen bg-black text-white pt-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="space-y-4">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-80" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full md:col-span-2" />
        </div>
      </div>
    </div>
  );
}


