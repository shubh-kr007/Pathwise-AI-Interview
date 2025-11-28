import React from "react";
import Skeleton from "./Skeleton";

export default function InterviewRoomSkeleton() {
  return (
    <div className="bg-white/5 border border-gray-800 rounded-2xl p-6">
      <div className="mb-4">
        <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-12" />
        </div>
        <Skeleton className="h-2 w-full" />
      </div>
      <Skeleton className="h-6 w-2/3 mb-4" />
      <div className="space-y-3">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
      <div className="mt-6 flex items-center justify-between">
        <div className="flex gap-2">
          <Skeleton className="h-10 w-28" />
          <Skeleton className="h-10 w-28" />
        </div>
        <Skeleton className="h-10 w-28" />
      </div>
    </div>
  );
}


