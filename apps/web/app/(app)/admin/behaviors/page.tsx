import { Suspense } from "react";
import { Card, CardContent, CardHeader } from "@workspace/ui/components/card";

import { Skeleton } from "@workspace/ui/components/skeleton";
import { BehaviorsTable } from "./behaviors-table";

// Loading fallback component
function BehaviorsTableSkeleton() {
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

export default function BehaviorsPage() {
  return (
    <Suspense fallback={<BehaviorsTableSkeleton />}>
      <BehaviorsTable />
    </Suspense>
  );
}
