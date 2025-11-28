import React from "react";
import Skeleton from "./Skeleton";

export default function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="p-4 sm:p-6 lg:p-8 mt-20">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-80" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white/5 border border-gray-800 rounded-2xl p-6">
                <Skeleton className="h-6 w-56 mb-4" />
                <Skeleton className="h-72 w-full" />
              </div>
              <div className="bg-white/5 border border-gray-800 rounded-2xl p-6">
                <Skeleton className="h-6 w-56 mb-4" />
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="bg-white/5 border border-gray-800 rounded-2xl p-6">
                <Skeleton className="h-6 w-56 mb-4" />
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-10 w-full" />
                  ))}
                </div>
              </div>
              <div className="bg-white/5 border border-gray-800 rounded-2xl p-6">
                <Skeleton className="h-6 w-40 mb-4" />
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-6 w-full" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


