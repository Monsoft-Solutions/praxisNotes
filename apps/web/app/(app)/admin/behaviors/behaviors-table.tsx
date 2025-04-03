"use client";

import { Behavior } from "@praxisnotes/database";
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
import { useBehaviors } from "@/hooks/use-behaviors";

export function BehaviorsTable() {
  const { behaviors, isLoading, isError } = useBehaviors({
    limit: 100, // We'll fetch all behaviors for now, could implement pagination later
  });

  if (isError) {
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
          <CardContent className="flex h-40 items-center justify-center">
            <p className="text-destructive">
              Error loading behaviors. Please try again later.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

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
              {behaviors.map((behavior: Behavior) => (
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

              {behaviors.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    {isLoading ? "Loading behaviors..." : "No behaviors found"}
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
