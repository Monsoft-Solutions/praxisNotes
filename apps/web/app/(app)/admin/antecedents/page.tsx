import { Suspense } from "react";
import { Card, CardContent, CardHeader } from "@workspace/ui/components/card";

import { Skeleton } from "@workspace/ui/components/skeleton";
import { AntecedentsTable } from "./antecedents-table";

// Loading fallback component
function AntecedentsTableSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <Skeleton className="h-10 w-[250px]" />
        <Skeleton className="h-10 w-[120px]" />
      </div>
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-[200px]" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function AntecedentsPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Antecedents</h2>
      </div>
      <Suspense fallback={<AntecedentsTableSkeleton />}>
        <AntecedentsTable />
      </Suspense>
    </div>
  );
}
