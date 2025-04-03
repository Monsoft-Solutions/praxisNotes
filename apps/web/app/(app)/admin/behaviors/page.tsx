import { Suspense } from "react";
import { Behavior } from "@praxisnotes/database";
import { db } from "@/lib/db";
import { eq, isNull, or } from "drizzle-orm";
import { behaviors } from "@praxisnotes/database";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@workspace/ui/components/table";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import { PlusIcon } from "lucide-react";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { requireAdmin } from "@/lib/auth/admin.utils";

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

// Behaviors table component
async function BehaviorsTable() {
  const session = await requireAdmin();
  const { organizationId } = session.user;

  const behaviorsList = await db
    .select()
    .from(behaviors)
    .where(
      or(
        isNull(behaviors.organizationId),
        eq(behaviors.organizationId, organizationId),
      ),
    )
    .orderBy(behaviors.name);

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <h3 className="text-xl font-semibold">Behaviors Management</h3>
        <Button size="sm">
          <PlusIcon className="mr-2 h-4 w-4" />
          Add Behavior
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Behaviors</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Scope</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {behaviorsList.map((behavior: Behavior) => (
                <TableRow key={behavior.id}>
                  <TableCell className="font-medium">{behavior.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {behavior.category || "Uncategorized"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {behavior.organizationId ? (
                      <Badge>Organization</Badge>
                    ) : (
                      <Badge variant="secondary">Global</Badge>
                    )}
                  </TableCell>
                  <TableCell className="max-w-[300px] truncate">
                    {behavior.description || "No description"}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                      <Button variant="destructive" size="sm">
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}

              {behaviorsList.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    No behaviors found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
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
