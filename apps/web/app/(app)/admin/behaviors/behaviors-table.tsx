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
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@workspace/ui/components/pagination";

export function BehaviorsTable() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pageParam = searchParams.get("page");
  const [page, setPage] = useState<number>(pageParam ? parseInt(pageParam) : 1);

  const { behaviors, pagination, isLoading, isError } = useBehaviors({
    limit: 10, // Default limit of 10 items per page
    page,
  });

  // Update URL when page changes
  useEffect(() => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));

    if (page > 1) {
      current.set("page", page.toString());
    } else {
      current.delete("page");
    }

    const search = current.toString();
    const query = search ? `?${search}` : "";

    router.push(`${window.location.pathname}${query}`, { scroll: false });
  }, [page, router, searchParams]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

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

          {pagination && pagination.totalPages > 1 && (
            <div className="mt-4">
              <Pagination>
                <PaginationContent>
                  {page > 1 && (
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => handlePageChange(page - 1)}
                      />
                    </PaginationItem>
                  )}

                  {/* First page */}
                  <PaginationItem>
                    <PaginationLink
                      isActive={page === 1}
                      onClick={() => handlePageChange(1)}
                    >
                      1
                    </PaginationLink>
                  </PaginationItem>

                  {/* Show ellipsis if there are more pages before current page */}
                  {page > 3 && (
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                  )}

                  {/* Page before current */}
                  {page > 2 && (
                    <PaginationItem>
                      <PaginationLink
                        onClick={() => handlePageChange(page - 1)}
                      >
                        {page - 1}
                      </PaginationLink>
                    </PaginationItem>
                  )}

                  {/* Current page (if not first or last) */}
                  {page !== 1 && page !== pagination.totalPages && (
                    <PaginationItem>
                      <PaginationLink isActive>{page}</PaginationLink>
                    </PaginationItem>
                  )}

                  {/* Page after current */}
                  {page < pagination.totalPages - 1 && (
                    <PaginationItem>
                      <PaginationLink
                        onClick={() => handlePageChange(page + 1)}
                      >
                        {page + 1}
                      </PaginationLink>
                    </PaginationItem>
                  )}

                  {/* Show ellipsis if there are more pages after current page */}
                  {page < pagination.totalPages - 2 && (
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                  )}

                  {/* Last page (if not first) */}
                  {pagination.totalPages > 1 && (
                    <PaginationItem>
                      <PaginationLink
                        isActive={page === pagination.totalPages}
                        onClick={() => handlePageChange(pagination.totalPages)}
                      >
                        {pagination.totalPages}
                      </PaginationLink>
                    </PaginationItem>
                  )}

                  {page < pagination.totalPages && (
                    <PaginationItem>
                      <PaginationNext
                        onClick={() => handlePageChange(page + 1)}
                      />
                    </PaginationItem>
                  )}
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
